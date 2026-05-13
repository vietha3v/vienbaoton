import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAllAdminPosts, getGhostPostById } from "@/lib/admin-ghost";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const SYSTEM_PROMPT = `Bạn là chuyên gia SEO & Content Strategy cho Viện Bảo tồn Di tích Việt Nam.
Phân tích phải bằng tiếng Việt, ngắn gọn, có đánh số, có thể scan nhanh.
Tập trung vào các yếu tố: meta title, meta description, từ khóa, cấu trúc heading, internal linking, độ dài content, ảnh/thẻ alt, readability.`;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  const clean = text.replace(/[^\w\sÀ-ỹ]/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > 0 ? clean.split(" ").length : 0;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { type = "bulk", postId } = body;

  try {
    if (type === "post" && postId) {
      const data = await getGhostPostById(postId);
      const post = data.posts?.[0];
      if (!post) {
        return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
      }

      const plainText = stripHtml(post.html || "");
      const wordCount = countWords(plainText);

      const userMessage = `Phân tích SEO chi tiết cho bài viết sau:

TIÊU ĐỀ: ${post.title}
META TITLE: ${post.meta_title || "(thiếu)"}
META DESCRIPTION: ${post.meta_description || "(thiếu)"}
OG IMAGE: ${post.og_image || "(thiếu)"}
FEATURE IMAGE: ${post.feature_image || "(thiếu)"}
EXCERPT: ${post.excerpt || "(thiếu)"}
TAGS: ${(post.tags || []).map((t: any) => t.name).join(", ") || "(thiếu)"}
SỐ TỪ: ${wordCount}
THỜI GIAN ĐỌC: ${post.reading_time || 0} phút
TRẠNG THÁI: ${post.status}

NỘI DUNG HTML:
${post.html?.slice(0, 6000) || ""}

Yêu cầu phân tích:
1. Đánh giá tổng quan (điểm /100)
2. Điểm mạnh
3. Điểm yếu cần cải thiện (ưu tiên theo thứ tự quan trọng)
4. Đề xuất meta title/description tối ưu
5. Đề xuất từ khóa chính/phụ
6. Đề xuất internal link
7. Đề xuất alt text cho ảnh
8. Hành động cần làm ngay`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      return NextResponse.json({ result: text });
    }

    // Bulk audit
    const data = await getAllAdminPosts().catch(() => ({ posts: [] }));
    const posts: any[] = data.posts || [];

    const summaries = posts.map((p) => {
      const text = stripHtml(p.html || "");
      return {
        title: p.title,
        slug: p.slug,
        status: p.status,
        wordCount: countWords(text),
        readingTime: p.reading_time || 0,
        tags: (p.tags || []).map((t: any) => t.name),
        hasMetaTitle: !!p.meta_title,
        hasMetaDescription: !!p.meta_description,
        hasFeatureImage: !!p.feature_image,
        hasExcerpt: !!p.excerpt && p.excerpt.trim().length >= 10,
        hasOgImage: !!p.og_image,
        excerpt: p.excerpt?.slice(0, 200) || "",
      };
    });

    const userMessage = `Phân tích SEO tổng quan cho ${summaries.length} bài viết của Viện Bảo tồn Di tích.

DANH SÁCH BÀI VIẾT (tóm tắt):
${summaries.map((s, i) => `${i + 1}. ${s.title} (${s.wordCount} từ, ${s.readingTime} phút đọc, status: ${s.status}) - Tags: ${s.tags.join(", ") || "không có"} - MetaTitle: ${s.hasMetaTitle ? "✓" : "✗"} - MetaDesc: ${s.hasMetaDescription ? "✓" : "✗"} - FeatureImage: ${s.hasFeatureImage ? "✓" : "✗"} - Excerpt: ${s.hasExcerpt ? "✓" : "✗"}`).join("\n")}

Yêu cầu phân tích:
1. Tổng quan tình trạng SEO (điểm số ước tính cho toàn bộ site)
2. Top 5 bài viết cần ưu tiên cải thiện SEO nhất (kèm lý do cụ thể)
3. Content gap: những chủ đề quan trọng về bảo tồn di sản chưa được đề cập hoặc đề cập ít
4. Đề xuất internal linking giữa các bài viết liên quan
5. Từ khóa cơ hội (high-value, low-competition) cho lĩnh vực bảo tồn di sản
6. Lộ trình hành động 30 ngày để cải thiện SEO content`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("[AI SEO Audit] Error:", error);
    return NextResponse.json(
      { error: "AI audit failed", details: String(error) },
      { status: 500 }
    );
  }
}
