import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { studySessionSchema } from "@/lib/schemas";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await prisma.studySession.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = totalMinutes / 60;

    const phases = await prisma.roadmapPhase.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    });

    let currentPhase = "Not Started";
    for (const phase of phases) {
      const topics = await prisma.roadmapTopic.findMany({
        where: { phaseId: phase.id },
      });
      if (!topics.every((t) => t.status === "COMPLETED")) {
        currentPhase = phase.title;
        break;
      }
    }

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const daySessions = sessions.filter(
        (s) => s.date.toDateString() === date.toDateString()
      );
      weeklyData.push({
        date: date.toISOString(),
        hours: Number(
          (daySessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1)
        ),
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }

    const phaseProgress = phases.map((phase) => ({
      phaseTitle: phase.title,
      completionPercentage: phase.completionPct,
    }));

    const streak = (() => {
      if (sessions.length === 0) return 0;
      const dates = new Set(sessions.map((s) => s.date.toDateString()));
      let s = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        if (dates.has(date.toDateString())) s++;
        else if (i > 0) break;
      }
      return s;
    })();

    const weekSessions = sessions.filter(
      (s) => s.date >= new Date(new Date().setDate(new Date().getDate() - new Date().getDay()))
    );
    const monthSessions = sessions.filter(
      (s) => s.date >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    return NextResponse.json({
      stats: {
        totalStudyHours: Math.round(totalHours),
        currentStreak: streak,
        currentPhase,
        roadmapCompletion:
          phases.length > 0
            ? phases.reduce((sum, p) => sum + p.completionPct, 0) / phases.length
            : 0,
        labsCompleted: await prisma.lab.count({
          where: { userId: session.user.id, status: "COMPLETED" },
        }),
        projectsCompleted: await prisma.project.count({
          where: { userId: session.user.id, status: "COMPLETED" },
        }),
        weeklyHours: Math.round(
          weekSessions.reduce((sum, s) => sum + s.duration, 0) / 60
        ),
        monthlyHours: Math.round(
          monthSessions.reduce((sum, s) => sum + s.duration, 0) / 60
        ),
        totalSessions: sessions.length,
      },
      weeklyData,
      phaseProgress,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = studySessionSchema.parse(body);

    const created = await prisma.studySession.create({
      data: {
        date: parsed.date,
        duration: parsed.duration,
        topicsStudied: Array.isArray(parsed.topicsStudied) ? String(parsed.topicsStudied) : parsed.topicsStudied,
        notes: parsed.notes ?? null,
        mood: parsed.mood ?? null,
        productivityRating: parsed.productivityRating ? parseInt(parsed.productivityRating) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: (error as any).issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}