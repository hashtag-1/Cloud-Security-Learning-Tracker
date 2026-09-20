"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import PageLayout from "@/components/shared/Layout";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string | null;
  technologies: string[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
];

const STATUS_COLORS: Record<ProjectStatus, string> = {
  PLANNED: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  IN_PROGRESS: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  COMPLETED: "bg-green-500/20 text-green-300 border-green-500/30",
  ARCHIVED: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    githubUrl: "",
    technologies: "",
    status: "PLANNED" as ProjectStatus,
  });

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [fetchProjects]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      githubUrl: "",
      technologies: "",
      status: "PLANNED",
    });
    setFormError(null);
    setEditingProject(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setForm({
      name: project.name,
      description: project.description || "",
      githubUrl: project.githubUrl || "",
      technologies: project.technologies.join(", "),
      status: project.status,
    });
    setEditingProject(project);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const payload = {
        ...form,
        technologies: form.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        githubUrl: form.githubUrl || null,
        description: form.description || null,
      };

      let res;
      if (editingProject) {
        res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/projects", {
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
            : data.error || "Failed to save project"
        );
      }

      resetForm();
      void fetchProjects();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setConfirmDelete(null);
      void fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === "ALL") return true;
    return p.status === filterStatus;
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderOpen className="h-6 w-6" />
              Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your cloud security projects
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
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
                {editingProject ? "Edit Project" : "Add Project"}
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
                      Project Name *
                    </label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Cloud Trail Analyzer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as ProjectStatus,
                        })
                      }
                    >
                      {PROJECT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Brief description of the project"
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      GitHub URL
                    </label>
                    <Input
                      value={form.githubUrl}
                      onChange={(e) =>
                        setForm({ ...form, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Technologies
                    </label>
                    <Input
                      value={form.technologies}
                      onChange={(e) =>
                        setForm({ ...form, technologies: e.target.value })
                      }
                      placeholder="e.g. Python, AWS, Terraform"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple technologies with commas
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit">
                    {editingProject ? "Update Project" : "Create Project"}
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
                <h3 className="text-lg font-semibold">Delete Project?</h3>
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
          {PROJECT_STATUSES.map((s) => (
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
              {projects.filter((p) => p.status === s).length > 0 && (
                <span className="ml-1.5 opacity-60">
                  {projects.filter((p) => p.status === s).length}
                </span>
              )}
            </Badge>
          ))}
        </div>

        {loading && projects.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-4 spaces-y-3"
              >
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {projects.length === 0
                ? "Get started by adding your first project"
                : "No projects match the current filter"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {project.name}
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(project)}
                        className="p-1 rounded hover:bg-accent"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(project.id)}
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
                        STATUS_COLORS[project.status]
                      )}
                    >
                      {project.status.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {project.technologies.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View on GitHub
                    </a>
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