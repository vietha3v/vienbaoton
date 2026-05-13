import { NextRequest, NextResponse } from "next/server";
import { createGhostTag } from "@/lib/admin-ghost";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (!body.name) {
    return NextResponse.json(
      { error: "Thiếu tên thẻ" },
      { status: 400 }
    );
  }

  try {
    const data = await createGhostTag({
      name: body.name.trim(),
      slug: body.slug?.trim() || undefined,
      description: body.description?.trim() || undefined,
      visibility: body.visibility || "public",
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Create Tag] Error:", error);
    return NextResponse.json(
      { error: "Failed to create tag", details: String(error) },
      { status: 500 }
    );
  }
}
