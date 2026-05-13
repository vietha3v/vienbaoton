import { NextRequest, NextResponse } from "next/server";
import { createGhostAuthor } from "@/lib/admin-ghost";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (!body.name) {
    return NextResponse.json(
      { error: "Thiếu tên tác giả" },
      { status: 400 }
    );
  }

  try {
    const data = await createGhostAuthor({
      name: body.name.trim(),
      slug: body.slug?.trim() || undefined,
      email: body.email?.trim() || undefined,
      bio: body.bio?.trim() || undefined,
      website: body.website?.trim() || undefined,
      location: body.location?.trim() || undefined,
      meta_title: body.meta_title?.trim() || undefined,
      meta_description: body.meta_description?.trim() || undefined,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Create Author] Error:", error);
    return NextResponse.json(
      { error: "Failed to create author", details: String(error) },
      { status: 500 }
    );
  }
}
