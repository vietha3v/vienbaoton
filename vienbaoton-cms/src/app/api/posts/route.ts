import { NextRequest, NextResponse } from "next/server";
import { createGhostPost } from "@/lib/admin-ghost";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const {
    title,
    html,
    excerpt,
    status = "draft",
    tags = [],
    feature_image = null,
    createTranslation = false,
  } = body;

  if (!title || !html) {
    return NextResponse.json(
      { error: "Thiếu tiêu đề hoặc nội dung" },
      { status: 400 }
    );
  }

  try {
    // Create Vietnamese post
    const viResult = await createGhostPost({
      title,
      html,
      excerpt,
      status,
      tags,
      feature_image,
    });

    let enResult = null;

    // If translation requested, create English version with lang-en tag
    if (createTranslation && body.translationHtml) {
      enResult = await createGhostPost({
        title: body.translationTitle || `${title} (EN)`,
        html: body.translationHtml,
        excerpt: body.translationExcerpt,
        status,
        tags: [...tags, "lang-en"],
        feature_image,
      });
    }

    return NextResponse.json({
      success: true,
      vi: viResult,
      en: enResult,
    });
  } catch (error) {
    console.error("[Create Post] Error:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: String(error) },
      { status: 500 }
    );
  }
}
