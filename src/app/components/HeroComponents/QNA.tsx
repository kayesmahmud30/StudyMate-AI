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
    <section className="qna-section">
      <style>{`
        .qna-section {
          padding: 4rem 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .qna-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          borderRadius: 50%;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          color: #a78bfa;
          margin-bottom: 0.85rem;
        }
        .qna-title {
          font-size: clamp(1.5rem, 5vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: white;
          line-height: 1.25;
          margin: 0;
        }
        .qna-btn {
          width: 100%;
          padding: 1.25rem 1.5rem;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          outline: none;
          gap: 1rem;
        }
        .qna-answer {
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
          color: rgba(255, 255, 255, 0.65);
          font-size: 0.875rem;
          line-height: 1.6;
        }
        @media (max-width: 600px) {
          .qna-section {
            padding: 3rem 1rem !important;
          }
          .qna-btn {
            padding: 1rem 1.1rem !important;
            font-size: 0.9rem !important;
          }
          .qna-answer {
            font-size: 0.825rem !important;
          }
        }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div className="qna-icon-wrap">
          <HelpCircle size={20} />
        </div>
        <h2 className="qna-title">
          Frequently Asked Questions
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
                className="qna-btn"
                style={{
                  background: isOpen ? "rgba(124, 58, 237, 0.05)" : "transparent",
                }}
              >
                <span>{item.question}</span>
                <span style={{ color: isOpen ? "#a78bfa" : "rgba(255,255,255,0.45)", display: "flex", alignItems: "center" }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {/* Answer Content */}
              <div
                className="qna-answer"
                style={{
                  maxHeight: isOpen ? "250px" : "0",
                  padding: isOpen ? "0 1.5rem 1.25rem" : "0 1.5rem",
                  color: "rgba(255, 255, 255, 0.65)",
                }}
              >
                <div style={{ paddingTop: isOpen ? "0.25rem" : "0" }}>
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QNA;