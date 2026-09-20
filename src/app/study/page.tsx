"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Hash,
  Plus,
  Edit2,
  Trash2,
  X,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import PageLayout from "@/components/shared/Layout";
import { cn, formatDate, formatDuration } from "@/lib/utils";
import { studySessionSchema } from "@/lib/schemas";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface StudySession {
  id: string;
  date: string;
  duration: number;
  topicsStudied: string;
  notes: string | null;
  mood: string | null;
  productivityRating: number | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface StudySessionsResponse {
  sessions?: StudySession[];
  stats?: {
    totalSessions?: number;
    totalStudyHours?: number;
  };
}

const MOOD_COLORS: Record<string, string> = {
  FOCUSED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  OK: "bg-green-500/10 text-green-400 border-green-500/20",
  TIRED: "bg-red-500/10 text-red-400 border-red-500/20",
  DISTRACTED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ENTHUSIASTIC: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const MOOD_ICONS: Record<string, string> = {
  FOCUSED: "🧠",
  OK: "😐",
  TIRED: "😴",
  DISTRACTED: "🌀",
  ENTHUSIASTIC: "🔥",
};

const MOOD_OPTIONS = [
  "FOCUSED",
  "OK",
  "TIRED",
  "DISTRACTED",
  "ENTHUSIASTIC",
];

const PRODUCTIVITY_COLORS: Record<string, string> = {
  "1": "text-red-400",
  "2": "text-orange-400",
  "3": "text-yellow-400",
  "4": "text-blue-400",
  "5": "text-green-400",
};

export default function StudyPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<{
    totalSessions: number;
    totalStudyHours: number;
    avgProductivity: number;
  }>({ totalSessions: 0, totalStudyHours: 0, avgProductivity: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    duration: 30,
    topicsStudied: "",
    notes: "",
    mood: "",
    productivityRating: "",
  });

  const fetchSessions = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/study-sessions");
      if (!res.ok) throw new Error(`Failed to fetch sessions (${res.status})`);
      const data: StudySessionsResponse = await res.json();

      const sessionList = data.sessions ?? [];
      setSessions(sessionList);

      const totalSessions = sessionList.length;
      const totalStudyHours = sessionList.reduce(
        (sum, s) => sum + s.duration / 60,
        0
      );
      const ratedSessions = sessionList.filter(
        (s) => s.productivityRating !== null
      );
      const avgProductivity =
        ratedSessions.length > 0
          ? ratedSessions.reduce((sum, s) => sum + (s.productivityRating ?? 0), 0) /
            ratedSessions.length
          : 0;

      setStats({ totalSessions, totalStudyHours, avgProductivity });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split("T")[0],
      duration: 30,
      topicsStudied: "",
      notes: "",
      mood: "",
      productivityRating: "",
    });
    setFormError(null);
    setEditingSession(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (session: StudySession) => {
    const dateStr = new Date(session.date).toISOString().split("T")[0];
    setForm({
      date: dateStr,
      duration: session.duration,
      topicsStudied: session.topicsStudied,
      notes: session.notes || "",
      mood: session.mood || "",
      productivityRating: session.productivityRating
        ? String(session.productivityRating)
        : "",
    });
    setEditingSession(session);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const topicsArray = form.topicsStudied
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        date: form.date,
        duration: form.duration,
        topicsStudied: topicsArray,
        notes: form.notes || undefined,
        mood: form.mood || undefined,
        productivityRating: form.productivityRating || undefined,
      };

      studySessionSchema.parse(payload);

      let res: Response;
      if (editingSession) {
        res = await fetch(`/api/study-sessions/${editingSession.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/study-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error?.issues
            ? (data.error.issues as Array<{ message: string }>)
                .map((i) => i.message)
                .join(", ")
            : data.error || "Failed to save session"
        );
      }

      resetForm();
      void fetchSessions();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/study-sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete session");
      setConfirmDelete(null);
      void fetchSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const totalHours = stats.totalStudyHours;
  const avgProductivity = stats.avgProductivity;

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Study Log
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your study sessions and progress
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto hover:opacity-70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="shadow-xs">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
                    Total Sessions
                  </p>
                  <p className="text-2xl font-semibold">{stats.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xs">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
                    Total Hours
                  </p>
                  <p className="text-2xl font-semibold">
                    {totalHours < 1
                      ? `${Math.round(totalHours * 60)}m`
                      : `${totalHours.toFixed(1)}h`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xs">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
                    Avg Productivity
                  </p>
                  <p className="text-2xl font-semibold">
                    {avgProductivity > 0 ? `${avgProductivity.toFixed(1)}/5` : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingSession ? "Edit Session" : "New Study Session"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive mb-4">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Duration (minutes)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={form.duration}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Topics Studied
                  </label>
                  <Input
                    value={form.topicsStudied}
                    onChange={(e) =>
                      setForm({ ...form, topicsStudied: e.target.value })
                    }
                    placeholder="e.g. AWS IAM, Terraform, Kubernetes (comma separated)"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple topics with commas
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mood</label>
                    <Select
                      value={form.mood}
                      onChange={(e) =>
                        setForm({ ...form, mood: e.target.value })
                      }
                    >
                      <option value="">No mood selected</option>
                      {MOOD_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Productivity Rating
                    </label>
                    <Select
                      value={form.productivityRating}
                      onChange={(e) =>
                        setForm({ ...form, productivityRating: e.target.value })
                      }
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Below Average</option>
                      <option value="3">3 - Average</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Excellent</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="What did you study? Key takeaways?"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit">
                    {editingSession ? "Update Session" : "Create Session"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-sm mx-4">
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Delete Session?</h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleDelete(confirmDelete)
                    }
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {loading && sessions.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-6 shadow-xs space-y-3"
              >
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No sessions yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click &ldquo;New Session&rdquo; to log your first study session
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="group hover:border-primary/30 transition-colors"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {formatDate(session.date)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ·
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(session.duration)}
                        </span>
                        {session.mood && (
                          <>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium", MOOD_COLORS[session.mood] || "bg-muted/30")}>
                              {MOOD_ICONS[session.mood] || ""}
                              {session.mood}
                            </span>
                          </>
                        )}
                      </div>

                      {session.topicsStudied && (
                        <div className="flex gap-1.5 flex-wrap">
                          {session.topicsStudied
                            .split(",")
                            .map((topic, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-foreground"
                              >
                                {topic.trim()}
                              </span>
                            ))}
                        </div>
                      )}

                      {session.productivityRating && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            Productivity:
                          </span>
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              PRODUCTIVITY_COLORS[
                                String(session.productivityRating)
                              ] || "text-muted-foreground"
                            )}
                          >
                            {session.productivityRating}/5
                          </span>
                        </div>
                      )}

                      {session.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {session.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => openEdit(session)}
                        className="p-1.5 rounded hover:bg-accent"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(session.id)}
                        className="p-1.5 rounded hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
