import { NextRequest, NextResponse } from "next/server";
import { createGhostPage } from "@/lib/admin-ghost";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (!body.title || !body.html) {
    return NextResponse.json(
      { error: "Thiếu tiêu đề hoặc nội dung" },
      { status: 400 }
    );
  }

  try {
    const data = await createGhostPage({
      title: body.title.trim(),
      html: body.html.trim(),
      excerpt: body.excerpt?.trim() || undefined,
      status: body.status || "draft",
      tags: body.tags || [],
      feature_image: body.feature_image?.trim() || null,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Create Page] Error:", error);
    return NextResponse.json(
      { error: "Failed to create page", details: String(error) },
      { status: 500 }
    );
  }
}
