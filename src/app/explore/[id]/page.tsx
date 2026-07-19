"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Clock,
  Calendar,
  BarChart2,
  BookOpen,
  CheckCircle,
  Loader2,
  GitFork,
} from "lucide-react";
import type { Roadmap } from "@/lib/types";
import { getAuthToken } from "@/lib/getAuthToken";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

function DifficultyBadge({ level }: { level: string }) {
  const cls =
    level === "Beginner"
      ? "badge-beginner"
      : level === "Advanced"
      ? "badge-advanced"
      : "badge-intermediate";
  return <span className={cls}>{level}</span>;
}

export default function RoadmapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [forking, setForking] = useState(false);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/roadmaps/${id}`);
        const data = await res.json();
        if (data.success) setRoadmap(data.data);
        else toast.error("Roadmap not found");
      } catch {
        toast.error("Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  const handleFork = async () => {
    if (!session) {
      toast.info("Please sign in to add this roadmap to your dashboard");
      router.push("/auth/signin");
      return;
    }
    setForking(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${SERVER_URL}/api/roadmaps/${id}/fork`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Added to your dashboard! Redirecting…");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fork roadmap";
      toast.error(errorMsg);
    } finally {
      setForking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
        <Loader2 size={48} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <BookOpen size={64} style={{ color: "rgba(255,255,255,0.1)" }} />
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Roadmap not found.</p>
        <Link href="/explore">
          <button className="btn-outline">← Back to Explore</button>
        </Link>
      </div>
    );
  }

  const infoBlocks = [
    { icon: <BarChart2 size={18} />, label: "Difficulty", value: <DifficultyBadge level={roadmap.difficulty} /> },
    { icon: <BookOpen size={18} />, label: "Subject", value: roadmap.subject },
    { icon: <Clock size={18} />, label: "Estimated Hours", value: `${roadmap.estimatedHours} hours` },
    {
      icon: <Calendar size={18} />,
      label: "Target Deadline",
      value: new Date(roadmap.deadline).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" }),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Back */}
        <Link href="/explore">
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: "0.875rem",
              marginBottom: "2rem",
              transition: "color 0.2s",
            }}
          >
            <ArrowLeft size={16} /> Back to Explore
          </button>
        </Link>

        {/* Header card */}
        <div className="glass" style={{ borderRadius: "1.25rem", marginBottom: "1.5rem", overflow: "hidden" }}>
          {roadmap.imageUrl && (
            <img
              src={roadmap.imageUrl}
              alt={roadmap.title}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          )}
          <div style={{ padding: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.4)",
                      background: "rgba(255,255,255,0.06)",
                      padding: "0.2rem 0.8rem",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {roadmap.subject}
                  </span>
                  <DifficultyBadge level={roadmap.difficulty} />
                </div>
                <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                  {roadmap.title}
                </h1>
              </div>

              <button
                id="btn-start-studying"
                onClick={handleFork}
                disabled={forking}
                className="btn-primary"
                style={{ flexShrink: 0 }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {forking ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <GitFork size={16} />}
                  {forking ? "Adding…" : "Start Studying"}
                </span>
              </button>
            </div>

            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75, fontSize: "1rem" }}>
              {roadmap.shortDescription}
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {infoBlocks.map((block) => (
            <div
              key={block.label}
              className="glass"
              style={{ borderRadius: "0.875rem", padding: "1.25rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                {block.icon}
                {block.label}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{block.value}</div>
            </div>
          ))}
        </div>

        {/* Full description */}
        <div className="glass" style={{ borderRadius: "1.25rem", padding: "2rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={20} color="#10b981" /> What You will Learn
          </h2>
          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.85,
              fontSize: "0.95rem",
              whiteSpace: "pre-line",
            }}
          >
            {roadmap.description}
          </div>
        </div>

        {/* CTA */}
        <div className="glass" style={{ borderRadius: "1.25rem", padding: "2rem", textAlign: "center", background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.5rem" }}>
            Ready to start this roadmap?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Add it to your dashboard and start tracking your study journey.
          </p>
          <button
            onClick={handleFork}
            disabled={forking}
            className="btn-primary"
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <GitFork size={16} />
              {forking ? "Adding to Dashboard…" : "Add to My Dashboard"}
            </span>
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
