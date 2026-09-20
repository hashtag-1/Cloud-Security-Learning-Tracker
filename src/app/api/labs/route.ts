import { auth } from "@/auth";
import { createLabSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const labs = await prisma.lab.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as string }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(labs);
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
    const parsed = createLabSchema.parse(body);

    const created = await prisma.lab.create({
      data: {
        name: parsed.name,
        category: parsed.category,
        difficulty: parsed.difficulty,
        status: parsed.status,
        notes: parsed.notes ?? null,
        skillsLearned: parsed.skillsLearned ?? [],
        userId: session.user.id,
      },
    });

    return NextResponse.json(created, { status: 201 });
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