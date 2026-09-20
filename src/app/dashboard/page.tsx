"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Clock,
  Flame,
  FolderOpen,
  FlaskConical,
  RefreshCw,
  Target,
} from "lucide-react";
import PageLayout from "@/components/shared/Layout";
import { cn } from "@/lib/utils";
import {
  HoursChart,
  SimpleBarChart,
} from "@/components/dashboard/Charts";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-xs transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-semibold">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProgressWidgetProps {
  label: string;
  percentage: number;
  details?: string;
}

function ProgressWidget({ label, percentage, details }: ProgressWidgetProps) {
  const pct = Math.min(Math.max(percentage, 0), 100);
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full w-0 rounded-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {details && (
        <p className="mt-2 text-xs text-muted-foreground">{details}</p>
      )}
    </div>
  );
}

interface DashboardData {
  stats: {
    totalStudyHours: number;
    currentStreak: number;
    currentPhase: string;
    roadmapCompletion: number;
    labsCompleted: number;
    projectsCompleted: number;
    weeklyHours: number;
    monthlyHours: number;
    totalSessions: number;
  };
  weeklyData: { date: string; hours: number; label: string }[];
  phaseProgress: { phaseTitle: string; completionPercentage: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        throw new Error(`Failed to load dashboard (${res.status})`);
      }
      const json: DashboardData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const stats = data?.stats;
  const phaseChartData = (data?.phaseProgress ?? []).map((p) => ({
    name: p.phaseTitle,
    value: Math.round(p.completionPercentage),
  }));

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {data?.stats?.currentPhase ?? "Track your learning journey"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchData();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium opacity-75 transition-opacity hover:opacity-100 hover:bg-secondary/80 disabled:cursor-not-allowed"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl border bg-card p-6 shadow-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
                  <div className="h-10 w-10 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && data && stats ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Study Hours"
                value={stats.totalStudyHours}
                description={`${stats.totalSessions} sessions logged`}
                icon={<Clock className="h-5 w-5 text-muted-foreground" />}
              />
              <StatCard
                title="Current Streak"
                value={`${stats.currentStreak} days`}
                description="Keep the momentum going"
                icon={<Flame className="h-5 w-5 text-orange-400" />}
              />
              <StatCard
                title="Roadmap Completion"
                value={`${Math.round(stats.roadmapCompletion)}%`}
                description={stats.currentPhase}
                icon={
                  <Target className="h-5 w-5 text-muted-foreground" />
                }
              />
              <StatCard
                title="Weekly Hours"
                value={stats.weeklyHours}
                description="Hours this week"
                icon={
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                }
              />
            </div>

            <ProgressWidget
              label="Overall Roadmap Completion"
              percentage={stats.roadmapCompletion}
              details={stats.currentPhase}
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Labs Completed"
                value={stats.labsCompleted}
                icon={
                  <FlaskConical className="h-5 w-5 text-muted-foreground" />
                }
              />
              <StatCard
                title="Projects Completed"
                value={stats.projectsCompleted}
                icon={
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                }
              />
              <StatCard
                title="Monthly Hours"
                value={stats.monthlyHours}
                description="Hours this month"
                icon={
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                }
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border bg-card p-6 shadow-xs">
                <HoursChart
                  data={data.weeklyData}
                  title="Weekly Study Hours"
                />
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-xs">
                <SimpleBarChart
                  data={phaseChartData}
                  title="Phase Progress"
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </PageLayout>
  );
}
