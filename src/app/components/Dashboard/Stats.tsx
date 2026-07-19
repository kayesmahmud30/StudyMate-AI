"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BookOpen, Clock } from "lucide-react";

interface StatData {
  totalRoadmaps: number;
  totalEstimatedHours: number;
  difficultyBreakdown: Array<{ _id: string; count: number }>;
  subjectBreakdown: Array<{ _id: string; count: number }>;
}

interface StatsProps {
  data: StatData;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "#10b981",
  Intermediate: "#fbbf24",
  Advanced: "#f87171",
};

const SUBJECT_COLORS = ["#7c3aed", "#06b6d4", "#ec4899", "#10b981", "#fbbf24", "#f97316"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(15,15,46,0.95)",
        border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: "0.6rem",
        padding: "0.7rem 1rem",
        fontSize: "0.85rem",
      }}
    >
      <p style={{ color: "#a78bfa", fontWeight: 700, marginBottom: "0.25rem" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: "rgba(255,255,255,0.8)" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Stats({ data }: StatsProps) {
  const statCards = [
    {
      icon: <BookOpen size={22} />,
      label: "Total Roadmaps",
      value: data.totalRoadmaps,
      color: "#7c3aed",
    },
    {
      icon: <Clock size={22} />,
      label: "Hours Planned",
      value: data.totalEstimatedHours,
      color: "#10b981",
    },
  ];

  const pieData = data.difficultyBreakdown.map((d) => ({
    name: d._id,
    value: d.count,
  }));

  const barData = data.subjectBreakdown.slice(0, 8).map((s) => ({
    name: s._id.length > 12 ? s._id.slice(0, 12) + "…" : s._id,
    Roadmaps: s.count,
  }));

  return (
    <div>
      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            className="glass glass-hover"
            style={{
              borderRadius: "1rem",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: `${s.color}20`,
                border: `1px solid ${s.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: s.color,
                  marginBottom: "0.25rem",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Difficulty Pie Chart */}
        <div
          className="glass"
          style={{ borderRadius: "1rem", padding: "1.5rem" }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Difficulty Breakdown
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={DIFFICULTY_COLORS[entry.name] ?? "#7c3aed"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.875rem",
              }}
            >
              No data yet — create roadmaps to see analytics
            </div>
          )}
        </div>

        {/* Subject Bar Chart */}
        <div
          className="glass"
          style={{ borderRadius: "1rem", padding: "1.5rem" }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Roadmaps by Subject
          </h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barCategoryGap="35%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.1)" }} />
                <Bar dataKey="Roadmaps" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.875rem",
              }}
            >
              No data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
