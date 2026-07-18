"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Stats from "../components/Dashboard/Stats";
import {
  Plus,
  Settings,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  Send,
  X,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import type { Roadmap, Schedule, ChatMessage } from "@/lib/types";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

import { getAuthToken } from "@/lib/getAuthToken";

async function authedFetch(url: string, session: any, options: RequestInit = {}) {
  const token = await getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

// ─── Roadmap Card ────────────────────────────────────────────────────────────
function RoadmapCard({
  roadmap,
}: {
  roadmap: Roadmap;
}) {
  return (
    <div className="glass" style={{ borderRadius: "1rem", padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
        {roadmap.imageUrl && (
          <img
            src={roadmap.imageUrl}
            alt={roadmap.title}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              borderRadius: "0.75rem",
              border: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem" }}>{roadmap.title}</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Clock size={12} /> {roadmap.estimatedHours}h
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Calendar size={12} /> {new Date(roadmap.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href={`/explore`}>
            <button
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <BookOpen size={13} /> View Roadmaps
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) router.push("/auth/signin");
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [rmRes, statsRes] = await Promise.all([
          authedFetch(`${SERVER_URL}/api/roadmaps/user/mine`, session),
          authedFetch(`${SERVER_URL}/api/roadmaps/user/stats`, session),
        ]);
        const rmData = await rmRes.json();
        const statsData = await statsRes.json();

        if (rmData.success) {
          setRoadmaps(rmData.data);
        }
        if (statsData.success) setStats(statsData.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  if (isPending || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
        <Loader2 size={48} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
              Welcome back,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {session?.user?.name?.split(" ")[0] ?? "Learner"}
              </span>{" "}
              👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>
              Track your learning progress and manage your study roadmaps.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/dashboard/manage-roadmaps">
              <button
                className="btn-outline"
                style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Settings size={16} /> Manage
              </button>
            </Link>
            <Link href="/dashboard/add-roadmap">
              <button
                className="btn-primary"
                style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Plus size={16} /> Add Roadmap
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ marginBottom: "2.5rem" }}>
            <Stats data={stats} />
          </div>
        )}

        {/* Active Schedules */}
        <div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={20} color="#7c3aed" /> My Study Roadmaps
            <span
              style={{
                background: "rgba(124,58,237,0.2)",
                border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa",
                padding: "0.1rem 0.6rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {roadmaps.length}
            </span>
          </h2>

          {roadmaps.length === 0 ? (
            <div
              className="glass"
              style={{ borderRadius: "1rem", padding: "3rem", textAlign: "center" }}
            >
              <BookOpen size={48} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 1rem" }} />
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>No roadmaps yet</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Create your first roadmap or explore the community library.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <Link href="/dashboard/add-roadmap">
                  <button className="btn-primary">
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Plus size={16} /> Create Roadmap</span>
                  </button>
                </Link>
                <Link href="/explore">
                  <button className="btn-outline">Explore Library</button>
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {roadmaps.map((rm) => (
                <RoadmapCard
                  key={rm._id}
                  roadmap={rm}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
