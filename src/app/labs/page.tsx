"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FlaskConical,
  Plus,
  Edit2,
  Trash2,
  X,
  Layers,
} from "lucide-react";
import PageLayout from "@/components/shared/Layout";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type LabStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";
type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface Lab {
  id: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  status: LabStatus;
  notes: string | null;
  skillsLearned: string[];
  createdAt: string;
  updatedAt: string;
}

const LAB_STATUSES: LabStatus[] = ["PLANNED", "IN_PROGRESS", "COMPLETED"];
const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const STATUS_COLORS: Record<LabStatus, string> = {
  PLANNED: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  COMPLETED: "bg-green-500/20 text-green-300 border-green-500/30",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  MEDIUM: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  HARD: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    difficulty: "MEDIUM" as Difficulty,
    status: "PLANNED" as LabStatus,
    notes: "",
    skills: "",
  });

  const fetchLabs = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/labs");
      if (!res.ok) throw new Error("Failed to fetch labs");
      const data: Lab[] = await res.json();
      setLabs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLabs();
  }, [fetchLabs]);

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      difficulty: "MEDIUM",
      status: "PLANNED",
      notes: "",
      skills: "",
    });
    setFormError(null);
    setEditingLab(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (lab: Lab) => {
    setForm({
      name: lab.name,
      category: lab.category,
      difficulty: lab.difficulty as Difficulty,
      status: lab.status as LabStatus,
      notes: lab.notes || "",
      skills: lab.skillsLearned.join(", "),
    });
    setEditingLab(lab);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const payload = {
        ...form,
        skillsLearned: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      let res;
      if (editingLab) {
        res = await fetch(`/api/labs/${editingLab.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/labs", {
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
            : data.error || "Failed to save lab"
        );
      }

      resetForm();
      void fetchLabs();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/labs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lab");
      setConfirmDelete(null);
      void fetchLabs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const filteredLabs = labs.filter((lab) => {
    if (filterStatus === "ALL") return true;
    return lab.status === filterStatus;
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="h-6 w-6" />
              Labs
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your cloud security labs
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lab
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingLab ? "Edit Lab" : "Add Lab"}
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
                    <label className="text-sm font-medium">
                      Lab Name *
                    </label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. VPC Security Audit"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Category *
                    </label>
                    <Input
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      placeholder="e.g. Cloud Computing"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Difficulty
                    </label>
                    <Select
                      value={form.difficulty}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          difficulty: e.target.value as Difficulty,
                        })
                      }
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as LabStatus,
                        })
                      }
                    >
                      {LAB_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
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
                    placeholder="Lab notes, objectives, etc."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Skills Learned
                  </label>
                  <Input
                    value={form.skills}
                    onChange={(e) =>
                      setForm({ ...form, skills: e.target.value })
                    }
                    placeholder="e.g. Terraform, AWS CLI, Security Groups"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple skills with commas
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit">
                    {editingLab ? "Update Lab" : "Create Lab"}
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
                <h3 className="text-lg font-semibold">Delete Lab?</h3>
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
                    onClick={() => handleDelete(confirmDelete)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Badge
            className={cn(
              "cursor-pointer border",
              filterStatus === "ALL"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
            onClick={() => setFilterStatus("ALL")}
          >
            All
          </Badge>
          {LAB_STATUSES.map((s) => (
            <Badge
              key={s}
              className={cn(
                "cursor-pointer border",
                filterStatus === s
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
              onClick={() => setFilterStatus(s)}
            >
              {s.replace(/_/g, " ")}
              {labs.filter((l) => l.status === s).length > 0 && (
                <span className="ml-1.5 opacity-60">
                  {labs.filter((l) => l.status === s).length}
                </span>
              )}
            </Badge>
          ))}
        </div>

        {loading && labs.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-4 space-y-3"
              >
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filteredLabs.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No labs found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {labs.length === 0
                ? "Get started by adding your first lab"
                : "No labs match the current filter"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLabs.map((lab) => (
              <Card key={lab.id} className="group hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {lab.name}
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(lab)}
                        className="p-1 rounded hover:bg-accent"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(lab.id)}
                        className="p-1 rounded hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-1.5 flex-wrap">
                    <Badge
                      className={cn(
                        "border text-xs",
                        STATUS_COLORS[lab.status as LabStatus] ||
                          "bg-gray-500/20 text-gray-300"
                      )}
                    >
                      {lab.status.replace(/_/g, " ")}
                    </Badge>
                    <Badge
                      className={cn(
                        "border text-xs",
                        DIFFICULTY_COLORS[lab.difficulty as Difficulty] ||
                          "bg-gray-500/20 text-gray-300"
                      )}
                    >
                      {lab.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {lab.category}
                    </Badge>
                  </div>

                  {lab.skillsLearned.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {lab.skillsLearned.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {lab.notes && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lab.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}