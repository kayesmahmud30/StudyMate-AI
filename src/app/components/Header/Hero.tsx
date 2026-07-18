"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Brain, Target, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: <Brain size={28} />,
    title: "AI-Powered Roadmaps",
    desc: "Let AI craft a personalised learning path tailored to your goals, timeline, and skill level.",
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.3)",
  },
  {
    icon: <Target size={28} />,
    title: "Smart Schedule Generation",
    desc: "Break any topic into daily micro-goals. Our AI builds a structured day-by-day plan automatically.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    icon: <Zap size={28} />,
    title: "Context-Aware Chat",
    desc: "Ask questions directly tied to your roadmap. The AI remembers your study history across sessions.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Progress Analytics",
    desc: "Track your learning milestones with beautiful charts showing hours studied and topics mastered.",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.3)",
  },
];

const STEPS = [
  { num: "01", title: "Create a Roadmap", desc: "Define your subject, difficulty, and deadline." },
  { num: "02", title: "Generate Schedule", desc: "AI crafts a day-by-day study plan for you." },
  { num: "03", title: "Start Studying", desc: "Follow structured tasks and track your progress." },
  { num: "04", title: "Ask the AI", desc: "Chat with an assistant that knows your roadmap context." },
];

const STATS = [
  { value: "10K+", label: "Study Roadmaps" },
  { value: "50K+", label: "AI Schedules Generated" },
  { value: "98%", label: "Student Satisfaction" },
  { value: "150+", label: "Subjects Covered" },
];

const TYPING_STRINGS = [
  "Machine Learning",
  "Web Development",
  "Data Structures",
  "UX Design",
  "Cloud Computing",
];

export default function Hero() {
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = TYPING_STRINGS[typingIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
        setTypingIndex((i) => (i + 1) % TYPING_STRINGS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  return (
    <div>
      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 1.5rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite reverse",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "860px", position: "relative", zIndex: 1 }}>
          {/* Pill badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1.2rem",
              borderRadius: "999px",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              marginBottom: "2rem",
              fontSize: "0.85rem",
              color: "#a78bfa",
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} />
            Powered by Gemini AI
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}
          >
            Master{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa, #7c3aed, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {displayText}
              <span
                style={{
                  WebkitTextFillColor: "#7c3aed",
                  animation: "pulseSlow 1s ease-in-out infinite",
                }}
              >
                |
              </span>
            </span>
            <br />
            with AI-Guided Study Plans
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.65)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.75,
            }}
          >
            StudyMate AI generates personalised roadmaps, builds intelligent daily schedules, and gives you an AI assistant that truly understands your learning journey.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/explore">
              <button className="btn-primary" id="cta-explore">
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Explore Roadmaps
                  <ArrowRight size={18} />
                </span>
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="btn-outline" id="cta-signup">
                Start for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <h2 className="section-title">Everything You Need to Learn Faster</h2>
          <p className="section-subtitle">
            A complete AI-powered platform built for modern learners who want results.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card glass-hover"
              style={{ textAlign: "left" }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${f.color}30, ${f.color}15)`,
                  border: `1px solid ${f.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: f.color,
                  marginBottom: "1.25rem",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.6rem" }}
              >
                {f.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontSize: "0.9rem" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "rgba(124,58,237,0.05)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Four simple steps to transform your study routine.</p>

          <div
            style={{
              display: "flex",
              gap: "0",
              justifyContent: "center",
              flexWrap: "wrap",
              position: "relative",
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                style={{
                  flex: "1 1 220px",
                  maxWidth: "260px",
                  padding: "2rem 1.5rem",
                  position: "relative",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "rgba(124,58,237,0.3)",
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    marginBottom: "1rem",
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1.05rem" }}>
                  {step.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {step.desc}
                </p>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(124,58,237,0.4)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="hidden md:block"
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Banner ────────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "1.5rem",
            padding: "3rem 2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #a78bfa, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.1,
                  marginBottom: "0.5rem",
                }}
              >
                {s.value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <h2 className="section-title">Ready to Level Up?</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "2rem", fontSize: "1.05rem" }}>
            Join thousands of students already studying smarter with StudyMate AI.
          </p>
          <Link href="/explore">
            <button className="btn-primary" id="cta-explore-bottom">
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Browse All Roadmaps
                <ArrowRight size={18} />
              </span>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
