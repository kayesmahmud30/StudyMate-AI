"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Search, Filter, Clock, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import type { Roadmap } from "@/lib/types";
import { getAuthToken } from "@/lib/getAuthToken";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

const SUBJECTS = [
  "All", "Web Development", "Machine Learning", "Data Science", "Cloud Computing",
  "Cybersecurity", "Mobile Development", "DevOps", "UI/UX Design", "Algorithms",
  "Databases", "Systems Programming",
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "hours-asc", label: "Hours: Low → High" },
  { value: "hours-desc", label: "Hours: High → Low" },
];

function DifficultyBadge({ level }: { level: string }) {
  const cls =
    level === "Beginner"
      ? "badge-beginner"
      : level === "Advanced"
      ? "badge-advanced"
      : "badge-intermediate";
  return <span className={cls}>{level}</span>;
}

function RoadmapCard({ roadmap, onFork }: { roadmap: Roadmap; onFork: (id: string) => void }) {
  return (
    <div
      className="card glass-hover"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <span
          style={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.06)",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {roadmap.subject}
        </span>
        <DifficultyBadge level={roadmap.difficulty} />
      </div>

      <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem", lineHeight: 1.3 }}>
        {roadmap.title}
      </h3>
      <p
        style={{
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.65,
          flex: 1,
          marginBottom: "1.25rem",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {roadmap.shortDescription}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
          <Clock size={13} />
          {roadmap.estimatedHours}h estimated
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
          <BookOpen size={13} />
          {new Date(roadmap.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.6rem" }}>
        <Link href={`/explore/${roadmap._id}`} style={{ flex: 1 }}>
          <button
            id={`btn-view-${roadmap._id}`}
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "0.6rem",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.2s",
            }}
          >
            View Details <ArrowRight size={14} />
          </button>
        </Link>
        <button
          id={`btn-fork-${roadmap._id}`}
          onClick={() => onFork(roadmap._id)}
          style={{
            padding: "0.6rem 0.9rem",
            borderRadius: "0.6rem",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            border: "none",
            color: "white",
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Add to Mine
        </button>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("newest");

  const { data: session } = authClient.useSession();

  const fetchRoadmaps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (subject !== "All") params.set("subject", subject);
      if (difficulty !== "All") params.set("difficulty", difficulty);
      params.set("sort", sort);

      const res = await fetch(`${SERVER_URL}/api/roadmaps?${params}`);
      const data = await res.json();
      if (data.success) setRoadmaps(data.data);
    } catch {
      toast.error("Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  }, [search, subject, difficulty, sort]);

  useEffect(() => {
    const debounce = setTimeout(fetchRoadmaps, 300);
    return () => clearTimeout(debounce);
  }, [fetchRoadmaps]);

  const handleFork = async (roadmapId: string) => {
    if (!session) {
      toast.info("Please sign in to add roadmaps to your dashboard");
      return;
    }
    try {
      const token = await getAuthToken();
      const res = await fetch(`${SERVER_URL}/api/roadmaps/${roadmapId}/fork`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Roadmap added to your dashboard! 🎉");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to add roadmap");
    }
  };

  const selectStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.6rem",
    color: "white",
    padding: "0.6rem 0.9rem",
    fontSize: "0.85rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="section-title">Explore Study Roadmaps</h1>
          <p className="section-subtitle">
            Discover community-curated learning paths across dozens of subjects.
          </p>
        </div>

        {/* Filters */}
        <div
          className="glass"
          style={{
            borderRadius: "1rem",
            padding: "1.25rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div style={{ flex: "1 1 240px", position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
            <input
              id="input-search"
              type="text"
              placeholder="Search roadmaps…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem 0.6rem 2.5rem",
                borderRadius: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <Filter size={15} style={{ color: "rgba(255,255,255,0.3)" }} />

            <select id="select-subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={selectStyle as any}>
              {SUBJECTS.map((s) => <option key={s} value={s} style={{ background: "#0f0f2e" }}>{s}</option>)}
            </select>

            <select id="select-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={selectStyle as any}>
              {DIFFICULTIES.map((d) => <option key={d} value={d} style={{ background: "#0f0f2e" }}>{d}</option>)}
            </select>

            <select id="select-sort" value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle as any}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#0f0f2e" }}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          {loading ? "Loading…" : `${roadmaps.length} roadmap${roadmaps.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem", color: "#7c3aed" }}>
            <Loader2 size={40} style={{ animation: "spin 1s linear infinite" }} />
          </div>
        ) : roadmaps.length === 0 ? (
          <div
            className="glass"
            style={{ borderRadius: "1rem", padding: "4rem", textAlign: "center" }}
          >
            <BookOpen size={48} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 1rem" }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
              No roadmaps found matching your filters.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {roadmaps.map((r) => (
              <RoadmapCard key={r._id} roadmap={r} onFork={handleFork} />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
