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
  BookOpen,
  Camera,
  User,
} from "lucide-react";
import type { Roadmap } from "@/lib/types";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      const { error } = await authClient.updateUser({
        image: result.url,
      });
      if (error) throw new Error(error.message);

      toast.success("Profile picture updated! 📸");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* User Avatar with Hover Upload */}
            <div
              className="avatar-container"
              style={{
                position: "relative",
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                border: "2px solid rgba(124,58,237,0.3)",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingAvatar ? (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite", color: "#a78bfa" }} />
                </div>
              ) : (
                <div
                  className="avatar-hover-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    opacity: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <Camera size={18} style={{ color: "white" }} />
                </div>
              )}
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Avatar"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.4rem", color: "white" }}>
                  {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>

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
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/profile">
              <button
                className="btn-outline"
                style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <User size={16} /> Profile
              </button>
            </Link>
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

        {/* My Study Roadmaps */}
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .avatar-container:hover .avatar-hover-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
