"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Render only on the home page to keep dashboard/other pages clean
  if (pathname !== "/") {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    // Simulate API subscription delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubscribed(true);
    toast.success("Welcome aboard! Check your inbox soon. 📬");
    setEmail("");
  };

  return (
    <section style={{ padding: "3rem 1.5rem 5rem", maxWidth: "800px", margin: "0 auto" }}>
      <div
        className="glass"
        style={{
          borderRadius: "1.25rem",
          padding: "2.5rem 2rem",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background glow */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              color: "#a78bfa",
            }}
          >
            <Mail size={22} />
          </div>

          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            {subscribed ? "You're on the list!" : "Level Up Your Learning"}
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 auto 1.75rem", maxWidth: "420px" }}>
            {subscribed
              ? "Thanks for joining. We'll send you curated study guides, roadmap building tips, and product updates."
              : "Get monthly study roadmap inspiration, resources, and updates delivered straight to your inbox."}
          </p>

          {!subscribed && (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "0.65rem 1rem",
                  borderRadius: "0.6rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "0.875rem",
                  outline: "none",
                  transition: "all 0.2s",
                  width: "100%",
                  boxSizing: "border-box" as const,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.6)";
                  e.currentTarget.style.boxShadow = "0 0 10px rgba(124, 58, 237, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary newsletter-btn"
                style={{
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  borderRadius: "0.6rem",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {loading ? (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .newsletter-form {
            display: flex;
            gap: 0.5rem;
            max-width: 480px;
            margin: 0 auto;
            flex-wrap: wrap;
          }
          @media (max-width: 500px) {
            .newsletter-form { flex-direction: column; }
            .newsletter-btn { width: 100% !important; }
          }
        `}</style>
      </div>
    </section>
  );
};

export default NewsLetter;