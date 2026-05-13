"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAuthorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Vui lòng nhập tên tác giả");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/authors", {
        method: "POST",
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

      if (!res.ok) throw new Error("Tạo thất bại");
      setMessage("✓ Đã tạo tác giả thành công!");
      setName("");
      setSlug("");
      setEmail("");
      setBio("");
      setWebsite("");
      setLocation("");
      router.refresh();
    } catch (err) {
      setMessage(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section-card max-w-[600px]">
      <div className="section-title">Tạo tác giả mới</div>

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
            placeholder="nguyen-van-a (tự động nếu để trống)"
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
            className={`px-6 py-2.5 rounded-lg border-none text-white text-sm font-semibold ${saving ? "bg-[#cbd5e1] cursor-not-allowed" : "bg-accent cursor-pointer"}`}
          >
            {saving ? "Đang lưu..." : "Tạo tác giả"}
          </button>
        </div>
      </form>
    </div>
  );
}
