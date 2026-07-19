"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Compass, Cpu, Target, CheckCircle, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  } as const;

  const features = [
    {
      icon: <Sparkles size={24} color="#a78bfa" />,
      title: "AI Roadmap Builder",
      description: "Generates custom learning roadmaps tailored to your goal, experience level, and timeline instantly.",
    },
    {
      icon: <Target size={24} color="#06b6d4" />,
      title: "Actionable Milestones",
      description: "Divides massive topics into bite-sized milestones so you can stay motivated and trace your progress.",
    },
    {
      icon: <Cpu size={24} color="#10b981" />,
      title: "Gemini Power Engine",
      description: "Backed by Google's Gemini models to ensure your roadmap resources and outlines are accurate and modern.",
    },
  ];

  return (
    <div className="about-container">
      <style>{`
        .about-container {
          min-height: 100vh;
          padding: 7.5rem 1.5rem 5rem;
          background: var(--gradient-hero);
          position: relative;
          overflow: hidden;
        }
        .about-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }
        .about-glass-card {
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(124, 58, 237, 0.02));
          margin-bottom: 5rem;
        }
        .about-works-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2.5rem;
        }
        .about-cta-container {
          text-align: center;
          padding: 3.5rem 2rem;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1));
          border: 1px solid rgba(124, 58, 237, 0.25);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .about-btn-wrap {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .about-btn-nowrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
          width: 100%;
        }
        @media (max-width: 600px) {
          .about-container {
            padding: 6rem 1rem 4rem !important;
          }
          .about-card-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
            margin-bottom: 3.5rem !important;
          }
          .about-glass-card {
            padding: 2rem 1.1rem !important;
            margin-bottom: 3.5rem !important;
          }
          .about-works-grid {
            grid-template-columns: 1fr !important;
            gap: 1.75rem !important;
          }
          .about-cta-container {
            padding: 2.5rem 1.1rem !important;
          }
          .about-btn-wrap {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }
          .about-btn-wrap a, .about-btn-wrap button {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Decorative Orbs */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0) 70%)",
          top: "10%",
          right: "-100px",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0) 70%)",
          bottom: "10%",
          left: "-100px",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4.5rem" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              color: "#a78bfa",
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1.5rem",
            }}
          >
            <Sparkles size={12} /> Meet StudyMate AI
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
              color: "white",
            }}
          >
            Empowering Learners with{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Intelligent Guidance
            </span>
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
              lineHeight: 1.7,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            StudyMate AI is a smart companion built to convert your learning goals into structured, actionable study roadmaps with milestone tracking and an integrated AI assistant.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="about-card-grid"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass"
              style={{
                borderRadius: "1.25rem",
                padding: "2.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                transition: "border-color 0.3s, transform 0.3s",
                cursor: "default",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.4)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {feature.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "white" }}>
                  {feature.title}
                </h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass about-glass-card"
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>
              How StudyMate Works
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
              Take control of your growth in three easy steps
            </p>
          </div>

          <div className="about-works-grid">
            {[
              { step: "01", title: "Input Your Goal", text: "Tell the AI what you want to learn, your background level, and timeframe." },
              { step: "02", title: "Generate Roadmap", text: "Receive a tailored roadmap complete with key modules, topics, and external resources." },
              { step: "03", title: "Track Progress", text: "Mark milestones as complete, use the companion chat to get answers, and master your path." },
            ].map((step, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1rem" }}>
                <span
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "rgba(124, 58, 237, 0.25)",
                    lineHeight: 1,
                  }}
                >
                  {step.step}
                </span>
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "white", marginBottom: "0.4rem" }}>
                    {step.title}
                  </h4>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="about-cta-container"
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
            Ready to accelerate your learning?
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
              marginBottom: "2rem",
              maxWidth: "500px",
              margin: "0 auto 2rem",
            }}
          >
            Create your account today and generate your first roadmap using the power of AI.
          </p>
          <div className="about-btn-wrap">
            <Link href="/auth/signup" style={{ display: "block" }}>
              <button className="btn-primary about-btn-nowrap">
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/explore" style={{ display: "block" }}>
              <button className="btn-outline about-btn-nowrap">Explore Roadmaps</button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
