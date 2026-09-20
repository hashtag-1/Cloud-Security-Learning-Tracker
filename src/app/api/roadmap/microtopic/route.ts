import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { updateMicrotopicStatusSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateMicrotopicStatusSchema.parse(body);

    const microtopic = await prisma.roadmapMicrotopic.findFirst({
      where: { id: body.microtopicId },
      include: { topic: { include: { phase: true } } },
    });

    if (!microtopic) {
      return NextResponse.json({ error: "Microtopic not found" }, { status: 404 });
    }

    const updated = await prisma.roadmapMicrotopic.update({
      where: { id: body.microtopicId },
      data: { status: parsed.status },
    });

    const topicMicros = await prisma.roadmapMicrotopic.findMany({
      where: { topicId: microtopic.topicId },
    });
    const completedMicros = topicMicros.filter((m) => m.status === "COMPLETED").length;
    const topicCompletion = Math.round((completedMicros / topicMicros.length) * 100);

    await prisma.roadmapTopic.update({
      where: { id: microtopic.topicId },
      data: { completionPct: topicCompletion },
    });

    const phaseTopics = await prisma.roadmapTopic.findMany({
      where: { phaseId: microtopic.topic.phaseId },
    });
    const completedTopics = phaseTopics.filter((t) => t.status === "COMPLETED").length;
    const phaseCompletion = Math.round((completedTopics / phaseTopics.length) * 100);

    await prisma.roadmapPhase.update({
      where: { id: microtopic.topic.phaseId },
      data: { completionPct: phaseCompletion },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      const issues = (error as { issues: Array<{ message: string }> }).issues;
      return NextResponse.json({ error: issues }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}