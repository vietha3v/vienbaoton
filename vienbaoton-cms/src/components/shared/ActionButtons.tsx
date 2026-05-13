"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: string;
  type: "posts" | "pages" | "tags" | "authors";
  slug?: string;
  onDeleted?: () => void;
}

export default function ActionButtons({ id, type, slug, onDeleted }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Bạn có chắc muốn xóa? Hành động này không thể hoàn tác.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa thất bại");
      if (onDeleted) onDeleted();
      else router.refresh();
    } catch (e) {
      alert(String(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex gap-2">
      {slug && (
        <a
          href={`http://localhost:3000/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 text-xs text-[#2563eb] bg-[#dbeafe] rounded no-underline"
        >
          Xem
        </a>
      )}
      <a
        href={`/${type}/${id}/edit`}
        className="px-2 py-1 text-xs text-[#854d0e] bg-[#fef08a] rounded no-underline"
      >
        Sửa
      </a>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`px-2 py-1 text-xs text-[#991b1b] bg-[#fee2e2] border-0 rounded ${deleting ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {deleting ? "..." : "Xóa"}
      </button>
    </div>
  );
}
