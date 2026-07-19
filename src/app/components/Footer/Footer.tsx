import Link from "next/link";
import { BookOpen, GitBranch, Globe, Share2 } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Explore Roadmaps", href: "/explore" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Add Roadmap", href: "/dashboard/add-roadmap" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,26,0.8)",
        padding: "4rem 1.5rem 2rem",
      }}
    >
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 3rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top */}
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOpen size={18} color="white" />
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  background: "linear-gradient(135deg, #a78bfa, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                StudyMate
              </span>
            </Link>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                maxWidth: "260px",
              }}
            >
              Your intelligent study companion. Build roadmaps, track schedules, and structure your learning.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1.25rem",
              }}
            >
              {[GitBranch, Globe, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.5)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "1rem",
                }}
              >
                {group}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        textDecoration: "none",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.875rem",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} StudyMate. All rights reserved.
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
            Built with ♥ using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
