// ─── Roadmap ────────────────────────────────────────────────────────────────
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Roadmap {
  _id: string;
  userId: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  deadline: string; // ISO date string
  estimatedHours: number;
  shortDescription: string;
  description: string;
  createdAt: string;
  isPublic: boolean;
}

export type RoadmapFormData = Omit<Roadmap, "_id" | "userId" | "createdAt">;

// ─── Schedule ────────────────────────────────────────────────────────────────
export interface ScheduleDay {
  dayNumber: number;
  topic: string;
  tasks: string[];
  savedAt?: string;
}

export interface Schedule {
  _id: string;
  roadmapId: string;
  userId: string;
  scheduleDays: ScheduleDay[];
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  roadmapId: string;
  userId: string;
  messages: ChatMessage[];
}

// ─── API Response ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
