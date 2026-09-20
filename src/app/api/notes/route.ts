import { auth } from "@/auth";
import { createNoteSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const notes = await prisma.knowledgeNote.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { tags: { some: { tag: { name: { contains: search, mode: "insensitive" } } } } },
          ],
        }),
      },
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
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
    const parsed = createNoteSchema.parse(body);

    const created = await prisma.knowledgeNote.create({
      data: {
        title: parsed.title,
        content: parsed.content,
        type: parsed.type,
        userId: session.user.id,
        tags: {
          create: (parsed.tags ?? []).map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.trim() },
                create: { name: tagName.trim() },
              },
            },
          })),
        },
      },
      include: { tags: { include: { tag: true } } },
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