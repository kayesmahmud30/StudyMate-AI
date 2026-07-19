"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate sending message to backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <style>{`
        .contact-container {
          min-height: 100vh;
          padding: 8rem 1.5rem 5rem;
          background: var(--gradient-hero, radial-gradient(circle at top, #0d0d21 0%, #05050f 100%));
          position: relative;
          overflow: hidden;
          color: white;
        }
        .contact-orb-1 {
          position: absolute;
          top: -10%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        .contact-orb-2 {
          position: absolute;
          bottom: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite reverse;
          pointer-events: none;
          z-index: 1;
        }
        .contact-content {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 3.5rem;
          margin-top: 3.5rem;
        }
        .contact-info-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .contact-info-card {
          padding: 2rem;
          border-radius: 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .contact-info-card:hover {
          border-color: rgba(124, 58, 237, 0.3);
          background: rgba(124, 58, 237, 0.02);
        }
        .contact-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }
        .contact-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 0.75rem;
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.3);
          color: #a78bfa;
          flex-shrink: 0;
        }
        .contact-form-card {
          padding: 3rem 2.5rem;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .contact-form-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          padding: 1px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(6, 182, 212, 0.2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.85rem 1.1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          color: white;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          outline: none;
        }
        .form-input:focus {
          background: rgba(255, 255, 255, 0.06);
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
        }
        textarea.form-input {
          resize: none;
          min-height: 120px;
        }
        .submit-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border: none;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .success-overlay {
          text-align: center;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 800px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .contact-form-card {
            padding: 2rem 1.5rem;
          }
        }
        @media (max-width: 600px) {
          .contact-container {
            padding: 6.5rem 1rem 4rem;
          }
          .contact-title {
            font-size: 2rem !important;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>

      {/* Orbs */}
      <div className="contact-orb-1" />
      <div className="contact-orb-2" />

      <div className="contact-content">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1.2rem",
              borderRadius: "999px",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              marginBottom: "1.25rem",
              fontSize: "0.85rem",
              color: "#a78bfa",
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} /> Get in Touch
          </div>
          <h1
            className="contact-title"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            {"We'd Love to Hear From You"}
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.55)",
              fontSize: "clamp(0.95rem, 3.5vw, 1.1rem)",
              maxWidth: "550px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
           {"Have a question, feedback, or suggestion? Drop us a message and we'll get back to you shortly."}
          </p>
        </div>

        {/* Content Grid */}
        <div className="contact-grid">
          {/* Info cards (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-info-panel"
          >
            <div className="contact-info-card">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                    Email Us
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    Send us your queries anytime!
                  </p>
                  <a
                    href="mailto:support@studymate.ai"
                    style={{ color: "#a78bfa", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}
                  >
                    support@studymate.ai
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                    Response Time
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    We value your time.
                  </p>
                  <span style={{ color: "#06b6d4", fontWeight: 600, fontSize: "0.95rem" }}>
                    Typically within 24 hours
                  </span>
                </div>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                    Our Location
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    Operating worldwide from
                  </p>
                  <span style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>
                    San Francisco, CA
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-form-card"
          >
            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="success-overlay"
                >
                  <CheckCircle size={56} color="#10b981" style={{ marginBottom: "1.5rem" }} />
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                    Message Sent!
                  </h2>
                  <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
                    Thank you for reaching out. We have received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="submit-btn"
                    style={{ maxWidth: "200px" }}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }}>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem" }}>
                    Send a Message
                  </h2>

                  {submitStatus === "error" && (
                    <div
                      style={{
                        padding: "0.85rem 1rem",
                        borderRadius: "0.75rem",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        color: "#ef4444",
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <AlertCircle size={16} />
                      Please fill out all required fields.
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      className="form-input"
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? (
                      <>
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "white",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}