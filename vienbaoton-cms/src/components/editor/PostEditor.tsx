"use client";

import { useState } from "react";
import AiWritingPanel from "./AiWritingPanel";

export default function PostEditor() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [html, setHtml] = useState("");
  const [tags, setTags] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Translation state for bilingual workflow
  const [translation, setTranslation] = useState<{
    title: string;
    html: string;
    excerpt: string;
  } | null>(null);
  const [createTranslation, setCreateTranslation] = useState(false);

  function handleInsertHtml(inserted: string) {
    setHtml((prev) => prev + "\n" + inserted);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !html.trim()) {
      setMessage("Vui lòng nhập tiêu đề và nội dung");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          html: html.trim(),
          excerpt: excerpt.trim() || undefined,
          status,
          tags: tagList,
          feature_image: featureImage.trim() || null,
          createTranslation: createTranslation && translation !== null,
          translationTitle: translation?.title,
          translationHtml: translation?.html,
          translationExcerpt: translation?.excerpt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi lưu bài");

      setMessage(
        createTranslation && translation
          ? "✓ Đã tạo bài viết tiếng Việt và tiếng Anh thành công!"
          : "✓ Đã tạo bài viết thành công!"
      );
      setMessageType("success");

      // Reset form
      setTitle("");
      setExcerpt("");
      setHtml("");
      setTags("");
      setFeatureImage("");
      setTranslation(null);
      setCreateTranslation(false);
    } catch (err) {
      setMessage(String(err));
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="section-card mb-0">
          <div className="section-title">Viết bài mới</div>

          {message && (
            <div
              className={`px-4 py-3 rounded-lg mb-4 text-sm ${messageType === "success" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"}`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[0.8125rem] font-medium">Tiêu đề *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                required
                className="p-2.5 rounded-lg border border-[#e2e8f0] text-base font-[inherit]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.8125rem] font-medium">Tóm tắt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                rows={2}
                className="p-2.5 rounded-lg border border-[#e2e8f0] text-[0.9375rem] font-[inherit] resize-y"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.8125rem] font-medium">Thẻ (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="VD: bao-ton, di-tich, hue, unesco"
                className="p-2.5 rounded-lg border border-[#e2e8f0] text-[0.9375rem] font-[inherit]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.8125rem] font-medium">Ảnh đại diện (URL)</label>
              <input
                type="text"
                value={featureImage}
                onChange={(e) => setFeatureImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="p-2.5 rounded-lg border border-[#e2e8f0] text-[0.9375rem] font-[inherit]"
              />
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[0.8125rem] font-medium">Trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className="p-2.5 rounded-lg border border-[#e2e8f0] text-[0.9375rem] font-[inherit]"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Xuất bản</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer pt-5">
                <input
                  type="checkbox"
                  checked={createTranslation}
                  onChange={(e) => setCreateTranslation(e.target.checked)}
                  disabled={!translation}
                />
                <span className={translation ? "text-inherit" : "text-text-secondary"}>
                  Tạo song ngữ (EN)
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[0.8125rem] font-medium">Nội dung (HTML) *</label>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="<p>Nhập nội dung bài viết ở định dạng HTML...</p>"
                rows={20}
                required
                className="p-2.5 rounded-lg border border-[#e2e8f0] text-sm font-['JetBrains_Mono','Fira_Code',monospace] resize-y leading-[1.6]"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setExcerpt("");
                  setHtml("");
                  setTags("");
                  setFeatureImage("");
                  setMessage("");
                  setTranslation(null);
                  setCreateTranslation(false);
                }}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg border border-[#e2e8f0] bg-card text-sm cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2.5 rounded-lg border-0 text-sm font-semibold ${saving ? "bg-slate-300 cursor-not-allowed" : "bg-accent text-white cursor-pointer"}`}
              >
                {saving ? "Đang lưu..." : "Lưu bài viết"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="sticky top-20">
        <AiWritingPanel
          content={html}
          title={title}
          onInsert={handleInsertHtml}
          onSetTranslation={setTranslation}
        />

        {translation && (
          <div className="mt-3 p-3 bg-[#dcfce7] border border-[#86efac] rounded-lg text-[0.8125rem] text-[#166534]">
            <strong>✓ Bản dịch tiếng Anh đã sẵn sàng</strong>
            <p className="mt-1 mb-0">
              Tick &quot;Tạo song ngữ (EN)&quot; và lưu để tạo bài song ngữ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
