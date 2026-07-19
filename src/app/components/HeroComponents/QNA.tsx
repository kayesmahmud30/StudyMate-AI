"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface QnAItem {
  question: string;
  answer: string;
}

const QNA_DATA: QnAItem[] = [
  {
    question: "What is StudyMate AI?",
    answer: "StudyMate is an AI-powered study companion designed to help you create personalized learning roadmaps, organize study milestones, and track your educational progress in real-time.",
  },
  {
    question: "How does the AI Roadmap generator work?",
    answer: "Simply input a topic, choose your target difficulty level, and set your goals. Our AI calculates your learning path and breaks down complex subjects into bite-sized, actionable milestones.",
  },
  {
    question: "Can I customize the generated roadmaps?",
    answer: "Yes, you have full control. You can add new roadmaps manually, edit details, upload custom cover images, and track individual progress as you complete each study step.",
  },
  {
    question: "Can I share my roadmaps with friends?",
    answer: "Absolutely! When creating or editing a roadmap, you can set its visibility to 'Public' to share it with the community on the Explore page, or keep it private just for yourself.",
  },
];

const QNA = () => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Only render the Q&A section on the homepage for clean layout
  if (pathname !== "/") {
    return null;
  }

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section style={{ padding: "4rem 1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <HelpCircle size={24} color="#7c3aed" /> Frequently Asked Questions
        </h2>
        <p style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Quick answers to help you get the most out of StudyMate.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {QNA_DATA.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className="glass"
              style={{
                borderRadius: "0.85rem",
                border: `1px solid ${isOpen ? "rgba(124, 58, 237, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(index)}
                style={{
                  width: "100%",
                  padding: "1.1rem 1.4rem",
                  background: isOpen ? "rgba(124, 58, 237, 0.05)" : "transparent",
                  border: "none",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  outline: "none",
                  gap: "1rem",
                }}
              >
                <span>{item.question}</span>
                <span style={{ color: isOpen ? "#a78bfa" : "rgba(255,255,255,0.45)" }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {/* Answer Content */}
              <div
                style={{
                  maxHeight: isOpen ? "200px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease",
                  padding: isOpen ? "0 1.4rem 1.25rem" : "0 1.4rem",
                  color: "rgba(255, 255, 255, 0.65)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QNA;