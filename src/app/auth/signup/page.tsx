"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { BookOpen, User, Mail, Lock, Eye, EyeOff, UserPlus, Camera, Loader2 } from "lucide-react";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();

  const password = watch("password");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      setImageUrl(result.url);
      toast.success("Profile picture uploaded! 📸");
    } catch (err: any) {
      toast.error(err.message ?? "Profile picture upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: imageUrl ?? undefined,
      });
      if (error) throw new Error(error.message);
      toast.success("Account created! Welcome to StudyMate AI 🚀");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "0.7rem 0.9rem 0.7rem 2.5rem",
    borderRadius: "0.6rem",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
    color: "white",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <BookOpen size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.4rem" }}>
            Create your account
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Start building your AI-powered study roadmaps
          </p>
        </div>

        <div className="glass" style={{ borderRadius: "1.25rem", padding: "2rem" }}>
          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            id="btn-google-signup"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              transition: "all 0.2s ease",
              marginBottom: "1.5rem",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Profile Image Upload */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  position: "relative",
                  width: "84px",
                  height: "84px",
                  borderRadius: "50%",
                  border: "2px dashed rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                onClick={() => document.getElementById("avatar-upload-signup")?.click()}
              >
                {uploadingImage ? (
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "#a78bfa" }} />
                ) : imageUrl ? (
                  <img src={imageUrl} alt="Avatar Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                    <Camera size={22} style={{ color: "rgba(255,255,255,0.4)" }} />
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Avatar</span>
                  </div>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>
                Add profile picture (optional)
              </span>
              <input
                id="avatar-upload-signup"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Name */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "0.4rem" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="input-name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
                  style={inputStyle(!!errors.name)}
                />
              </div>
              {errors.name && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "0.4rem" }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="input-email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                  })}
                  style={inputStyle(!!errors.email)}
                />
              </div>
              {errors.email && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "0.4rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                  style={{ ...inputStyle(!!errors.password), paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: "0.4rem" }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  id="input-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) => val === password || "Passwords do not match",
                  })}
                  style={inputStyle(!!errors.confirmPassword)}
                />
              </div>
              {errors.confirmPassword && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.confirmPassword.message}</p>}
            </div>

            <button
              id="btn-signup-submit"
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                {loading ? "Creating account…" : <><UserPlus size={16} /> Create Account</>}
              </span>
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)" }}>
            Already have an account?{" "}
            <Link href="/auth/signin" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
