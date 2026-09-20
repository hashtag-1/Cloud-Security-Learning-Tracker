import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const phases = await prisma.roadmapPhase.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: {
            microtopics: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    const result = phases.map((phase) => {
      const completedTopics = phase.topics.filter((t) => t.status === "COMPLETED").length;
      const totalTopics = phase.topics.length;
      const completionPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      return {
        id: phase.id,
        order: phase.order,
        title: phase.title,
        objective: phase.objective,
        estimatedWeeks: phase.estimatedWeeks,
        status: "NOT_STARTED",
        completionPct,
        topics: phase.topics.map((topic) => {
          const completedMicros = topic.microtopics.filter((m) => m.status === "COMPLETED").length;
          const totalMicros = topic.microtopics.length;
          const microCompletionPct = totalMicros > 0 ? Math.round((completedMicros / totalMicros) * 100) : 0;
          return {
            id: topic.id,
            order: topic.order,
            title: topic.title,
            objective: topic.objective,
            status: topic.status,
            completionPct: microCompletionPct,
            microtopics: topic.microtopics.map((m) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              depth: m.depth,
              status: m.status,
            })),
          };
        }),
      };
    });

    return NextResponse.json({ phases: result });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}