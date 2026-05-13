"use client";

import { useState, useEffect } from "react";

interface ResearchResult {
  type: string;
  result: string;
  keyword: string | null;
  timestamp: string;
  searchResults: any[];
}

interface SavedResearch {
  id: string;
  type: string;
  label: string;
  result: string;
  keyword: string | null;
  timestamp: string;
}

const RESEARCH_TYPES = [
  { value: "keyword_research", label: "🔍 Nghiên cứu từ khóa", desc: "Tìm từ khóa ngắn, dài, câu hỏi, địa phương" },
  { value: "content_gap", label: "📉 Content Gap", desc: "Tìm chủ đề còn thiếu so với ngành" },
  { value: "competitor_analysis", label: "🏆 Phân tích đối thủ", desc: "So sánh với đối thủ cùng lĩnh vực" },
  { value: "content_strategy", label: "📅 Kế hoạch truyền thông", desc: "Lịch content 30-90 ngày" },
  { value: "seo_reform_plan", label: "🛠️ Kế hoạch cải tổ SEO", desc: "Lộ trình cải thiện toàn diện" },
  { value: "serp_check", label: "🔎 Kiểm tra SERP", desc: "Tra cứu Google xem ai đang top" },
];

const TIMEFRAMES = [
  { value: "30", label: "30 ngày" },
  { value: "60", label: "60 ngày" },
  { value: "90", label: "90 ngày" },
];

export default function AiSeoResearch() {
  const [selectedType, setSelectedType] = useState("keyword_research");
  const [keyword, setKeyword] = useState("");
  const [timeframe, setTimeframe] = useState("30");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [history, setHistory] = useState<SavedResearch[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<"research" | "history">("research");

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("seo-research-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  function saveToHistory(data: ResearchResult) {
    const typeLabel = RESEARCH_TYPES.find((t) => t.value === data.type)?.label || data.type;
    const newItem: SavedResearch = {
      id: Date.now().toString(),
      type: data.type,
      label: typeLabel,
      result: data.result,
      keyword: data.keyword,
      timestamp: data.timestamp,
    };
    const updated = [newItem, ...history].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem("seo-research-history", JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  async function runResearch() {
    if (selectedType === "serp_check" && !keyword.trim()) {
      alert("Vui lòng nhập từ khóa để kiểm tra SERP");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const body: any = { type: selectedType };
      if (keyword.trim()) body.keyword = keyword.trim();
      if (selectedType === "content_strategy") body.timeframe = timeframe;

      const res = await fetch("/api/ai-seo-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResult(data);
      saveToHistory(data);
    } catch (e: any) {
      setResult({
        type: selectedType,
        result: `Lỗi: ${e.message}`,
        keyword: keyword || null,
        timestamp: new Date().toISOString(),
        searchResults: [],
      });
    } finally {
      setLoading(false);
    }
  }

  function loadHistoryItem(item: SavedResearch) {
    setResult({
      type: item.type,
      result: item.result,
      keyword: item.keyword,
      timestamp: item.timestamp,
      searchResults: [],
    });
    setSelectedType(item.type);
    setActiveTab("research");
  }

  function deleteHistoryItem(id: string) {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("seo-research-history", JSON.stringify(updated));
  }

  const selectedTypeInfo = RESEARCH_TYPES.find((t) => t.value === selectedType);

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          🤖 AI Nghiên cứu SEO & Kế hoạch truyền thông
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("research")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              activeTab === "research"
                ? "bg-[var(--color-accent)] text-white"
                : "bg-gray-100 text-[var(--color-text-secondary)] hover:bg-gray-200"
            }`}
          >
            Nghiên cứu
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              activeTab === "history"
                ? "bg-[var(--color-accent)] text-white"
                : "bg-gray-100 text-[var(--color-text-secondary)] hover:bg-gray-200"
            }`}
          >
            Lịch sử ({history.length})
          </button>
        </div>
      </div>

      {activeTab === "research" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {RESEARCH_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`text-left p-3 rounded-lg border transition ${
                  selectedType === t.value
                    ? "border-[var(--color-accent)] bg-orange-50"
                    : "border-[var(--color-border)] bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-medium text-sm text-[var(--color-text-primary)]">
                  {t.label}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {t.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-4 items-end">
            {selectedType === "serp_check" && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Từ khóa tra cứu Google *
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="VD: bảo tồn di tích Huế"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            )}

            {selectedType === "keyword_research" && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Từ khóa gợi ý (tùy chọn)
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="VD: tu bổ di tích"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            )}

            {selectedType === "competitor_analysis" && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Từ khóa đối thủ (tùy chọn)
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="VD: bảo tồn di sản văn hóa"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            )}

            {selectedType === "content_strategy" && (
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  Khung thời gian
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-accent)]"
                >
                  {TIMEFRAMES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={runResearch}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition min-w-[120px]"
            >
              {loading ? "Đang nghiên cứu..." : "Bắt đầu nghiên cứu"}
            </button>
          </div>

          {result && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {new Date(result.timestamp).toLocaleString("vi-VN")}
                  {result.keyword && ` · Từ khóa: "${result.keyword}"`}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.result);
                    alert("Đã copy kết quả!");
                  }}
                  className="text-xs px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-gray-50"
                >
                  📋 Copy
                </button>
              </div>

              {result.searchResults && result.searchResults.length > 0 && (
                <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-xs font-semibold text-blue-800 mb-2">
                    🔎 Kết quả Google Search (thực tế)
                  </div>
                  <div className="space-y-2">
                    {result.searchResults.map((r: any, i: number) => (
                      <div key={i} className="text-sm">
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 font-medium hover:underline"
                        >
                          {r.title}
                        </a>
                        <div className="text-xs text-green-700">{r.displayLink}</div>
                        <div className="text-xs text-gray-600">{r.snippet}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-gray-50 border border-[var(--color-border)] text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text-primary)] max-h-[600px] overflow-y-auto font-mono text-[13px]">
                {result.result}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
        <div>
          {history.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-secondary)] text-sm">
              Chưa có lịch sử nghiên cứu nào
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => loadHistoryItem(item)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {item.label}
                      </span>
                      {item.keyword && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                          {item.keyword}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      {new Date(item.timestamp).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistoryItem(item.id);
                    }}
                    className="ml-2 text-xs text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
