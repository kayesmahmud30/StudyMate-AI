"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "ai"; content: string };

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I'm your StudyMate AI assistant. Ask me anything about your learning roadmap, topics you want to master, or study schedules!",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
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
    } catch (error: any) {
      console.error("AI Chat Assistant Error:", error);
      const isNetworkError = error?.name === "TypeError";
      const errorMsg = isNetworkError
        ? "⚠️ Unable to reach the backend server. Please make sure it is running."
        : `⚠️ ${error?.message || "An unknown error occurred."}`;

      setMessages((prev) => [...prev, { role: "ai", content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              width: "min(380px, 90vw)",
              height: "550px",
              background: "rgba(10, 10, 26, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "1.25rem",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "white" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
                    StudyMate Assistant
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    AI Study Companion
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
                  padding: "4px",
                  borderRadius: "50%",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
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
                gap: "1rem",
              }}
              className="chat-scrollbar"
            >
              {messages.map((msg, index) => {
                const isAI = msg.role === "ai";
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      flexDirection: isAI ? "row" : "row-reverse",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: isAI
                          ? "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))"
                          : "rgba(255, 255, 255, 0.1)",
                        border: isAI
                          ? "1px solid rgba(124, 58, 237, 0.4)"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isAI ? "#a78bfa" : "white",
                        flexShrink: 0,
                      }}
                    >
                      {isAI ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div
                      style={{
                        maxWidth: "75%",
                        padding: "0.75rem 1rem",
                        borderRadius: "1rem",
                        borderTopLeftRadius: isAI ? "0" : "1rem",
                        borderTopRightRadius: isAI ? "1rem" : "0",
                        background: isAI
                          ? "rgba(255, 255, 255, 0.04)"
                          : "linear-gradient(135deg, #7c3aed, #6d28d9)",
                        border: isAI
                          ? "1px solid rgba(255, 255, 255, 0.08)"
                          : "1px solid rgba(124, 58, 237, 0.5)",
                        color: isAI ? "rgba(255, 255, 255, 0.9)" : "white",
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "rgba(124, 58, 237, 0.1)",
                      border: "1px solid rgba(124, 58, 237, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#a78bfa",
                    }}
                  >
                    <Bot size={14} />
                  </div>
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "1rem",
                      borderTopLeftRadius: "0",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
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
              onSubmit={handleSend}
              style={{
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.02)",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                gap: "0.5rem",
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
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  padding: "0.6rem 0.875rem",
                  color: "white",
                  fontSize: "0.85rem",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(124, 58, 237, 0.5)";
                  e.currentTarget.style.boxShadow = "0 0 10px rgba(124, 58, 237, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "0.75rem",
                  background: inputValue.trim() && !isTyping
                    ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: "none",
                  color: inputValue.trim() && !isTyping ? "white" : "rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: inputValue.trim() && !isTyping ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  if (inputValue.trim() && !isTyping) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          border: "none",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(124, 58, 237, 0.4)",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
