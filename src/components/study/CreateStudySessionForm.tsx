"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { studySessionSchema } from "@/lib/schemas";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface CreateStudySessionFormProps {
  onSuccess?: () => void;
}

export function CreateStudySessionForm({ onSuccess }: CreateStudySessionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      date: formData.get("date") as string,
      duration: parseInt(formData.get("duration") as string),
      topicsStudied: formData.get("topicsStudied") as string,
      notes: (formData.get("notes") as string) || "",
      mood: (formData.get("mood") as string) || null,
      productivityRating: formData.get("productivityRating")
        ? parseInt(formData.get("productivityRating") as string)
        : null,
    };

    const parsed = studySessionSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        toast.success("Study session recorded");
        onSuccess?.();
        router.refresh();
      } else {
        toast.error("Failed to save session");
      }
    } catch {
      toast.error("Failed to save session");
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Study Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" name="date" required />
            </div>
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input type="number" name="duration" min={1} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topics Studied</Label>
            <Input
              name="topicsStudied"
              required
              placeholder="e.g., TCP/IP, DNS"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select name="mood">
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOCUSED">Focused</SelectItem>
                  <SelectItem value="OK">OK</SelectItem>
                  <SelectItem value="TIRED">Tired</SelectItem>
                  <SelectItem value="DISTRACTED">Distracted</SelectItem>
                  <SelectItem value="ENTHUSIASTIC">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Productivity (1-5)</Label>
              <Select name="productivityRating">
                <SelectTrigger>
                  <SelectValue placeholder="Rate productivity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              name="notes"
              placeholder="What did you cover?"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
