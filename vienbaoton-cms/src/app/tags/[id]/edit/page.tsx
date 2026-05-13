"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTagPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "internal">("public");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetchTag(id);
    });
  }, [params]);

  async function fetchTag(tagId: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GHOST_API_URL || "http://localhost:2368"}/ghost/api/content/tags/${tagId}/?key=${process.env.NEXT_PUBLIC_GHOST_CONTENT_API_KEY || ""}`
      );
      const data = await res.json();
      const tag = data.tags?.[0];
      if (!tag) {
        setMessage("Không tìm thấy thẻ");
        setLoading(false);
        return;
      }
      setName(tag.name || "");
      setSlug(tag.slug || "");
      setDescription(tag.description || "");
      setVisibility(tag.visibility || "public");
    } catch {
      setMessage("Lỗi tải thẻ");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          visibility,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      setMessage("✓ Đã cập nhật thẻ");
      router.refresh();
    } catch (err) {
      setMessage(String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="section-card">Đang tải...</div>;

  return (
    <div className="section-card max-w-[600px]">
      <div className="section-title">Chỉnh sửa thẻ</div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg mb-4 text-sm ${message.startsWith("✓") ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Tên thẻ *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Bảo tồn di tích"
            required
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="bao-ton-di-tich"
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn về thẻ này"
            rows={3}
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit] resize-y"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Hiển thị</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "public" | "internal")}
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
          >
            <option value="public">Công khai</option>
            <option value="internal">Nội bộ</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={() => router.push("/tags")}
            className="px-5 py-2.5 rounded-lg border border-border bg-card text-sm cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2.5 rounded-lg border-none text-sm font-semibold text-white cursor-pointer ${saving ? "bg-[#cbd5e1] cursor-not-allowed" : "bg-accent"}`}
          >
            {saving ? "Đang lưu..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}
