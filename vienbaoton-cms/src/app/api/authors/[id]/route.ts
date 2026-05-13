import { NextRequest, NextResponse } from "next/server";
import { updateGhostAuthor, deleteGhostAuthor } from "@/lib/admin-ghost";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const data = await updateGhostAuthor(id, {
      name: body.name,
      slug: body.slug,
      email: body.email,
      bio: body.bio,
      website: body.website,
      location: body.location,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Update Author] Error:", error);
    return NextResponse.json(
      { error: "Failed to update author", details: String(error) },
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
    await deleteGhostAuthor(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Author] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete author", details: String(error) },
      { status: 500 }
    );
  }
}
