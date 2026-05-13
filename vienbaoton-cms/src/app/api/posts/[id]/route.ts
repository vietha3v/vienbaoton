import { NextRequest, NextResponse } from "next/server";
import { updateGhostPost, deleteGhostPost, getGhostPostById } from "@/lib/admin-ghost";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await getGhostPostById(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Get Post] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const data = await updateGhostPost(id, {
      title: body.title,
      html: body.html,
      excerpt: body.excerpt,
      status: body.status,
      tags: body.tags,
      feature_image: body.feature_image,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Update Post] Error:", error);
    return NextResponse.json(
      { error: "Failed to update post", details: String(error) },
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
    await deleteGhostPost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Post] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete post", details: String(error) },
      { status: 500 }
    );
  }
}
