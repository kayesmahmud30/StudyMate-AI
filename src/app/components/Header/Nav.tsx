"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BookOpen, Menu, X, LayoutDashboard, Compass, LogOut, LogIn, User, Plus, Info, Home } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <Home size={16} /> },
    { href: "/explore", label: "Explore", icon: <Compass size={16} /> },
    ...(!session
      ? [{ href: "/about", label: "About", icon: <Info size={16} /> }]
      : []),
    ...(session
      ? [
          { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
          { href: "/dashboard/add-roadmap", label: "Add Roadmap", icon: <Plus size={16} /> },
          { href: "/profile", label: "Profile", icon: <User size={16} /> },
        ]
      : []),
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(10, 10, 26, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        padding: "0 1.5rem",
      }}
    >
      <style>{`
        .nav-desktop-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.25rem;
          align-items: center;
          justify-content: center;
        }
        .nav-mobile-menu {
          background: rgba(10, 10, 26, 0.98);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1rem 1.5rem;
        }
        .nav-header-auth {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .nav-mobile-auth {
          display: none;
        }

        @media (max-width: 1024px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
          .nav-mobile-menu {
            display: block !important;
          }
        }
        @media (min-width: 1025px) {
          .nav-desktop-links {
            display: flex !important;
          }
          .nav-mobile-toggle {
            display: none !important;
          }
          .nav-mobile-menu {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .nav-header-auth {
            display: none !important;
          }
          .nav-mobile-auth {
            display: flex !important;
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={20} color="white" />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.2rem",
              background: "linear-gradient(135deg, #a78bfa, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            StudyMate
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: pathname === link.href ? "#a78bfa" : "rgba(255,255,255,0.7)",
                background: pathname === link.href ? "rgba(124,58,237,0.15)" : "transparent",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side items (Auth & Mobile Toggle) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Auth buttons - hidden on mobile, visible on desktop/tablet */}
          <div className="nav-header-auth">
            {!isPending && (
              <>
                {session ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? "Avatar"}
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "white",
                        }}
                      >
                        {session.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <button
                      onClick={handleSignOut}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href="/auth/signin">
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.5rem 1.2rem",
                          borderRadius: "0.5rem",
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <LogIn size={15} />
                        Sign In
                      </button>
                    </Link>
                    <Link href="/auth/signup">
                      <button className="btn-primary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}>
                        <span>Get Started</span>
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu toggle — always visible on small screens */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 0",
                textDecoration: "none",
                color: pathname === link.href ? "#a78bfa" : "rgba(255,255,255,0.8)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Mobile Auth buttons */}
          <div className="nav-mobile-auth">
            {!isPending && (
              <>
                {session ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name ?? "Avatar"}
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: "white",
                          }}
                        >
                          {session.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </div>
                      )}
                      <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                        {session.user?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMenuOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        padding: "0.65rem 1rem",
                        borderRadius: "0.5rem",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        width: "100%",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                    <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          padding: "0.65rem 1.2rem",
                          borderRadius: "0.5rem",
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        <LogIn size={15} />
                        Sign In
                      </button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{ width: "100%" }}>
                      <button className="btn-primary" style={{ padding: "0.65rem 1.2rem", fontSize: "0.85rem", width: "100%" }}>
                        <span>Get Started</span>
                      </button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
