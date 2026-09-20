"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Tag,
} from "lucide-react";
import PageLayout from "@/components/shared/Layout";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type NoteType = "NOTE" | "COMMAND" | "CHEAT_SHEET" | "CONCEPT";

interface NoteTag {
  id: string;
  name: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  tags: NoteTag[];
  createdAt: string;
  updatedAt: string;
}

const NOTE_TYPES: NoteType[] = ["NOTE", "COMMAND", "CHEAT_SHEET", "CONCEPT"];

const TYPE_COLORS: Record<NoteType, string> = {
  NOTE: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  COMMAND: "bg-green-500/20 text-green-300 border-green-500/30",
  CHEAT_SHEET: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  CONCEPT: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const TYPE_LABELS: Record<NoteType, string> = {
  NOTE: "Note",
  COMMAND: "Command",
  CHEAT_SHEET: "Cheat Sheet",
  CONCEPT: "Concept",
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "NOTE" as NoteType,
    tags: "",
  });

  const fetchNotes = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      const res = await fetch(
        `/api/notes${params.toString() ? "?" + params.toString() : ""}`
      );
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data: Note[] = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotes();
  }, [fetchNotes]);

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      type: "NOTE",
      tags: "",
    });
    setFormError(null);
    setEditingNote(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (note: Note) => {
    setForm({
      title: note.title,
      content: note.content,
      type: note.type as NoteType,
      tags: note.tags.map((t) => t.name).join(", "),
    });
    setEditingNote(note);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      let res;
      if (editingNote) {
        res = await fetch(`/api/notes/${editingNote.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/notes", {
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
            : data.error || "Failed to save note"
        );
      }

      resetForm();
      void fetchNotes();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      setConfirmDelete(null);
      void fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(q);
    const contentMatch = note.content.toLowerCase().includes(q);
    const tagMatch = note.tags.some((t) =>
      t.name.toLowerCase().includes(q)
    );
    return titleMatch || contentMatch || tagMatch;
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1">
              Store notes, commands, and cheat sheets
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
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

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title, content, or tags..."
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingNote ? "Edit Note" : "Add Note"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive mb-4">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium">
                      Title *
                    </label>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Note title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Type
                    </label>
                    <Select
                      value={form.type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type: e.target.value as NoteType,
                        })
                      }
                    >
                      {NOTE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {TYPE_LABELS[t]}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    placeholder="Note content, commands, explanations..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </label>
                  <Input
                    value={form.tags}
                    onChange={(e) =>
                      setForm({ ...form, tags: e.target.value })
                    }
                    placeholder="e.g. AWS, IAM, Security"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple tags with commas
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit">
                    {editingNote ? "Update Note" : "Create Note"}
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
                <h3 className="text-lg font-semibold">Delete Note?</h3>
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

        {loading && notes.length === 0 ? (
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
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {notes.length === 0
                ? "Get started by adding your first note"
                : "No notes match your search"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="group hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {note.title}
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(note)}
                        className="p-1 rounded hover:bg-accent"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(note.id)}
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
                        TYPE_COLORS[note.type]
                      )}
                    >
                      {TYPE_LABELS[note.type]}
                    </Badge>
                  </div>

                  {note.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {note.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3 mr-1 opacity-50" />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {note.content && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {note.content}
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