"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { ArrowLeft, BookOpen, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import type { RoadmapFormData } from "@/lib/types";
import { getAuthToken } from "@/lib/getAuthToken";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

const SUBJECTS = [
  "Web Development", "Machine Learning", "Data Science", "Cloud Computing",
  "Cybersecurity", "Mobile Development", "DevOps", "UI/UX Design",
  "Algorithms & Data Structures", "Databases", "Systems Programming", "Blockchain", "Other",
];

const labelStyle = {
  fontSize: "0.8rem",
  fontWeight: 600 as const,
  color: "rgba(255,255,255,0.6)",
  display: "block" as const,
  marginBottom: "0.4rem",
};

const inputStyle = (hasError: boolean) => ({
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: "0.6rem",
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
  color: "white",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
});

export default function AddRoadmapPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.push("/auth/signin");
  }, [session, isPending, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RoadmapFormData>({
    defaultValues: {
      difficulty: "Beginner",
      isPublic: false,
      estimatedHours: 20,
    },
  });

  const onSubmit = async (data: RoadmapFormData) => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${SERVER_URL}/api/roadmaps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      toast.success("Roadmap created successfully! 🚀");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create roadmap");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed" }}>
        <Loader2 size={40} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <Link href="/dashboard">
          <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.875rem", marginBottom: "2rem" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
            Create a New Roadmap
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>
            Define your learning goals and let AI generate a personalised study schedule.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="glass" style={{ borderRadius: "1.25rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>Roadmap Title *</label>
              <input
                id="input-title"
                placeholder="e.g. Complete React Developer Roadmap"
                {...register("title", { required: "Title is required", minLength: { value: 5, message: "Min 5 characters" } })}
                style={inputStyle(!!errors.title)}
              />
              {errors.title && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.title.message}</p>}
            </div>

            {/* Subject + Difficulty */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Subject *</label>
                <select
                  id="select-subject"
                  {...register("subject", { required: "Subject is required" })}
                  style={{ ...inputStyle(!!errors.subject), cursor: "pointer" }}
                >
                  <option value="" style={{ background: "#0f0f2e" }}>Select subject…</option>
                  {SUBJECTS.map((s) => <option key={s} value={s} style={{ background: "#0f0f2e" }}>{s}</option>)}
                </select>
                {errors.subject && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.subject.message}</p>}
              </div>

              <div>
                <label style={labelStyle}>Difficulty *</label>
                <select
                  id="select-difficulty"
                  {...register("difficulty")}
                  style={{ ...inputStyle(false), cursor: "pointer" }}
                >
                  {["Beginner", "Intermediate", "Advanced"].map((d) => (
                    <option key={d} value={d} style={{ background: "#0f0f2e" }}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deadline + Estimated Hours */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Target Deadline *</label>
                <input
                  id="input-deadline"
                  type="date"
                  {...register("deadline", { required: "Deadline is required" })}
                  style={{ ...inputStyle(!!errors.deadline), colorScheme: "dark" }}
                />
                {errors.deadline && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.deadline.message}</p>}
              </div>

              <div>
                <label style={labelStyle}>Estimated Hours *</label>
                <input
                  id="input-hours"
                  type="number"
                  min={1}
                  max={10000}
                  {...register("estimatedHours", {
                    required: "Required",
                    min: { value: 1, message: "Min 1 hour" },
                    max: { value: 10000, message: "Max 10,000" },
                  })}
                  style={inputStyle(!!errors.estimatedHours)}
                />
                {errors.estimatedHours && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.estimatedHours.message}</p>}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label style={labelStyle}>Short Description *</label>
              <input
                id="input-short-desc"
                placeholder="One-line summary shown on the card (max 150 chars)"
                maxLength={150}
                {...register("shortDescription", { required: "Short description is required" })}
                style={inputStyle(!!errors.shortDescription)}
              />
              {errors.shortDescription && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.shortDescription.message}</p>}
            </div>

            {/* Full Description */}
            <div>
              <label style={labelStyle}>Full Description *</label>
              <textarea
                id="input-description"
                rows={6}
                placeholder="Detailed learning objectives, prerequisites, what you'll build…"
                {...register("description", { required: "Description is required", minLength: { value: 30, message: "Min 30 characters" } })}
                style={{ ...inputStyle(!!errors.description), resize: "vertical", lineHeight: 1.6 }}
              />
              {errors.description && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.description.message}</p>}
            </div>

            {/* Public toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.2rem" }}>Make Public</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
                  Share this roadmap with the community on the Explore page.
                </p>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px" }}>
                <input
                  id="toggle-public"
                  type="checkbox"
                  {...register("isPublic")}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: watch("isPublic") ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,0.1)",
                    borderRadius: "26px",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: watch("isPublic") ? "24px" : "2px",
                      top: "2px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "white",
                      transition: "left 0.3s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }}
                  />
                </span>
              </label>
            </div>

            <button
              id="btn-create-roadmap"
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                {loading ? (
                  <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Creating…</>
                ) : (
                  <><Plus size={16} /> Create Roadmap</>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
