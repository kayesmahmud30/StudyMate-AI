"use client";

import React from "react";
import { Star } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  avatarColor: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Alex Rivera",
    role: "Computer Science @ UC Berkeley",
    quote: "StudyMate's AI schedule planner completely changed how I prep for midterms. Breaking down complex algorithms day-by-day made a massive difference in my scores!",
    rating: 5,
    initials: "AR",
    avatarColor: "linear-gradient(135deg, #7c3aed, #4f46e5)",
  },
  {
    name: "Sarah Chen",
    role: "Pre-Med Student @ Columbia",
    quote: "The visual progress tracker keeps me motivated. Seeing my study hours mapped out helps me maintain a healthy study-life balance and avoid burnout.",
    rating: 5,
    initials: "SC",
    avatarColor: "linear-gradient(135deg, #06b6d4, #0891b2)",
  },
  {
    name: "Marcus Vance",
    role: "Self-Taught Fullstack Developer",
    quote: "I used custom roadmaps to transition from sales to engineering. The ability to structure my resources, notes, and goals in one place was absolute gold.",
    rating: 5,
    initials: "MV",
    avatarColor: "linear-gradient(135deg, #10b981, #059669)",
  },
];

const Testimonials = () => {
  return (
    <section style={{ padding: "6rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
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
            marginBottom: "1rem",
          }}
        >
          Success Stories
        </span>
        <h2 className="section-title">Loved by Curious Minds</h2>
        <p className="section-subtitle">
          See how students, developers, and lifelong learners are optimizing their study workflows.
        </p>
      </div>

      <div
        className="testimonials-grid"
        style={{
          gap: "2rem",
        }}
      >
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="glass glass-hover"
            style={{
              borderRadius: "1.25rem",
              padding: "2.25rem 2rem",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Quote SVG watermark */}
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1.5rem",
                color: "rgba(255, 255, 255, 0.03)",
                fontSize: "7.5rem",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              &ldquo;
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Star Rating */}
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={15} fill="#fbbf24" stroke="#fbbf24" />
                ))}
              </div>

              {/* Quote Content */}
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  marginBottom: "2rem",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Author Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", position: "relative", zIndex: 1 }}>
              {/* Avatar circle */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: t.avatarColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "white",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                  flexShrink: 0,
                }}
              >
                {t.initials}
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "white" }}>{t.name}</h4>
                <p style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.45)", fontWeight: 500 }}>
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        @media (min-width: 1200px) {
          .testimonials-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;