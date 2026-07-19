"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";

type Message = { role: "user" | "ai"; content: string };

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

const SUGGESTIONS = [
  "How do I structure a Python roadmap?",
  "What is the best way to master SQL?",
  "Can you help me set study milestones?",
];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I'm your StudyMate AI assistant. Ask me anything about your learning roadmap, topics you want to master, or study schedules!",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Motion values for tracking drag position relative to bottom-right corner
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Monitor viewport size to set precise boundaries for dragging
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 0);
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput || isTyping) return;

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "The AI service returned an error.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: result.data?.reply || "Sorry, I couldn't generate a response." },
      ]);
    } catch (error: unknown) {
      console.error("AI Chat Assistant Error:", error);
      const isError = error instanceof Error;
      const errorName = isError ? error.name : "";
      const errorMessage = isError ? error.message : "";
      const isNetworkError = errorName === "TypeError";
      const errorMsg = isNetworkError
        ? "⚠️ Unable to reach the backend server. Please make sure it is running."
        : `⚠️ ${errorMessage || "An unknown error occurred."}`;

      setMessages((prev) => [...prev, { role: "ai", content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Drag snapping calculations
  const maxXTravel = windowSize.width - 58 - 48; // width of screen minus button width and side padding
  const maxYTravel = windowSize.height - 58 - 48; // height of screen minus button height and padding

  const handleDragEnd = () => {
    const currentX = x.get();
    const currentY = y.get();

    // Magnet snap horizontally to closest side (left or right)
    const targetX = currentX < -maxXTravel / 2 ? -maxXTravel : 0;
    // Clamp Y position within top/bottom boundaries
    const targetY = Math.max(-maxYTravel, Math.min(0, currentY));

    animate(x, targetX, { type: "spring", stiffness: 240, damping: 20 });
    animate(y, targetY, { type: "spring", stiffness: 240, damping: 20 });
  };

  const isMobile = windowSize.width < 768;

  return (
    <>
      {/* Injected CSS styles inside component */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.5), 0 10px 25px rgba(124, 58, 237, 0.4); }
          70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(124, 58, 237, 0), 0 10px 25px rgba(124, 58, 237, 0.4); }
          100% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(124, 58, 237, 0), 0 10px 25px rgba(124, 58, 237, 0.4); }
        }
        .pulse-button {
          animation: pulse-ring 3s infinite;
        }
        .chat-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 99px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.4);
        }
        .chat-window-wrapper {
          position: fixed;
          bottom: 96px;
          right: 24px;
          z-index: 9998;
          pointer-events: none;
        }
        .chat-trigger-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 58px;
          height: 58px;
        }
        @media (max-width: 640px) {
          .chat-window-wrapper {
            bottom: 84px !important;
            right: 16px !important;
            left: 16px !important;
            width: calc(100vw - 32px) !important;
          }
          .chat-window-responsive {
            width: 100% !important;
            height: 65vh !important;
            max-height: 520px !important;
          }
          .chat-trigger-wrapper {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>

      {/* Layer 1: Chat Modal (Fixed in bottom-right corner) */}
      <div className="chat-window-wrapper">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="chat-window-responsive"
              style={{
                width: "380px",
                height: "580px",
                background: "rgba(10, 10, 24, 0.93)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(124, 58, 237, 0.25)",
                borderRadius: "1.5rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                pointerEvents: "auto",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "1.1rem 1.4rem",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(6, 182, 212, 0.9))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "white" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
                    }}
                  >
                    <Bot size={20} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <h3 style={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.2 }}>
                        StudyMate Assistant
                      </h3>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#10b981",
                          boxShadow: "0 0 8px #10b981",
                        }}
                        title="Online"
                      />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.75)" }}>
                      AI Companion
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: "white",
                    opacity: 0.8,
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    padding: "6px",
                    borderRadius: "50%",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.transform = "rotate(90deg)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "rotate(0deg)";
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Message Area */}
              <div
                ref={scrollRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
                className="chat-scrollbar"
              >
                {messages.map((msg, index) => {
                  const isAI = msg.role === "ai";
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        flexDirection: isAI ? "row" : "row-reverse",
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: isAI
                            ? "linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(6, 182, 212, 0.25))"
                            : "rgba(255, 255, 255, 0.08)",
                          border: isAI
                            ? "1px solid rgba(124, 58, 237, 0.45)"
                            : "1px solid rgba(255, 255, 255, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isAI ? "#a78bfa" : "white",
                          flexShrink: 0,
                          boxShadow: isAI ? "0 2px 8px rgba(124, 58, 237, 0.15)" : "none",
                        }}
                      >
                        {isAI ? <Bot size={15} /> : <User size={15} />}
                      </div>
                      <div
                        style={{
                          maxWidth: "75%",
                          padding: "0.85rem 1.1rem",
                          borderRadius: "1.1rem",
                          borderTopLeftRadius: isAI ? "0" : "1.1rem",
                          borderTopRightRadius: isAI ? "1.1rem" : "0",
                          background: isAI
                            ? "rgba(255, 255, 255, 0.04)"
                            : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                          border: isAI
                            ? "1px solid rgba(255, 255, 255, 0.06)"
                            : "1px solid rgba(124, 58, 237, 0.4)",
                          color: isAI ? "rgba(255, 255, 255, 0.95)" : "white",
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                          whiteSpace: "pre-line",
                          boxShadow: isAI
                            ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                            : "0 4px 12px rgba(124, 58, 237, 0.2)",
                        }}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Suggestions display */}
                {messages.length === 1 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                      paddingLeft: "2.25rem",
                    }}
                  >
                    <p style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Sparkles size={12} color="#a78bfa" /> Suggested questions:
                    </p>
                    {SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        style={{
                          background: "rgba(124, 58, 237, 0.1)",
                          border: "1px solid rgba(124, 58, 237, 0.25)",
                          color: "#c084fc",
                          borderRadius: "0.75rem",
                          padding: "0.5rem 0.85rem",
                          fontSize: "0.8rem",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          outline: "none",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "rgba(124, 58, 237, 0.2)";
                          e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "rgba(124, 58, 237, 0.1)";
                          e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.25)";
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isTyping && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#a78bfa",
                      }}
                    >
                      <Bot size={15} />
                    </div>
                    <div
                      style={{
                        padding: "0.75rem 1.1rem",
                        borderRadius: "1.1rem",
                        borderTopLeftRadius: "0",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Loader2 size={14} className="animate-spin" style={{ color: "#a78bfa" }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.5)" }}>
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                style={{
                  padding: "1.1rem",
                  background: "rgba(255, 255, 255, 0.01)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  gap: "0.6rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Ask StudyMate..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  style={{
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "0.85rem",
                    padding: "0.65rem 1rem",
                    color: "white",
                    fontSize: "0.875rem",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(124, 58, 237, 0.6)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(124, 58, 237, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "0.85rem",
                    background: inputValue.trim() && !isTyping
                      ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                      : "rgba(255, 255, 255, 0.04)",
                    border: "none",
                    color: inputValue.trim() && !isTyping ? "white" : "rgba(255, 255, 255, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: inputValue.trim() && !isTyping ? "pointer" : "default",
                    transition: "all 0.25s ease",
                    boxShadow: inputValue.trim() && !isTyping
                      ? "0 4px 12px rgba(124, 58, 237, 0.35)"
                      : "none",
                  }}
                  onMouseOver={(e) => {
                    if (inputValue.trim() && !isTyping) {
                      e.currentTarget.style.transform = "scale(1.06) translateY(-1px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1) translateY(0)";
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layer 2: Draggable Toggle Button (Fixed in bottom-right by default, can be dragged anywhere and snaps) */}
      <div className="chat-trigger-wrapper">
        <motion.div
          drag={!isMobile}
          dragConstraints={{
            left: -maxXTravel,
            right: 0,
            top: -maxYTravel,
            bottom: 0,
          }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{
            x,
            y,
            position: "absolute",
            width: "58px",
            height: "58px",
            cursor: !isMobile ? "grab" : "pointer",
          }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {/* Tooltip on Hover */}
          <AnimatePresence>
            {showTooltip && !isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -10, y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: 0, y: "-50%" }}
                exit={{ opacity: 0, scale: 0.9, x: -10, y: "-50%" }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  right: "72px",
                  top: "50%",
                  background: "rgba(10, 10, 24, 0.95)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  borderRadius: "0.6rem",
                  padding: "0.5rem 0.85rem",
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                  pointerEvents: "none",
                }}
              >
                Chat with StudyMate AI
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              setIsOpen(!isOpen);
              setShowTooltip(false);
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={!isOpen ? "pulse-button" : ""}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              outline: "none",
              transition: "box-shadow 0.3s",
            }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={26} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageSquare size={26} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
