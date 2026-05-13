import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAllAdminPosts, getAllAdminPages } from "@/lib/admin-ghost";
import { getTags } from "@/lib/ghost";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const SYSTEM_PROMPT = `Bạn là chuyên gia SEO & Content Strategy cấp cao cho lĩnh vực bảo tồn di sản văn hóa ở Việt Nam.
Phân tích phải bằng tiếng Việt, chi tiết, có cấu trúc rõ ràng, dùng được ngay.
Tập trung vào: keyword research, content gap, competitive analysis, content calendar, SEO reform.`;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  const clean = text.replace(/[^\w\sÀ-ỹ]/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > 0 ? clean.split(" ").length : 0;
}

async function fetchGoogleSearch(query: string): Promise<any[]> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
  if (!apiKey || !cx) return [];

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5&lr=lang_vi&gl=vn`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }));
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { type = "keyword_research", keyword, targetUrl } = body;
  const customPrompt = body.prompt || "";

  try {
    const [postsData, pagesData, tagsData] = await Promise.all([
      getAllAdminPosts().catch(() => ({ posts: [] })),
      getAllAdminPages().catch(() => ({ pages: [] })),
      getTags().catch(() => []),
    ]);

    const posts: any[] = postsData.posts || [];
    const pages: any[] = pagesData.pages || [];
    const tags: any[] = tagsData;

    // Build content summary for AI context
    const contentSummary = posts.map((p) => {
      const text = stripHtml(p.html || "");
      return {
        title: p.title,
        slug: p.slug,
        status: p.status,
        wordCount: countWords(text),
        tags: (p.tags || []).map((t: any) => t.name),
        hasMetaTitle: !!p.meta_title,
        hasMetaDescription: !!p.meta_description,
        publishedAt: p.published_at,
      };
    });

    const tagNames = tags.map((t) => t.name);
    const existingTitles = posts.map((p) => p.title);

    let userMessage = "";
    let searchResults: any[] = [];

    switch (type) {
      case "keyword_research": {
        // Try real Google search if key available
        if (keyword) {
          searchResults = await fetchGoogleSearch(
            `${keyword} bảo tồn di sản`
          );
        }

        userMessage = `Nghiên cứu từ khóa SEO cho lĩnh vực bảo tồn di sản văn hóa Việt Nam.

DANH SÁCH CONTENT HIỆN CÓ (${contentSummary.length} bài):
${contentSummary.map((s, i) => `${i + 1}. ${s.title} (${s.wordCount} từ, tags: ${s.tags.join(", ") || "không có"})`).join("\n")}

THẺ HIỆN CÓ: ${tagNames.join(", ") || "chưa có"}

${searchResults.length > 0 ? `KẾT QUẢ TÌM KIẾM GOOGLE CHO "${keyword} bảo tồn di sản":\n${searchResults.map((r, i) => `${i + 1}. ${r.title}\n   ${r.displayLink}\n   ${r.snippet}`).join("\n")}` : ""}

YÊU CẦU NGHIÊN CỨU TỪ KHÓA:
1. Từ khóa ngắn hạn (short-tail): 5-10 từ khóa chính về bảo tồn di sản (volume cao, độ cạnh tranh cao)
2. Từ khóa dài (long-tail): 10-15 từ khóa dài cụ thể (volume thấp-hơn, intent rõ ràng, dễ SEO hơn)
3. Từ khóa câu hỏi (question keywords): 5-7 câu hỏi người dùng thường tìm kiếm
4. Từ khóa địa phương: 5 từ khóa kết hợp địa danh di sản nổi tiếng Việt Nam
5. Phân loại theo search intent (Informational, Navigational, Transactional)
6. Đánh giá độ khó (1-10) và cơ hội xếp hạng
7. Từ khóa nào đã được site đề cập (covered) và từ khóa nào chưa (opportunity)

Định dạng: Bảng markdown rõ ràng, có thể copy-paste.`;
        break;
      }

      case "competitor_analysis": {
        if (keyword) {
          searchResults = await fetchGoogleSearch(keyword);
        }

        userMessage = `Phân tích đối thủ cạnh tranh trong lĩnh vực bảo tồn di sản văn hóa.

DANH SÁCH CONTENT CỦA CHÚNG TA:
${existingTitles.slice(0, 20).map((t, i) => `${i + 1}. ${t}`).join("\n")}

${searchResults.length > 0 ? `KẾT QUẢ GOOGLE TOP 5:\n${searchResults.map((r, i) => `${i + 1}. ${r.title}\n   ${r.displayLink}\n   ${r.snippet}`).join("\n")}` : "Lưu ý: Chưa có Google Search API key nên chưa thể lấy dữ liệu SERP thực tế. Vui lòng cấu hình GOOGLE_CUSTOM_SEARCH_API_KEY để có phân tích chính xác hơn."}

YÊU CẦU PHÂN TÍCH:
1. Xác định 5 đối thủ hàng đầu trong lĩnh vực bảo tồn di sản tại Việt Nam
2. Phân tích điểm mạnh/yếu của từng đối thủ (content, backlink, UX)
3. So sánh với nội dung hiện tại của chúng ta
4. Cơ hội vượt mặt đối thủ trên từng chủ đề
5. Chiến lược content differentiation
6. Đề xuất pillar content và topic clusters`;
        break;
      }

      case "content_gap": {
        userMessage = `Phân tích Content Gap cho Viện Bảo tồn Di tích.

CONTENT HIỆN CÓ (${contentSummary.length} bài):
${contentSummary.map((s, i) => `${i + 1}. ${s.title} (${s.tags.join(", ") || "không có tag"})`).join("\n")}

THẺ HIỆN CÓ: ${tagNames.join(", ")}

YÊU CẦU:
1. Danh sách 10-15 chủ đề quan trọng về bảo tồn di sản mà site CHƯA có bài viết
2. Mỗi chủ đề kèm: từ khóa chính, search intent, đề xuất độ dài, độ khó
3. Chủ đề nào là low-hanging fruit (dễ viết, dễ SEO, ít đối thủ)
4. Chủ đề nào là pillar content (nội dung trụ cột, cần đầu tư lớn)
5. Đề xuất cluster content cho từng pillar
6. Lộ trình ưu tiên viết bài theo thứ tự ROI cao nhất`;
        break;
      }

      case "content_strategy": {
        const timeframe = body.timeframe || "30";
        userMessage = `Lập kế hoạch truyền thông ${timeframe} ngày cho Viện Bảo tồn Di tích.

CONTENT HIỆN CÓ: ${contentSummary.length} bài
THẺ HIỆN CÓ: ${tagNames.join(", ")}
BÀI ĐÃ XUẤT BẢN: ${posts.filter((p) => p.status === "published").length}
BẢN NHÁP: ${posts.filter((p) => p.status !== "published").length}

YÊU CẦU KẾ HOẠCH ${timeframe} NGÀY:
1. Mục tiêu SMART (cụ thể, đo lường được)
2. Phân bổ số bài viết theo tuần
3. Chủ đề từng bài (kèm từ khóa chính)
4. Phân loại nội dung: Evergreen vs Trending vs Seasonal
5. Kênh phân phối: Website, Facebook, LinkedIn, Newsletter
6. Kế hoạch nội bộ: ai viết, ai review, deadline
7. KPIs để đo lường hiệu quả
8. Ngân sách và nguồn lực (nếu cần)

Định dạng: Lịch markdown theo tuần, dễ theo dõi.`;
        break;
      }

      case "seo_reform_plan": {
        const totalContent = posts.length + pages.length;
        const missingMeta = posts.filter((p) => !p.meta_title || !p.meta_description).length;
        const missingImage = posts.filter((p) => !p.feature_image).length;
        const missingExcerpt = posts.filter((p) => !p.excerpt).length;

        userMessage = `Lập kế hoạch cải tổ SEO toàn diện cho Viện Bảo tồn Di tích.

SỐ LIỆU HIỆN TẠI:
- Tổng content: ${totalContent} (posts: ${posts.length}, pages: ${pages.length})
- Thiếu Meta Title/Description: ${missingMeta}/${posts.length}
- Thiếu Feature Image: ${missingImage}/${posts.length}
- Thiếu Excerpt: ${missingExcerpt}/${posts.length}
- Thẻ hiện có: ${tags.length}

CONTENT HIỆN CÓ:
${contentSummary.slice(0, 15).map((s, i) => `${i + 1}. ${s.title} (${s.wordCount} từ, meta: ${s.hasMetaTitle ? "✓" : "✗"}T/${s.hasMetaDescription ? "✓" : "✗"}D)`).join("\n")}

YÊU CẦU KẾ HOẠCH CẢI TỔ:
1. Đánh giá tổng quan (điểm SEO hiện tại /100)
2. 5 vấn đề nghiêm trọng nhất cần giải quyết ngay
3. Giai đoạn 1 (Tuần 1-2): Quick wins - những thay đổi dễ, impact cao
4. Giai đoạn 2 (Tuần 3-4): Meta optimization - viết lại meta title/description cho toàn bộ
5. Giai đoạn 3 (Tháng 2): Content refresh - cập nhật bài cũ, thêm ảnh, excerpt
6. Giai đoạn 4 (Tháng 3): Content expansion - viết bài mới theo content gap
7. Giai đoạn 5 (Tháng 4-6): Link building & authority
8. Công cụ cần dùng (miễn phí & trả phí)
9. Tracking metrics và báo cáo định kỳ
10. Expected ROI sau 3 tháng, 6 tháng

Định dạng: Bảng timeline chi tiết.`;
        break;
      }

      case "serp_check": {
        if (!keyword) {
          return NextResponse.json(
            { error: "Vui lòng nhập từ khóa để kiểm tra SERP" },
            { status: 400 }
          );
        }
        searchResults = await fetchGoogleSearch(keyword);

        if (searchResults.length === 0) {
          return NextResponse.json({
            result: "Chưa có kết quả Google Search. Vui lòng cấu hình GOOGLE_CUSTOM_SEARCH_API_KEY và GOOGLE_CUSTOM_SEARCH_ENGINE_ID trong .env.local để tra cứu SERP thực tế.",
            type,
            keyword,
            searchResults: [],
          });
        }

        userMessage = `Phân tích SERP (Search Engine Results Page) cho từ khóa: "${keyword}"

KẾT QUẢ GOOGLE TOP ${searchResults.length}:
${searchResults.map((r, i) => `${i + 1}. ${r.title}\n   URL: ${r.link}\n   Snippet: ${r.snippet}\n   Domain: ${r.displayLink}`).join("\n\n")}

${targetUrl ? `URL CỦA CHÚNG TA: ${targetUrl}\nNếu có xuất hiện trong kết quả, đánh giá vị trí.` : ""}

YÊU CẦU PHÂN TÍCH SERP:
1. Đánh giá search intent của từ khóa (Informational/Navigational/Transactional)
2. Phân tích content type đang xếp hạng (blog, video, product, news, etc.)
3. Phân tích featured snippets cơ hội
4. Độ khó ước tính dựa trên domain authority của top 5
5. Đề xuất content format để cạnh tranh
6. Số từ trung bình của top 3
7. Cơ hội xếp hạng của chúng ta (nếu có)`;
        break;
      }

      default:
        userMessage = customPrompt || "Phân tích SEO cho Viện Bảo tồn Di tích";
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const result =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      result,
      type,
      keyword: keyword || null,
      searchResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI SEO Research] Error:", error);
    return NextResponse.json(
      { error: "AI research failed", details: String(error) },
      { status: 500 }
    );
  }
}
