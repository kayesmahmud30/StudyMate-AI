"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { BookOpen, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

interface SignInForm {
  email: string;
  password: string;
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>();

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) throw new Error(error.message);
      toast.success("Welcome back! 🎉");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Sign in failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.25rem 4rem",
      }}
    >
      <style>{`
        .auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: 1.25rem;
          padding: 2.25rem 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-google {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          transition: all 0.2s ease;
          margin-bottom: 1.5rem;
          white-space: nowrap;
        }
        .btn-google:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .btn-google:active {
          transform: translateY(0);
        }
        .auth-input {
          width: 100%;
          padding: 0.7rem 0.9rem 0.7rem 2.5rem;
          border-radius: 0.6rem;
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .auth-input:focus {
          background: rgba(255,255,255,0.07);
          border-color: rgba(124, 58, 237, 0.5) !important;
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
        }
        .logo-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
        }
        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem 1.25rem !important;
          }
          .btn-google {
            font-size: 0.85rem;
            padding: 0.7rem;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="logo-box">
            <BookOpen size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.4rem", letterSpacing: "-0.02em" }}>
            Welcome back
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Card */}
        <div className="glass auth-card">
          {/* Subtle background glow inside the card */}
          <div
            style={{
              position: "absolute",
              top: "-40%",
              left: "-40%",
              width: "180%",
              height: "180%",
              background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, rgba(0,0,0,0) 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              id="btn-google-signin"
              className="btn-google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {/* Email */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)", display: "block", marginBottom: "0.4rem" }}>
                  Email address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
                  <input
                    id="input-email"
                    defaultValue="demo@mail.com"
                    type="email"
                    placeholder="you@example.com"
                    className="auth-input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                    })}
                    style={{
                      border: `1px solid ${errors.email ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  />
                </div>
                {errors.email && (
                  <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.33rem" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.65)", display: "block", marginBottom: "0.4rem" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
                  <input
                    id="input-password"
                    defaultValue="Aa123456"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="auth-input"
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                    style={{
                      border: `1px solid ${errors.password ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                      paddingRight: "2.5rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.9rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.33rem" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                id="btn-signin-submit"
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  {loading ? "Signing in…" : <><LogIn size={16} /> Sign In</>}
                </span>
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>
              Do not have an account?{" "}
              <Link href="/auth/signup" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
