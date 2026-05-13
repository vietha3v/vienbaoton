"use client";

import { useState } from "react";

interface AiPanelProps {
  content: string;
  title: string;
  onInsert: (html: string) => void;
  onSetTranslation: (en: { title: string; html: string; excerpt: string }) => void;
}

type TabKey = "write" | "edit" | "seo" | "meta";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "write", label: "Viết bài", icon: "✍️" },
  { key: "edit", label: "Biên tập", icon: "📝" },
  { key: "seo", label: "SEO", icon: "🔍" },
  { key: "meta", label: "Meta/Social", icon: "📢" },
];

const writeActions = [
  { value: "generate", label: "Viết bài từ từ khóa" },
  { value: "translate", label: "Dịch sang Anh" },
  { value: "rephrase", label: "Viết lại (rephrase)" },
  { value: "expand", label: "Mở rộng nội dung" },
  { value: "condense", label: "Rút gọn nội dung" },
];

const editActions = [
  { value: "review", label: "Kiểm tra & Đánh giá" },
  { value: "readability", label: "Phân tích độ dễ đọc" },
  { value: "keywords", label: "Trích từ khóa SEO" },
  { value: "auto_tags", label: "Gợi ý thẻ tự động" },
];

const seoActions = [
  { value: "seo", label: "Phân tích SEO toàn diện" },
  { value: "title", label: "Gợi ý tiêu đề" },
  { value: "alt_text", label: "Gợi ý Alt Text ảnh" },
];

const metaActions = [
  { value: "summary", label: "Tạo tóm tắt (Excerpt)" },
  { value: "meta_desc", label: "Viết Meta Description" },
  { value: "social", label: "Tạo bài đăng mạng xã hội" },
];

const styles = [
  { value: "academic", label: "Học thuật" },
  { value: "modern", label: "Hiện đại" },
  { value: "storytelling", label: "Kể chuyện" },
  { value: "news", label: "Báo chí" },
  { value: "social", label: "Mạng xã hội" },
];

const actionGroups: Record<TabKey, Array<{ value: string; label: string }>> = {
  write: writeActions,
  edit: editActions,
  seo: seoActions,
  meta: metaActions,
};

const needsStyle = (action: string) =>
  ["generate", "rephrase", "expand", "condense"].includes(action);

const needsPrompt = (action: string) => action === "generate";

const isInsertable = (action: string) =>
  ["generate", "rephrase", "expand", "condense", "translate"].includes(action);

const isJsonOutput = (action: string) =>
  ["keywords", "auto_tags", "title"].includes(action);

export default function AiWritingPanel({
  content,
  title,
  onInsert,
  onSetTranslation,
}: AiPanelProps) {
  const [tab, setTab] = useState<TabKey>("write");
  const [action, setAction] = useState("generate");
  const [style, setStyle] = useState("academic");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function handleTabChange(newTab: TabKey) {
    setTab(newTab);
    setAction(actionGroups[newTab][0].value);
    setResult("");
    setError("");
  }

  function handleActionChange(newAction: string) {
    setAction(newAction);
    setResult("");
    setError("");
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          prompt,
          keywords: prompt,
          style,
          content,
          targetLang: action === "translate" ? "en" : "vi",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi AI");

      setResult(data.result);

      if (action === "translate" && title) {
        const h2Match = data.result.match(/<h2[^>]*>([^<]+)<\/h2>/i);
        const enTitle = h2Match ? h2Match[1].trim() : `${title} (EN)`;
        const enExcerpt = data.result.replace(/<[^>]*>/g, " ").substring(0, 200).trim();
        onSetTranslation({ title: enTitle, html: data.result, excerpt: enExcerpt });
      }

      if (action === "meta_desc" && result) {
        // meta_desc returns plain text, not HTML
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleInsert() {
    if (!result) return;
    if (!isInsertable(action)) return;
    let clean = result.replace(/<h2[^>]*>([^<]+)<\/h2>\s*/i, "");
    onInsert(clean || result);
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
  }

  const actions = actionGroups[tab];
  const showStyleInput = needsStyle(action);
  const showPromptInput = needsPrompt(action);
  const showInsertButton = isInsertable(action);
  const showCopyButton = !isInsertable(action) && result;
  const isJson = isJsonOutput(action);

  const canGenerate =
    !loading && (!showPromptInput || !!prompt || action !== "generate");

  return (
    <div className="bg-card border border-[#e2e8f0] rounded-lg p-4 flex flex-col gap-3 h-fit">
      <h3 className="text-[0.9375rem] font-semibold">🤖 Trợ lý AI</h3>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e2e8f0] pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-2.5 py-1.5 rounded-lg border-0 text-[0.8125rem] font-medium cursor-pointer transition-all duration-150 ${tab === t.key ? "bg-accent text-white" : "bg-transparent text-text-secondary"}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Action selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[0.8125rem] text-text-secondary">Chức năng</label>
        <select
          value={action}
          onChange={(e) => handleActionChange(e.target.value)}
          className="p-2 rounded-lg border border-[#e2e8f0] text-sm"
        >
          {actions.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* Style selector */}
      {showStyleInput && (
        <div className="flex flex-col gap-2">
          <label className="text-[0.8125rem] text-text-secondary">Phong cách viết</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="p-2 rounded-lg border border-[#e2e8f0] text-sm"
          >
            {styles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Prompt input */}
      {showPromptInput && (
        <div className="flex flex-col gap-2">
          <label className="text-[0.8125rem] text-text-secondary">Chủ đề / từ khóa</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="VD: Bảo tồn di tích Cố đô Huế, tu bổ chùa Một Cột..."
            rows={3}
            className="p-2 rounded-lg border border-[#e2e8f0] text-sm resize-y font-[inherit]"
          />
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`px-4 py-2 border-0 rounded-lg text-sm font-medium transition-colors duration-150 ${loading ? "bg-slate-300 text-white cursor-not-allowed" : "bg-accent text-white cursor-pointer"}`}
      >
        {loading ? "Đang tạo..." : "Tạo nội dung"}
      </button>

      {error && (
        <div className="p-3 bg-[#fee2e2] text-[#991b1b] rounded-lg text-[0.8125rem]">
          {error}
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-2">
          <label className="text-[0.8125rem] text-text-secondary">Kết quả</label>
          <div
            className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[0.8125rem] max-h-[300px] overflow-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: isJson
                ? `<pre style="white-space:pre-wrap">${result.replace(/</g, "&lt;")}</pre>`
                : result,
            }}
          />
          <div className="flex gap-2">
            {showInsertButton && (
              <button
                onClick={handleInsert}
                className="flex-1 p-2 bg-accent-light text-white border-0 rounded-lg text-[0.8125rem] cursor-pointer"
              >
                Chèn vào editor
              </button>
            )}
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className="flex-1 p-2 bg-[#334155] text-white border-0 rounded-lg text-[0.8125rem] cursor-pointer"
              >
                📋 Sao chép
              </button>
            )}
            {action === "translate" && (
              <span className="text-xs text-[#166534] bg-[#dcfce7] px-2 py-1 rounded-full flex items-center">
                ✓ Đã lưu bản dịch
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
