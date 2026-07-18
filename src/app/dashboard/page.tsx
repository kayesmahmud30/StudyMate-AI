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

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({
  roadmapId,
  roadmapTitle,
  session,
  onClose,
}: {
  roadmapId: string;
  roadmapTitle: string;
  session: any;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const res = await authedFetch(`${SERVER_URL}/api/ai/chat/${roadmapId}`, session);
      const data = await res.json();
      if (data.success) setMessages(data.data);
    };
    load();
  }, [roadmapId, session]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMsg: ChatMessage = { role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    const text = input;
    setInput("");
    setSending(true);
    try {
      const res = await authedFetch(`${SERVER_URL}/api/ai/chat`, session, {
        method: "POST",
        body: JSON.stringify({ roadmapId, message: text }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data.message]);
      }
    } catch {
      toast.error("Chat failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "380px",
        height: "520px",
        background: "rgba(10,10,26,0.97)",
        border: "1px solid rgba(124,58,237,0.35)",
        borderRadius: "1.25rem",
        display: "flex",
        flexDirection: "column",
        zIndex: 999,
        boxShadow: "0 20px 80px rgba(124,58,237,0.25)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={15} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>StudyMate AI</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
              {roadmapTitle.slice(0, 28)}…
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "0.25rem" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", marginTop: "2rem" }}>
            <MessageSquare size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
            <p>Ask anything about your roadmap!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: "0.65rem 0.9rem",
                borderRadius: msg.role === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                background: msg.role === "user" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,0.06)",
                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                color: msg.role === "user" ? "white" : "rgba(255,255,255,0.85)",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            StudyMate is thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask about your roadmap…"
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.6rem",
            padding: "0.55rem 0.8rem",
            color: "white",
            fontSize: "0.82rem",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            border: "none",
            borderRadius: "0.6rem",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            opacity: sending || !input.trim() ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Schedule Card ────────────────────────────────────────────────────────────
function ScheduleCard({
  roadmap,
  schedule,
  session,
  onGenerateSchedule,
  onOpenChat,
  generating,
}: {
  roadmap: Roadmap;
  schedule: Schedule | null;
  session: any;
  onGenerateSchedule: (id: string) => void;
  onOpenChat: (roadmap: Roadmap) => void;
  generating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass" style={{ borderRadius: "1rem", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ flex: 1 }}>
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
          <button
            onClick={() => onOpenChat(roadmap)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "0.5rem",
              background: "rgba(6,182,212,0.15)",
              border: "1px solid rgba(6,182,212,0.3)",
              color: "#06b6d4",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <MessageSquare size={13} /> Chat
          </button>
          {!schedule && (
            <button
              onClick={() => onGenerateSchedule(roadmap._id)}
              disabled={generating}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                border: "none",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: generating ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                opacity: generating ? 0.7 : 1,
              }}
            >
              {generating ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={13} />}
              Generate Schedule
            </button>
          )}
        </div>
      </div>

      {schedule ? (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: "100%",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "0.6rem",
              padding: "0.6rem",
              color: "#a78bfa",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer",
              marginBottom: "0.75rem",
            }}
          >
            {expanded ? "▲ Collapse" : `▼ View ${schedule.scheduleDays.length}-Day Schedule`}
          </button>
          {expanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "300px", overflowY: "auto" }}>
              {schedule.scheduleDays.map((day) => (
                <div
                  key={day.dayNumber}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "0.6rem",
                    padding: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: "rgba(124,58,237,0.2)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#a78bfa",
                        flexShrink: 0,
                      }}
                    >
                      {day.dayNumber}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{day.topic}</span>
                  </div>
                  <ul style={{ paddingLeft: "2rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    {day.tasks.map((task, ti) => (
                      <li key={ti} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: "0.6rem",
            padding: "1rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.8rem",
          }}
        >
          No schedule yet — click "Generate Schedule" to let AI create your study plan.
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [schedules, setSchedules] = useState<Record<string, Schedule>>({});
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [chatRoadmap, setChatRoadmap] = useState<Roadmap | null>(null);

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
          const rms: Roadmap[] = rmData.data;
          setRoadmaps(rms);

          // Fetch schedules for each roadmap
          const scheduleEntries = await Promise.all(
            rms.map(async (rm) => {
              const sRes = await authedFetch(`${SERVER_URL}/api/roadmaps/${rm._id}/schedule`, session);
              const sData = await sRes.json();
              return [rm._id, sData.data] as const;
            })
          );
          setSchedules(Object.fromEntries(scheduleEntries.filter(([, v]) => v)));
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

  const handleGenerateSchedule = async (roadmapId: string) => {
    setGeneratingId(roadmapId);
    try {
      const res = await authedFetch(`${SERVER_URL}/api/ai/schedule`, session, {
        method: "POST",
        body: JSON.stringify({ roadmapId }),
      });
      const data = await res.json();
      if (data.success) {
        setSchedules((prev) => ({ ...prev, [roadmapId]: data.data }));
        toast.success("AI schedule generated! 🎉");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to generate schedule");
    } finally {
      setGeneratingId(null);
    }
  };

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
                <ScheduleCard
                  key={rm._id}
                  roadmap={rm}
                  schedule={schedules[rm._id] ?? null}
                  session={session}
                  onGenerateSchedule={handleGenerateSchedule}
                  onOpenChat={setChatRoadmap}
                  generating={generatingId === rm._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      {chatRoadmap && (
        <ChatPanel
          roadmapId={chatRoadmap._id}
          roadmapTitle={chatRoadmap.title}
          session={session}
          onClose={() => setChatRoadmap(null)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
