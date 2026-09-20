import { StudySession, Lab, Project, KnowledgeNote, RoadmapPhase } from "@prisma/client";

export interface DashboardStats {
  totalStudyHours: number;
  currentStreak: number;
  currentPhase: string;
  roadmapCompletion: number;
  labsCompleted: number;
  projectsCompleted: number;
  weeklyHours: number;
  monthlyHours: number;
  totalSessions: number;
  totalMicrotopicsCompleted: number;
  totalMicrotopics: number;
}

export interface WeeklyData {
  date: string;
  hours: number;
  sessions: number;
  label: string;
}

export interface MonthlyData {
  month: string;
  hours: number;
  sessions: number;
}

export interface PhaseProgress {
  phaseId: string;
  phaseTitle: string;
  phaseOrder: number;
  completionPercentage: number;
  topicsCompleted: number;
  topicsTotal: number;
  microtopicsCompleted: number;
  microtopicsTotal: number;
}

export interface AnalyticsData {
  weeklyData: WeeklyData[];
  monthlyData: MonthlyData[];
  phaseProgress: PhaseProgress[];
  streakData: StreakData[];
  heatmapData: HeatmapDay[];
  weakAreas: WeakArea[];
}

export interface StreakData {
  date: string;
  hours: number;
}

export interface HeatmapDay {
  date: string;
  hours: number;
}

export interface WeakArea {
  topic: string;
  phase: string;
  completion: number;
}

export interface CompletionForecast {
  projectedDate: string;
  weeksRemaining: number;
  confidence: string;
}

export type StudySessionWithRelations = StudySession & {
  user: { id: string; name: string; email: string };
};

export type LabWithRelations = Lab & {
  user: { id: string };
};

export type ProjectWithRelations = Project & {
  user: { id: string };
};

export type KnowledgeNoteWithRelations = KnowledgeNote & {
  user: { id: string };
  tags: { id: string; name: string }[];
};

export type RoadmapPhaseWithRelations = RoadmapPhase & {
  topics: {
    id: string;
    title: string;
    status: string;
    completionPct: number;
    microtopics: {
      id: string;
      title: string;
      status: string;
    }[];
  }[];
};