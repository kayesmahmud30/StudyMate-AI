"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        background: "var(--gradient-hero)",
      }}
    >
      {/* Dynamic Glowing Background Orbs */}
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0) 70%)",
          top: "15%",
          left: "10%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(6, 182, 212, 0) 70%)",
          bottom: "15%",
          right: "10%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Animated 404 Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          style={{
            fontSize: "clamp(6rem, 15vw, 10rem)",
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #a78bfa, #7c3aed, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 35px rgba(124, 58, 237, 0.35))",
          }}
        >
          404
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            fontWeight: 800,
            marginBottom: "1rem",
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          Learning Path Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            padding: "0 1rem",
          }}
        >
          We searched all our courses, roadmaps, and milestones, but this page seems to have drifted offline. Let's get you back to your learning dashboard!
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Link href="/dashboard">
            <button
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.6rem",
              }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </Link>

          <Link href="/explore">
            <button
              className="btn-outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.6rem",
              }}
            >
              <Compass size={18} />
              Explore Paths
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
