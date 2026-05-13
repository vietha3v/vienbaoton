import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/dates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PageDetailPage({ params }: PageProps) {
  const { id } = await params;

  interface PageData {
    title: string;
    html: string;
    excerpt?: string;
    feature_image?: string;
    status?: string;
    published_at?: string;
    tags?: Array<{ name: string; slug: string }>;
  }

  let page: PageData | null = null;
  try {
    const res = await fetch(
      `${process.env.GHOST_API_URL}/ghost/api/content/pages/${id}/?key=${process.env.GHOST_CONTENT_API_KEY}&include=tags`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    page = data.pages?.[0] || null;
  } catch {
    notFound();
  }

  if (!page) notFound();

  const tags = page.tags || [];
  const isAlbum = tags.some((t) => t.slug === "album");

  return (
    <div className="section-card">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
        <Link href="/pages" className="text-sm text-accent">
          ← Quay lại danh sách
        </Link>
        <a
          href={`/pages/${id}/edit`}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm no-underline"
        >
          ✏️ Chỉnh sửa
        </a>
      </div>

      <div className="flex gap-2 mb-2">
        {isAlbum && (
          <span className="px-2 py-1 bg-[#dbeafe] text-[#1e40af] rounded text-xs font-semibold">
            Album ảnh
          </span>
        )}
        <span
          className={`status-badge ${page.status === "published" ? "status-published" : "status-draft"}`}
        >
          {page.status === "published" ? "Đã xuất bản" : "Bản nháp"}
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        {page.title}
      </h1>

      <div className="text-sm text-text-secondary mb-6">
        Ngày: {formatDate(page.published_at || "")}
      </div>

      {page.feature_image && (
        <img
          src={page.feature_image}
          alt=""
          className="w-full max-h-[400px] object-cover rounded-lg mb-6"
        />
      )}

      <div
        className="leading-[1.7]"
        dangerouslySetInnerHTML={{ __html: page.html || "" }}
      />

      {tags.length > 0 && (
        <div className="mt-8 pt-4 border-t border-border">
          <strong>Thẻ:{" "}</strong>
          {tags.map((t) => (
            <span
              key={t.slug}
              className="inline-block px-2 py-1 bg-[#e2e8f0] rounded text-xs mr-2"
            >
              {t.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
