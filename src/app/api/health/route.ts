import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const userCount = await prisma.user.count();
    const phaseCount = await prisma.roadmapPhase.count();
    const topicCount = await prisma.roadmapTopic.count();
    const microtopicCount = await prisma.roadmapMicrotopic.count();

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        users: userCount,
        roadmapPhases: phaseCount,
        roadmapTopics: topicCount,
        roadmapMicrotopics: microtopicCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}