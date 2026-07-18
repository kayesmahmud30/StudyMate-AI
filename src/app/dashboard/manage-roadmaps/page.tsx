"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { ArrowLeft, Trash2, Edit3, Globe, Lock, Loader2, BookOpen, Clock, Calendar } from "lucide-react";
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

function DifficultyBadge({ level }: { level: string }) {
  const cls = level === "Beginner" ? "badge-beginner" : level === "Advanced" ? "badge-advanced" : "badge-intermediate";
  return <span className={cls}>{level}</span>;
}

export default function ManageRoadmapsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) router.push("/auth/signin");
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      try {
        const res = await authedFetch(`${SERVER_URL}/api/roadmaps/user/mine`, session);
        const data = await res.json();
        if (data.success) setRoadmaps(data.data);
      } catch {
        toast.error("Failed to load roadmaps");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session]);

  const handleDelete = async (roadmapId: string) => {
    setDeletingId(roadmapId);
    setConfirmDeleteId(null);
    try {
      const res = await authedFetch(`${SERVER_URL}/api/roadmaps/${roadmapId}`, session, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRoadmaps((prev) => prev.filter((r) => r._id !== roadmapId));
        toast.success("Roadmap deleted");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublic = async (roadmap: Roadmap) => {
    setTogglingId(roadmap._id);
    try {
      const res = await authedFetch(`${SERVER_URL}/api/roadmaps/${roadmap._id}`, session, {
        method: "PUT",
        body: JSON.stringify({ isPublic: !roadmap.isPublic }),
      });
      const data = await res.json();
      if (data.success) {
        setRoadmaps((prev) => prev.map((r) => (r._id === roadmap._id ? { ...r, isPublic: !r.isPublic } : r)));
        toast.success(`Roadmap ${!roadmap.isPublic ? "published" : "set to private"}`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/dashboard">
          <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.875rem", marginBottom: "2rem" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
              Manage Roadmaps
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>
              {roadmaps.length} roadmap{roadmaps.length !== 1 ? "s" : ""} in your library
            </p>
          </div>
          <Link href="/dashboard/add-roadmap">
            <button className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>+ New Roadmap</span>
            </button>
          </Link>
        </div>

        {roadmaps.length === 0 ? (
          <div className="glass" style={{ borderRadius: "1rem", padding: "3rem", textAlign: "center" }}>
            <BookOpen size={48} style={{ color: "rgba(255,255,255,0.1)", margin: "0 auto 1rem" }} />
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No roadmaps yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {roadmaps.map((rm) => (
              <div
                key={rm._id}
                className="glass"
                style={{ borderRadius: "1rem", padding: "1.5rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                  {rm.imageUrl && (
                    <img
                      src={rm.imageUrl}
                      alt={rm.title}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(255,255,255,0.1)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{rm.title}</h3>
                      <DifficultyBadge level={rm.difficulty} />
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.72rem",
                          color: rm.isPublic ? "#34d399" : "rgba(255,255,255,0.35)",
                          background: rm.isPublic ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${rm.isPublic ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}`,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          fontWeight: 600,
                        }}
                      >
                        {rm.isPublic ? <Globe size={11} /> : <Lock size={11} />}
                        {rm.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginBottom: "0.6rem", lineHeight: 1.5 }}>
                      {rm.shortDescription}
                    </p>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <BookOpen size={11} /> {rm.subject}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Clock size={11} /> {rm.estimatedHours}h
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Calendar size={11} /> {new Date(rm.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, alignItems: "center" }}>
                    {/* Toggle public */}
                    <button
                      id={`btn-toggle-public-${rm._id}`}
                      onClick={() => handleTogglePublic(rm)}
                      disabled={togglingId === rm._id}
                      title={rm.isPublic ? "Set to private" : "Make public"}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        background: rm.isPublic ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${rm.isPublic ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}`,
                        color: rm.isPublic ? "#34d399" : "rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      {togglingId === rm._id ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : rm.isPublic ? <Globe size={16} /> : <Lock size={16} />}
                    </button>

                    {/* Delete */}
                    {confirmDeleteId === rm._id ? (
                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: "#f87171", whiteSpace: "nowrap" }}>Are you sure?</span>
                        <button
                          id={`btn-confirm-delete-${rm._id}`}
                          onClick={() => handleDelete(rm._id)}
                          disabled={deletingId === rm._id}
                          style={{
                            padding: "0.35rem 0.7rem",
                            borderRadius: "0.4rem",
                            background: "rgba(239,68,68,0.2)",
                            border: "1px solid rgba(239,68,68,0.4)",
                            color: "#f87171",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {deletingId === rm._id ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : "Delete"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          style={{
                            padding: "0.35rem 0.7rem",
                            borderRadius: "0.4rem",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-delete-${rm._id}`}
                        onClick={() => setConfirmDeleteId(rm._id)}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.15)",
                          color: "#f87171",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
