import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { studySessionSchema } from "@/lib/schemas";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const studySession = await prisma.studySession.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!studySession) {
      return NextResponse.json(
        { error: "Study session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(studySession);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = studySessionSchema.partial().parse(body);

    const existing = await prisma.studySession.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Study session not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.date !== undefined) updateData.date = parsed.date;
    if (parsed.duration !== undefined) updateData.duration = parsed.duration;
    if (parsed.topicsStudied !== undefined) {
      updateData.topicsStudied = Array.isArray(parsed.topicsStudied)
        ? String(parsed.topicsStudied)
        : parsed.topicsStudied;
    }
    if (parsed.notes !== undefined) {
      updateData.notes = parsed.notes ?? null;
    }
    if (parsed.mood !== undefined) {
      updateData.mood = parsed.mood ?? null;
    }
    if (parsed.productivityRating !== undefined) {
      updateData.productivityRating = parsed.productivityRating
        ? parseInt(parsed.productivityRating)
        : null;
    }

    const updated = await prisma.studySession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      const issues = (error as { issues: Array<{ message: string }> }).issues;
      return NextResponse.json({ error: issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.studySession.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Study session not found" },
        { status: 404 }
      );
    }

    await prisma.studySession.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
