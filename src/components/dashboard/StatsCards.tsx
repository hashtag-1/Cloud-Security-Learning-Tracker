import Progress from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {trend >= 0 ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Circle className="h-4 w-4 text-red-600" />
          )}
          <span
            className={cn(
              "font-medium",
              trend >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}

interface ProgressWidgetProps {
  label: string;
  percentage: number;
  details?: string;
}

export function ProgressWidget({
  label,
  percentage,
  details,
}: ProgressWidgetProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      {details && (
        <p className="mt-1 text-xs text-muted-foreground">{details}</p>
      )}
    </div>
  );
}

interface StreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakWidget({
  currentStreak,
  longestStreak,
}: StreakWidgetProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🔥</span>
        <span className="text-sm font-medium">
          {currentStreak} day streak
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Longest: {longestStreak} days
      </p>
    </div>
  );
}