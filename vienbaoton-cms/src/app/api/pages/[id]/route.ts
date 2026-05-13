import { NextRequest, NextResponse } from "next/server";
import { updateGhostPage, deleteGhostPage, getGhostPageById } from "@/lib/admin-ghost";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await getGhostPageById(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Get Page] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch page", details: String(error) },
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
    const data = await updateGhostPage(id, {
      title: body.title,
      html: body.html,
      excerpt: body.excerpt,
      status: body.status,
      tags: body.tags,
      feature_image: body.feature_image,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Update Page] Error:", error);
    return NextResponse.json(
      { error: "Failed to update page", details: String(error) },
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
    await deleteGhostPage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Page] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete page", details: String(error) },
      { status: 500 }
    );
  }
}
