"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  Flame,
  Clock,
  Target,
  Activity,
  CalendarDays,
  Hash,
  Zap,
} from "lucide-react";
import PageLayout from "@/components/shared/Layout";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import {
  HoursChart,
  SimpleBarChart,
} from "@/components/dashboard/Charts";
import Progress from "@/components/ui/Progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`Failed to load analytics (${res.status})`);
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

  const heatmapData = useMemo(() => {
    if (!data?.weeklyData) return [];
    const weeks: { day: string; date: string; hours: number }[][] = [];
    for (let w = 11; w >= 0; w--) {
      const week: { day: string; date: string; hours: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toISOString();
        const found = data.weeklyData.find((wd) => {
          const wdDate = new Date(wd.date);
          return (
            wdDate.getDate() === date.getDate() &&
            wdDate.getMonth() === date.getMonth() &&
            wdDate.getFullYear() === date.getFullYear()
          );
        });
        const hours = found ? found.hours : 0;
        week.push({
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          date: dateStr,
          hours,
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [data]);

  const maxHeatmapHours = useMemo(() => {
    let max = 0;
    heatmapData.forEach((week) => {
      week.forEach((day) => {
        if (day.hours > max) max = day.hours;
      });
    });
    return max || 1;
  }, [heatmapData]);

  const getHeatmapColor = (hours: number) => {
    if (hours === 0) return "bg-muted/30";
    const ratio = hours / maxHeatmapHours;
    if (ratio < 0.25) return "bg-green-500/20";
    if (ratio < 0.5) return "bg-green-500/35";
    if (ratio < 0.75) return "bg-green-500/55";
    return "bg-green-500/80";
  };

  const stats = data?.stats;
  const phaseChartData = (data?.phaseProgress ?? []).map((p) => ({
    name: p.phaseTitle.length > 12 ? p.phaseTitle.slice(0, 12) + "…" : p.phaseTitle,
    value: Math.round(p.completionPercentage),
  }));

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your learning progress and trends
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              void fetchData();
            }}
            disabled={loading}
          >
            <Activity className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl border bg-card p-6 animate-pulse" />
            ))}
          </div>
        ) : null}

        {!loading && data && stats ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Study Hours"
                value={stats.totalStudyHours}
                description={`${stats.totalSessions} sessions`}
                icon={<Clock className="h-5 w-5 text-muted-foreground" />}
              />
              <StatCard
                title="Current Streak"
                value={`${stats.currentStreak}d`}
                description="Consecutive days"
                icon={<Flame className="h-5 w-5 text-orange-400" />}
              />
              <StatCard
                title="Roadmap Progress"
                value={`${Math.round(stats.roadmapCompletion)}%`}
                description={stats.currentPhase}
                icon={<Target className="h-5 w-5 text-muted-foreground" />}
              />
              <StatCard
                title="Monthly Hours"
                value={stats.monthlyHours}
                description="This month"
                icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <HoursChart
                  data={data.weeklyData}
                  title="Weekly Study Hours"
                />
              </div>
              <div className="rounded-xl border bg-card p-6">
                <SimpleBarChart
                  data={phaseChartData}
                  title="Phase Progress"
                />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Activity Heatmap (12 weeks)
              </h3>
              <div className="overflow-x-auto">
                <div className="inline-flex flex-col gap-1">
                  <div className="flex gap-1 ml-6">
                    {heatmapData.map((week, wi) => (
                      <div key={wi} className="w-3 text-center">
                        {wi % 2 === 0 ? (
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(new Date().setDate(new Date().getDate() - (11 - wi) * 7)).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <div className="flex flex-col gap-1 mr-1">
                      {["M", "", "W", "", "F", "", "S"].map((d, i) => (
                        <div key={i} className="h-3 w-3 text-[10px] text-muted-foreground flex items-center">
                          {d}
                        </div>
                      ))}
                    </div>
                    {heatmapData.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((day, di) => (
                          <div
                            key={di}
                            className={cn(
                              "h-3 w-3 rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-ring",
                              getHeatmapColor(day.hours)
                            )}
                            title={`${day.day} ${formatDate(day.date)}: ${day.hours}h`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 ml-6">
                <span className="text-xs text-muted-foreground">Less</span>
                {["bg-muted/30", "bg-green-500/20", "bg-green-500/35", "bg-green-500/55", "bg-green-500/80"].map((cls, i) => (
                  <div key={i} className={cn("h-3 w-3 rounded-sm", cls)} />
                ))}
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="text-sm font-medium mb-4">Phase Breakdown</h3>
              <div className="space-y-4">
                {data.phaseProgress.map((phase) => (
                  <div key={phase.phaseTitle} className="flex items-center gap-4">
                    <div className="w-40 shrink-0">
                      <p className="text-sm font-medium truncate">{phase.phaseTitle}</p>
                    </div>
                    <div className="flex-1">
                      <Progress value={phase.completionPercentage} className="h-2" />
                    </div>
                    <div className="w-12 text-right shrink-0">
                      <span className="text-sm font-medium text-muted-foreground">
                        {Math.round(phase.completionPercentage)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </PageLayout>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-xs">
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50">
          {icon}
        </div>
      </div>
    </div>
  );
}
