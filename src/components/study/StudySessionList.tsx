import { StudySession } from "@prisma/client";
import { formatDuration } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { CalendarDays } from "lucide-react";

interface StudySessionListProps {
  sessions: StudySession[];
}

export function StudySessionList({ sessions }: StudySessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No study sessions recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardContent className="pt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {new Date(session.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <Badge variant="secondary">
              {formatDuration(session.duration)}
            </Badge>
            <div className="text-sm flex-1 min-w-0 truncate">
              {session.topicsStudied}
            </div>
            {session.productivityRating && (
              <div className="text-sm">
                Productivity: {session.productivityRating}/5
              </div>
            )}
            {session.mood && (
              <Badge variant="outline">{session.mood}</Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}