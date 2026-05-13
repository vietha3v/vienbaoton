import { NextRequest, NextResponse } from "next/server";
import { updateGhostTag, deleteGhostTag } from "@/lib/admin-ghost";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const data = await updateGhostTag(id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      visibility: body.visibility,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Update Tag] Error:", error);
    return NextResponse.json(
      { error: "Failed to update tag", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteGhostTag(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Tag] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete tag", details: String(error) },
      { status: 500 }
    );
  }
}
