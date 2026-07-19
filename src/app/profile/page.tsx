"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { ArrowLeft, User, Mail, Lock, Camera, Loader2, Save, KeyRound } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for general profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // States for password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
      return;
    }
    if (session?.user) {
      const timer = setTimeout(() => {
        setName(session.user.name || "");
        setEmail(session.user.email || "");
        setImageUrl(session.user.image || null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [session, isPending, router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      // Update locally first for fast feedback
      setImageUrl(result.url);

      // Update avatar URL in Better Auth
      const { error } = await authClient.updateUser({
        image: result.url,
      });
      if (error) throw new Error(error.message);

      toast.success("Profile picture updated! 📸");
      router.refresh();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update profile picture";
      toast.error(errorMsg);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    setUpdatingProfile(true);
    try {
      // Update name/avatar
      if (name !== session?.user?.name || imageUrl !== session?.user?.image) {
        const { error } = await authClient.updateUser({
          name,
          image: imageUrl ?? undefined,
        });
        if (error) throw new Error(error.message);
      }

      // Update email if changed
      if (email !== session?.user?.email) {
        const { error } = await authClient.changeEmail({
          newEmail: email,
        });
        if (error) throw new Error(error.message);
      }

      toast.success("Profile updated successfully! 🎉");
      router.refresh();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMsg);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (error) throw new Error(error.message);

      toast.success("Password changed successfully! 🔐");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to change password";
      toast.error(errorMsg);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (isPending) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
        <Loader2 size={48} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const labelStyle = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.6)",
    display: "block",
    marginBottom: "0.4rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem 0.9rem 0.7rem 2.5rem",
    borderRadius: "0.6rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Back Button */}
        <Link href="/dashboard">
          <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.875rem", marginBottom: "2rem" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>

        {/* Title */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>
            Profile Settings
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>
            Update your profile details and secure your account.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          {/* Profile Details Card */}
          <div className="glass" style={{ borderRadius: "1.25rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User size={18} color="#7c3aed" /> Personal Details
            </h2>

            {/* Profile Avatar Upload */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0.5rem 0 1rem" }}>
              <div
                className="avatar-container"
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "2px solid rgba(124,58,237,0.3)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar ? (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "#a78bfa" }} />
                  </div>
                ) : (
                  <div
                    className="avatar-hover-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.5)",
                      opacity: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <Camera size={20} style={{ color: "white" }} />
                  </div>
                )}
                {imageUrl ? (
                  <img src={imageUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "2rem", color: "white" }}>
                    {name.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.75rem" }}>
                Click to change photo
              </span>
            </div>

            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="btn-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  {updatingProfile ? (
                    <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                  ) : (
                    <><Save size={16} /> Save Changes</>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="glass" style={{ borderRadius: "1.25rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <KeyRound size={18} color="#06b6d4" /> Change Password
            </h2>

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Current Password */}
              <div>
                <label style={labelStyle}>Current Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="btn-primary"
                style={{ width: "100%", marginTop: "0.5rem", background: "linear-gradient(135deg, #06b6d4, #4f46e5)" }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  {updatingPassword ? (
                    <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Changing…</>
                  ) : (
                    <><KeyRound size={16} /> Update Password</>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .avatar-container:hover .avatar-hover-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
