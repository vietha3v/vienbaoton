import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const SYSTEM_PROMPT = `Bạn là trợ lý biên tập nội dung chuyên nghiệp cho Viện Bảo tồn Di tích Việt Nam.

Quy tắc viết bài:
- Phong cách học thuật, trang trọng nhưng dễ đọc
- Sử dụng thuật ngữ bảo tồn di sản chính xác
- Cấu trúc rõ ràng: mở bài → thân bài → kết luận
- Độ dài phù hợp 800-1500 từ cho bài thông thường
- HTML format hợp lệ: sử dụng thẻ <p>, <h2>, <h3>, <ul>, <li>, <strong>, <em>
- Không dùng markdown, chỉ trả về HTML thuần
- Tiếng Việt: chuẩn hóa, dùng từ Hán Việt phù hợp (bảo tồn, di tích, tu bổ, phục hồi)
- Tiếng Anh: dùng thuật ngữ UNESCO/ICOMOS chuẩn (conservation, restoration, heritage site, authenticity, integrity)

Nếu được yêu cầu dịch: giữ nguyên ý nghĩa chuyên môn, không dịch sát nghĩa gây mất chất học thuật.`;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const {
    action = "generate",
    prompt = "",
    keywords = "",
    style = "academic",
    content = "",
    targetLang = "vi",
  } = body;

  if (!prompt && !keywords && !content) {
    return NextResponse.json(
      { error: "Thiếu prompt, keywords hoặc content" },
      { status: 400 }
    );
  }

  let userMessage = "";

  switch (action) {
    case "generate": {
      const styleMap: Record<string, string> = {
        academic: "học thuật, trang trọng, dẫn chứng khoa học",
        modern: "hiện đại, gần gũi, dùng ngôn ngữ thời đại mới nhưng vẫn giữ tính chuyên môn",
        storytelling: "kể chuyện, cuốn hút, đan xen dữ liệu lịch sử và cảm xúc",
        news: "báo chí, ngắn gọn, súc tích, nêu rõ 5W1H",
        social: "mạng xã hội, catchy headline, emoji phù hợp, chia đoạn ngắn",
      };
      const styleDesc = styleMap[style] || styleMap.academic;
      userMessage = `Viết một bài viết về chủ đề: "${prompt || keywords}".
Yêu cầu:
- Phong cách: ${styleDesc}
- Ngôn ngữ: ${targetLang === "en" ? "Tiếng Anh" : "Tiếng Việt"}
- Định dạng: HTML thuần (thẻ <p>, <h2>, <h3>, <ul>, <li>, <strong>)
- Tựa đề bài viết nằm trong thẻ <h2> đầu tiên
- Không dùng markdown
Từ khóa cần lồng ghép tự nhiên: ${keywords || prompt}`;
      break;
    }

    case "translate":
      userMessage = `Dịch đoạn văn sau sang ${targetLang === "en" ? "tiếng Anh" : "tiếng Việt"}:
"""
${content}
"""
Yêu cầu:
- Giữ nguyên cấu trúc HTML (nếu có)
- Giữ nguyên ý nghĩa chuyên môn và thuật ngữ bảo tồn di sản
- Phong cách học thuật, trang trọng
- Chỉ trả về nội dung đã dịch, không thêm giải thích`;
      break;

    case "rephrase":
      userMessage = `Viết lại đoạn văn sau theo phong cách ${style === "academic" ? "học thuật" : style === "modern" ? "hiện đại" : style === "storytelling" ? "kể chuyện" : style === "news" ? "báo chí" : "mạng xã hội"}:
"""
${content}
"""
Yêu cầu: Giữ nguyên cấu trúc HTML, giữ nguyên ý chính, chỉ trả về nội dung đã viết lại.`;
      break;

    case "keywords":
      userMessage = `Từ đoạn văn sau, trích xuất 5-10 từ khóa/từ khóa dài (long-tail keywords) phù hợp cho SEO và phân loại bài viết về bảo tồn di sản:
"""
${content}
"""
Trả về dạng JSON array: ["keyword1", "keyword2", ...]`;
      break;

    case "title":
      userMessage = `Từ nội dung sau, đề xuất 3-5 tiêu đề hấp dẫn, phù hợp với phong cách Viện Bảo tồn Di tích:
"""
${content}
"""
Yêu cầu:
- Ngôn ngữ: ${targetLang === "en" ? "Tiếng Anh" : "Tiếng Việt"}
- Trả về dạng JSON array: ["Tiêu đề 1", "Tiêu đề 2", ...]`;
      break;

    case "review":
      userMessage = `Hãy đánh giá và đề xuất cải thiện cho đoạn văn sau. Kiểm tra:
1. Chính tả, ngữ pháp tiếng Việt
2. Cấu trúc câu, luận điểm
3. Thuật ngữ chuyên ngành bảo tồn di sản
4. Tính logic, mạch lạc
5. Đề xuất cải thiện cụ thể từng đoạn

"""
${content}
"""

Trả về kết quả theo cấu trúc:
- Tổng đánh giá: [tóm tắt]
- Lỗi phát hiện: [danh sách]
- Đề xuất cải thiện: [danh sách]`;
      break;

    case "seo":
      userMessage = `Phân tích và tối ưu hóa SEO cho nội dung sau. Đề xuất:
1. Tiêu đề H1/H2 tối ưu
2. Từ khóa chính/phụ nên sử dụng
3. Mật độ từ khóa hiện tại
4. Đề xuất internal link
5. Đề xuất alt text cho ảnh
6. Meta description tối ưu

"""
${content}
"""

Trả về phân tích chi tiết.`;
      break;

    case "summary":
      userMessage = `Tóm tắt nội dung sau thành đoạn excerpt ngắn gọn (150-200 từ), giữ nguyên ý chính và giá trị thông tin:
"""
${content}
"""
Chỉ trả về đoạn tóm tắt, không thêm giải thích.`;
      break;

    case "alt_text":
      userMessage = `Từ nội dung bài viết sau, đề xuất alt text (mô tả ảnh) cho các hình ảnh có thể sử dụng trong bài. Mỗi alt text ngắn gọn (10-15 từ), mô tả chính xác nội dung hình ảnh và có từ khóa SEO:
"""
${content}
"""
Trả về dạng danh sách: ["Alt text 1", "Alt text 2", ...]`;
      break;

    case "auto_tags":
      userMessage = `Từ nội dung sau, đề xuất 5-8 thẻ (tags) phù hợp nhất cho bài viết về bảo tồn di sản. Các thẻ phải là slug-friendly (không dấu, nối bằng dấu gạch ngang):
"""
${content}
"""
Trả về dạng JSON array: ["tag-1", "tag-2", ...]`;
      break;

    case "readability":
      userMessage = `Phân tích độ dễ đọc (readability) của đoạn văn sau theo tiêu chuẩn tiếng Việt:
"""
${content}
"""
Đánh giá:
1. Độ dài câu trung bình
2. Tỷ lệ từ Hán Việt vs từ thuần Việt
3. Cấu trúc đoạn văn
4. Điểm readability ước tính (1-10)
5. Đề xuất cải thiện độ dễ đọc
Trả về phân tích chi tiết.`;
      break;

    case "meta_desc":
      userMessage = `Từ nội dung sau, viết meta description tối ưu SEO (150-160 ký tự, chứa từ khóa chính, hấp dẫn người đọc click):
"""
${content}
"""
Chỉ trả về 1 đoạn meta description duy nhất.`;
      break;

    case "social":
      userMessage = `Từ nội dung sau, tạo 3 bài đăng mạng xã hội (Facebook, LinkedIn, Twitter/X) với phong cách phù hợp từng nền tảng. Mỗi bài kèm hashtag phù hợp:
"""
${content}
"""
Trả về theo cấu trúc:
Facebook: [nội dung]
LinkedIn: [nội dung]
Twitter: [nội dung]`;
      break;

    case "expand":
      userMessage = `Mở rộng nội dung sau, thêm chi tiết, ví dụ cụ thể, dẫn chứng lịch sử và phân tích sâu hơn. Giữ nguyên phong cách học thuật:
"""
${content}
"""
Yêu cầu: Độ dài tăng ít nhất 50%, thêm ít nhất 2 đoạn phân tích mới.`;
      break;

    case "condense":
      userMessage = `Rút gọn nội dung sau, giữ lại ý chính quan trọng nhất, loại bỏ chi tiết dư thừa. Phù hợp cho bài viết ngắn/tin tức:
"""
${content}
"""
Yêu cầu: Giữ nguyên cấu trúc HTML, rút gọn khoảng 30-40% độ dài.`;
      break;

    default:
      userMessage = prompt;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      result: text,
      action,
      targetLang,
    });
  } catch (error) {
    console.error("[AI Generate] Error:", error);
    return NextResponse.json(
      { error: "AI generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
