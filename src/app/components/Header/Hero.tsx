"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Brain, Target, Zap } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const FEATURES = [
  {
    icon: <Brain size={28} />,
    title: "Structured Roadmaps",
    desc: "Build a detailed learning path tailored to your goals, timeline, and skill level.",
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.3)",
  },
  {
    icon: <Target size={28} />,
    title: "Smart Schedule Planning",
    desc: "Break any topic into daily study milestones and manage your time effectively.",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    icon: <Zap size={28} />,
    title: "Study Resources & Notes",
    desc: "Access curated resources and organize study materials directly within your roadmaps.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Progress Analytics",
    desc: "Track your learning milestones with beautiful charts showing study hours and topics mastered.",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.3)",
  },
];

const STEPS = [
  { num: "01", title: "Create a Roadmap", desc: "Define your subject, difficulty, and deadline." },
  { num: "02", title: "Plan your Schedule", desc: "Structure your study plan day-by-day to stay on track." },
  { num: "03", title: "Start Studying", desc: "Follow structured tasks and check off completed units." },
  { num: "04", title: "Track Progress", desc: "View your stats and master new skills step-by-step." },
];

const STATS = [
  { value: "10K+", label: "Study Roadmaps" },
  { value: "100K+", label: "Tasks Completed" },
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
  const { data: session } = authClient.useSession();
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
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setTypingIndex((i) => (i + 1) % TYPING_STRINGS.length);
        }, 150);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  return (
    <div>
      <style>{`
        .hero-btn-wrap {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-btn-nowrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
        }
        .hero-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .hero-works-flex {
          display: flex;
          gap: 0;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
        }
        .hero-stats-banner {
          background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08));
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 2rem;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          margin-bottom: 2rem;
          font-size: 0.85rem;
          color: #a78bfa;
          font-weight: 600;
          white-space: nowrap;
        }
        .hero-title {
          font-size: clamp(2.25rem, 6.5vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: white;
        }
        .hero-desc {
          font-size: clamp(1rem, 3vw, 1.2rem);
          color: rgba(255,255,255,0.65);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.75;
        }
        @media (max-width: 600px) {
          .hero-btn-wrap {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }
          .hero-btn-wrap a, .hero-btn-wrap button {
            width: 100% !important;
          }
          .hero-btn-nowrap {
            width: 100% !important;
          }
          .hero-features-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .hero-works-flex {
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-works-flex > div {
            max-width: 100% !important;
            width: 100% !important;
            padding: 1.5rem 1rem !important;
          }
          .hero-stats-banner {
            padding: 2rem 1.25rem !important;
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          section {
            padding: 3.5rem 1rem !important;
          }
          #hero-top-section {
            padding: 5rem 1rem 3rem !important;
          }
          .hero-badge {
            font-size: 0.75rem !important;
            padding: 0.35rem 0.85rem !important;
            margin-bottom: 1.25rem !important;
            white-space: nowrap !important;
          }
          .hero-title {
            font-size: 1.85rem !important;
            line-height: 1.25 !important;
            margin-bottom: 1rem !important;
          }
          .hero-desc {
            font-size: 0.925rem !important;
            margin-bottom: 1.75rem !important;
            line-height: 1.6 !important;
          }
        @media (min-width: 1200px) {
          .hero-features-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .hero-stats-banner {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>

      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section
        id="hero-top-section"
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
          <div className="hero-badge">
            <Sparkles size={14} />
            StudyMate Study Companion
          </div>

          <h1 className="hero-title">
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
            with Guided Study Plans
          </h1>

          <p className="hero-desc">
            StudyMate helps you generate personalized roadmaps, build detailed daily schedules, and track your learning progress throughout your journey.
          </p>

          <div className="hero-btn-wrap">
            <Link href="/explore" style={{ display: "block" }}>
              <button className="btn-primary hero-btn-nowrap" id="cta-explore">
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                  Explore Roadmaps
                  <ArrowRight size={18} />
                </span>
              </button>
            </Link>
            <Link href={session ? "/about" : "/auth/signup"} style={{ display: "block" }}>
              <button className="btn-outline hero-btn-nowrap" id="cta-signup">
                {session ? "About Us" : "Start for Free"}
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
            A complete study tracking platform built for modern learners who want results.
          </p>
        </div>

        <div className="hero-features-grid">
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

          <div className="hero-works-flex">
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
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 className="section-title">Trusted by Thousands of Students</h2>
          <p className="section-subtitle">Real metrics driving the next generation of study planning.</p>
        </div>

        <div className="hero-stats-banner">
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

        {/* Expanded CTA Section */}
        <div style={{ marginTop: "5rem" }}>
          <div
            className="glass"
            style={{
              borderRadius: "2rem",
              padding: "4rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Soft inner glow */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
              <span
                style={{
                  background: "rgba(124, 58, 237, 0.12)",
                  color: "#a78bfa",
                  padding: "0.4rem 1rem",
                  borderRadius: "99px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  border: "1px solid rgba(124, 58, 237, 0.25)",
                  display: "inline-block",
                  marginBottom: "1.5rem",
                }}
              >
                Elevate Your Learning
              </span>

              <h2
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  marginBottom: "1rem",
                  lineHeight: 1.2,
                }}
              >
                Ready to Level Up?
              </h2>

              <p
                style={{
                  color: "rgba(255, 255, 255, 0.65)",
                  marginBottom: "2.5rem",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                Join thousands of students already studying smarter. Build structured roadmaps, set realistic deadlines, and master any subject with the power of AI guidance.
              </p>

              {/* Benefits list */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  marginBottom: "2.5rem",
                  fontSize: "0.9rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 500,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="10" fill="#10b981" fillOpacity="0.15"/>
                    <path d="M6 10L9 13L14 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>AI-Powered Scheduling</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="10" fill="#10b981" fillOpacity="0.15"/>
                    <path d="M6 10L9 13L14 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Progress Analytics</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="10" fill="#10b981" fillOpacity="0.15"/>
                    <path d="M6 10L9 13L14 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>100% Free to Use</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {!session ? (
                  <>
                    <Link href="/auth/signup">
                      <button className="btn-primary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Get Started Free
                          <ArrowRight size={18} />
                        </span>
                      </button>
                    </Link>
                    <Link href="/explore">
                      <button className="btn-outline" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                        Explore Roadmaps
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard">
                      <button className="btn-primary" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          Go to Dashboard
                          <ArrowRight size={18} />
                        </span>
                      </button>
                    </Link>
                    <Link href="/dashboard/add-roadmap">
                      <button className="btn-outline" style={{ padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}>
                        Create Roadmap
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
