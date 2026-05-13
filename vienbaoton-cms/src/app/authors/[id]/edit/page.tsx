"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditAuthorPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetchAuthor(id);
    });
  }, [params]);

  async function fetchAuthor(authorId: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GHOST_API_URL || "http://localhost:2368"}/ghost/api/content/authors/${authorId}/?key=${process.env.NEXT_PUBLIC_GHOST_CONTENT_API_KEY || ""}`
      );
      const data = await res.json();
      const author = data.authors?.[0];
      if (!author) {
        setMessage("Không tìm thấy tác giả");
        setLoading(false);
        return;
      }
      setName(author.name || "");
      setSlug(author.slug || "");
      setEmail(author.email || "");
      setBio(author.bio || "");
      setWebsite(author.website || "");
      setLocation(author.location || "");
    } catch {
      setMessage("Lỗi tải tác giả");
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
      const res = await fetch(`/api/authors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          email: email.trim() || undefined,
          bio: bio.trim() || undefined,
          website: website.trim() || undefined,
          location: location.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      setMessage("✓ Đã cập nhật tác giả");
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
      <div className="section-title">Chỉnh sửa tác giả</div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg mb-4 text-sm ${message.startsWith("✓") ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Tên tác giả *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Nguyễn Văn A"
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
            placeholder="nguyen-van-a"
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Tiểu sử</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Mô tả ngắn về tác giả"
            rows={3}
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit] resize-y"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[0.8125rem] font-medium">Địa điểm</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Hà Nội, Việt Nam"
            className="p-2.5 rounded-lg border border-border text-[0.9375rem] font-[inherit]"
          />
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={() => router.push("/authors")}
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
