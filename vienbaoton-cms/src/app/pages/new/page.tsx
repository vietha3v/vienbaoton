"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AiWritingPanel from "@/components/editor/AiWritingPanel";

export default function NewPagePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [html, setHtml] = useState("");
  const [tags, setTags] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !html.trim()) {
      setMessage("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          html: html.trim(),
          excerpt: excerpt.trim() || undefined,
          status,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          feature_image: featureImage.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Tạo thất bại");
      setMessage("✓ Đã tạo trang thành công!");
      setTitle("");
      setExcerpt("");
      setHtml("");
      setTags("");
      setFeatureImage("");
      router.refresh();
    } catch (err) {
      setMessage(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <form onSubmit={handleSubmit}>
        <div className="section-card mb-0">
          <div className="section-title">Tạo trang mới</div>

          {message && (
            <div
              className={`px-4 py-3 rounded-lg mb-4 text-sm ${message.startsWith("✓") ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"}`}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề trang"
              required
              className="p-2.5 rounded-lg border border-border text-base font-[inherit]"
            />

            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Tóm tắt"
              rows={2}
              className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit] resize-y"
            />

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Thẻ (phân cách bằng dấu phẩy)"
              className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
            />

            <input
              type="text"
              value={featureImage}
              onChange={(e) => setFeatureImage(e.target.value)}
              placeholder="URL ảnh đại diện"
              className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>

            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Nội dung HTML"
              rows={20}
              required
              className="p-2.5 rounded-lg border border-border text-sm font-['JetBrains_Mono','Fira_Code',monospace] resize-y leading-[1.6]"
            />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => router.push("/pages")}
                className="px-5 py-2.5 rounded-lg border border-border bg-card text-sm cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2.5 rounded-lg border-none text-sm font-semibold text-white cursor-pointer ${saving ? "bg-[#cbd5e1] cursor-not-allowed" : "bg-accent"}`}
              >
                {saving ? "Đang lưu..." : "Tạo trang"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="sticky top-20">
        <AiWritingPanel
          content={html}
          title={title}
          onInsert={(inserted) => setHtml((prev) => prev + "\n" + inserted)}
          onSetTranslation={() => {}}
        />
      </div>
    </div>
  );
}
