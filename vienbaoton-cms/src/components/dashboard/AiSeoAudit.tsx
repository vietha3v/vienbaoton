"use client";

import { useState } from "react";

interface AiSeoAuditProps {
  recentPosts: {
    id: string;
    title: string;
    slug: string;
  }[];
}

export default function AiSeoAudit({ recentPosts }: AiSeoAuditProps) {
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postResult, setPostResult] = useState<string | null>(null);

  async function runBulkAudit() {
    setBulkLoading(true);
    setBulkResult(null);
    try {
      const res = await fetch("/api/ai-seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bulk" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBulkResult(data.result);
    } catch (e: any) {
      setBulkResult(`Lỗi: ${e.message}`);
    } finally {
      setBulkLoading(false);
    }
  }

  async function runPostAudit(postId: string) {
    setPostLoading(true);
    setPostResult(null);
    setSelectedPost(postId);
    try {
      const res = await fetch("/api/ai-seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "post", postId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPostResult(data.result);
    } catch (e: any) {
      setPostResult(`Lỗi: ${e.message}`);
    } finally {
      setPostLoading(false);
    }
  }

  return (
    <div className="section-card">
      <div className="section-title">Phân tích SEO bằng AI</div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={runBulkAudit}
          disabled={bulkLoading}
          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          {bulkLoading ? "Đang phân tích toàn bộ..." : "🔍 Audit toàn bộ content"}
        </button>
      </div>

      {bulkResult && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-[var(--color-border)] text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text-primary)]">
          {bulkResult}
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          Phân tích từng bài viết
        </h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {recentPosts.slice(0, 8).map((post) => (
            <button
              key={post.id}
              onClick={() => runPostAudit(post.id)}
              disabled={postLoading}
              className={`px-3 py-1.5 rounded-full text-xs border transition max-w-[200px] truncate ${
                selectedPost === post.id && postLoading
                  ? "bg-gray-100 border-gray-300 text-gray-500"
                  : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
              title={post.title}
            >
              {selectedPost === post.id && postLoading ? "..." : "Phân tích"} {post.title.slice(0, 25)}
              {post.title.length > 25 ? "..." : ""}
            </button>
          ))}
        </div>

        {postResult && (
          <div className="p-4 rounded-lg bg-gray-50 border border-[var(--color-border)] text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text-primary)]">
            {postResult}
          </div>
        )}
      </div>
    </div>
  );
}
