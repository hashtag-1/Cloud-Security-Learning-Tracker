import { auth } from "@/auth";
import { createLabSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
    const lab = await prisma.lab.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json(lab);
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
    const parsed = createLabSchema.partial().parse(body);

    const existing = await prisma.lab.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    const updated = await prisma.lab.update({
      where: { id },
      data: {
        ...(parsed.name !== undefined && { name: parsed.name }),
        ...(parsed.category !== undefined && { category: parsed.category }),
        ...(parsed.difficulty !== undefined && { difficulty: parsed.difficulty }),
        ...(parsed.status !== undefined && { status: parsed.status }),
        ...(parsed.notes !== undefined && { notes: parsed.notes ?? null }),
        ...(parsed.skillsLearned !== undefined && {
          skillsLearned: parsed.skillsLearned,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      const issues = (error as { issues: Array<{ message: string }> }).issues;
      return NextResponse.json(
        { error: issues },
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
    const existing = await prisma.lab.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    await prisma.lab.delete({ where: { id } });

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