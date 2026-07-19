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
      style={{ display: "flex", flexDirection: "column", height: "100%", padding: 0, overflow: "hidden" }}
    >
      {roadmap.imageUrl && (
        <img
          src={roadmap.imageUrl}
          alt={roadmap.title}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      )}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "nowrap" }}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.06)",
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
              flexShrink: 1,
            }}
          >
            {roadmap.subject}
          </span>
          <div style={{ flexShrink: 0 }}>
            <DifficultyBadge level={roadmap.difficulty} />
          </div>
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
          <Link href={`/explore/${roadmap._id}`} style={{ flex: 1, minWidth: 0 }}>
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
                whiteSpace: "nowrap",
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
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Add to Mine
          </button>
        </div>
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data: session } = authClient.useSession();

  const fetchRoadmaps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (subject !== "All") params.set("subject", subject);
      if (difficulty !== "All") params.set("difficulty", difficulty);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "8");

      const res = await fetch(`${SERVER_URL}/api/roadmaps?${params}`);
      const data = await res.json();
      if (data.success) {
        setRoadmaps(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
          setTotalItems(data.pagination.total || 0);
        }
      }
    } catch {
      toast.error("Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  }, [search, subject, difficulty, sort, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
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
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add roadmap";
      toast.error(errorMsg);
    }
  };

  const selectStyle: React.CSSProperties = {
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
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .explore-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .explore-filter-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .explore-filter-icon {
          display: flex;
          align-items: center;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        .explore-selects-grid {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          flex: 1;
        }
        .explore-selects-grid select {
          flex: 1 1 140px;
          min-width: 0;
        }
        @media (max-width: 480px) {
          .explore-filter-icon { display: none; }
          .explore-selects-grid { gap: 0.5rem; }
          .explore-selects-grid select { flex: 1 1 calc(50% - 0.25rem); min-width: 0; font-size: 0.8rem; }
        }
      `}</style>
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
          className="glass explore-filter-bar"
          style={{
            borderRadius: "1rem",
            padding: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          {/* Search row */}
          <div style={{ position: "relative", width: "100%" }}>
            <Search size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
            <input
              id="input-search"
              type="text"
              placeholder="Search roadmaps…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.9rem 0.65rem 2.5rem",
                borderRadius: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                fontSize: "0.85rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Selects row */}
          <div className="explore-filter-row">
            <div className="explore-filter-icon">
              <Filter size={15} />
            </div>
            <div className="explore-selects-grid">
              <select id="select-subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={selectStyle}>
                {SUBJECTS.map((s) => <option key={s} value={s} style={{ background: "#0f0f2e" }}>{s}</option>)}
              </select>
              <select id="select-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={selectStyle}>
                {DIFFICULTIES.map((d) => <option key={d} value={d} style={{ background: "#0f0f2e" }}>{d}</option>)}
              </select>
              <select id="select-sort" value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background: "#0f0f2e" }}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          {loading ? "Loading…" : `Showing ${roadmaps.length} of ${totalItems} roadmap${totalItems !== 1 ? "s" : ""} found`}
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
            className="explore-grid"
            style={{
              gap: "1.5rem",
            }}
          >
            {roadmaps.map((r) => (
              <RoadmapCard key={r._id} roadmap={r} onFork={handleFork} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "3.5rem",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                opacity: page === 1 ? 0.4 : 1,
                cursor: page === 1 ? "not-allowed" : "pointer",
                borderRadius: "0.5rem",
              }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "0.5rem",
                    border: isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                    background: isActive
                      ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                      : "rgba(255,255,255,0.05)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: isActive ? "0 4px 15px rgba(124,58,237,0.3)" : "none",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-outline"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                opacity: page === totalPages ? 0.4 : 1,
                cursor: page === totalPages ? "not-allowed" : "pointer",
                borderRadius: "0.5rem",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style>{`
        .explore-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
        @media (min-width: 1200px) {
          .explore-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
