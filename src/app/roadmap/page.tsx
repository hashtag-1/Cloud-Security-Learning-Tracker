"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Map,
  RefreshCw,
} from "lucide-react";
import PageLayout from "@/components/shared/Layout";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";

type MicrotopicStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "REVISION_REQUIRED";
type TopicStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "REVISION_REQUIRED";

interface RoadmapMicrotopic {
  id: string;
  title: string;
  description: string | null;
  depth: string | null;
  status: MicrotopicStatus;
}

interface RoadmapTopic {
  id: string;
  order: number;
  title: string;
  objective: string | null;
  status: TopicStatus;
  completionPct: number;
  microtopics: RoadmapMicrotopic[];
}

interface RoadmapPhase {
  id: string;
  order: number;
  title: string;
  objective: string | null;
  estimatedWeeks: number | null;
  status: string;
  completionPct: number;
  topics: RoadmapTopic[];
}

interface RoadmapData {
  phases: RoadmapPhase[];
}

const STATUS_BADGE: Record<MicrotopicStatus | TopicStatus, string> = {
  NOT_STARTED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
  REVISION_REQUIRED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_ICON: Record<MicrotopicStatus | TopicStatus, React.ReactNode> = {
  NOT_STARTED: <CircleIcon />,
  IN_PROGRESS: <Loader2 className="h-3 w-3 animate-spin" />,
  COMPLETED: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  REVISION_REQUIRED: <AlertCircle className="h-3 w-3 text-red-500" />,
};

const NEXT_STATUS: Record<MicrotopicStatus, MicrotopicStatus> = {
  NOT_STARTED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: "REVISION_REQUIRED",
  REVISION_REQUIRED: "NOT_STARTED",
};

function CircleIcon() {
  return (
    <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export default function RoadmapPage() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/roadmap");
      if (!res.ok) throw new Error(`Failed to load roadmap (${res.status})`);
      const json: RoadmapData = await res.json();
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

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const handleStatusCycle = async (microtopicId: string, currentStatus: MicrotopicStatus) => {
    const newStatus = NEXT_STATUS[currentStatus];
    try {
      const res = await fetch("/api/roadmap/microtopic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ microtopicId, status: newStatus }),
      });
      if (res.ok) {
        setData((prev) => {
          if (!prev) return prev;
          return {
            phases: prev.phases.map((phase) => ({
              ...phase,
              topics: phase.topics.map((topic) => {
                if (!topic.microtopics.some((m) => m.id === microtopicId)) return topic;
                const updatedMicros = topic.microtopics.map((m) =>
                  m.id === microtopicId ? { ...m, status: newStatus } : m
                );
                const completedMicros = updatedMicros.filter((m) => m.status === "COMPLETED").length;
                const newPct = updatedMicros.length > 0 ? Math.round((completedMicros / updatedMicros.length) * 100) : 0;
                return { ...topic, microtopics: updatedMicros, completionPct: newPct };
              }),
            })),
          };
        });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Map className="h-6 w-6" />
              Roadmap
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your learning path through cloud security
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
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl border bg-card p-6 animate-pulse" />
            ))}
          </div>
        ) : null}

        {!loading && data && (
          <div className="space-y-4">
            {data.phases.map((phase) => {
              const isExpanded = expandedPhases.has(phase.id);
              return (
                <div key={phase.id} className="rounded-xl border bg-card overflow-hidden">
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/30 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground">
                          Phase {phase.order}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · {phase.estimatedWeeks}w estimated
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold mt-0.5">{phase.title}</h2>
                      {phase.objective && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {phase.objective}
                        </p>
                      )}
                    </div>
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      <Progress
                        value={phase.completionPct}
                        className="w-24 h-1.5"
                      />
                      <span className="text-sm font-medium text-muted-foreground w-10 text-right">
                        {Math.round(phase.completionPct)}%
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t px-5 pb-5 space-y-3">
                      {phase.topics.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No topics yet</p>
                      ) : (
                        phase.topics.map((topic) => {
                          const isTopicExpanded = expandedTopics.has(topic.id);
                          return (
                            <div key={topic.id} className="ml-2 border-l-2 border-muted pl-4">
                              <button
                                onClick={() => toggleTopic(topic.id)}
                                className="w-full flex items-center gap-3 py-2 text-left hover:bg-accent/30 rounded-md transition-colors"
                              >
                                {isTopicExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-medium">{topic.title}</h3>
                                </div>
                                <Badge className={cn("text-xs", STATUS_BADGE[topic.status])}>
                                  {topic.status.replace(/_/g, " ")}
                                </Badge>
                              </button>

                              {isTopicExpanded && (
                                <div className="mt-2 ml-6 space-y-1.5">
                                  {topic.microtopics.map((micro) => (
                                    <div
                                      key={micro.id}
                                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent/30 transition-colors group"
                                    >
                                      {STATUS_ICON[micro.status]}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm">{micro.title}</p>
                                        {micro.description && (
                                          <p className="text-xs text-muted-foreground truncate">
                                            {micro.description}
                                          </p>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => handleStatusCycle(micro.id, micro.status)}
                                        className={cn(
                                          "shrink-0 text-xs border px-2 py-1 rounded-md transition-colors hover:opacity-80",
                                          STATUS_BADGE[micro.status]
                                        )}
                                        title={`Click to cycle status (currently: ${micro.status.replace(/_/g, " ")})`}
                                      >
                                        {micro.status.replace(/_/g, " ")}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
