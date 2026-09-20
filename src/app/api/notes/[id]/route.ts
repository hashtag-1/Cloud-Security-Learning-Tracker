import { auth } from "@/auth";
import { createNoteSchema } from "@/lib/validators";
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
    const note = await prisma.knowledgeNote.findFirst({
      where: { id, userId: session.user.id },
      include: { tags: { include: { tag: true } } },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
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
    const parsed = createNoteSchema.partial().parse(body);

    const existing = await prisma.knowledgeNote.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.title !== undefined) updateData.title = parsed.title;
    if (parsed.content !== undefined) updateData.content = parsed.content;
    if (parsed.type !== undefined) updateData.type = parsed.type;

    if (parsed.tags !== undefined) {
      await prisma.noteTag.deleteMany({
        where: { noteId: id },
      });
      updateData.tags = {
        create: (parsed.tags ?? []).map((tagName: string) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName.trim() },
              create: { name: tagName.trim() },
            },
          },
        })),
      };
    }

    const updated = await prisma.knowledgeNote.update({
      where: { id },
      data: updateData,
      include: { tags: { include: { tag: true } } },
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
    const existing = await prisma.knowledgeNote.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await prisma.knowledgeNote.delete({ where: { id } });

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