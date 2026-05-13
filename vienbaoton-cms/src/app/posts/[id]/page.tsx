import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/dates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  interface PostData {
    title: string;
    html: string;
    excerpt?: string;
    feature_image?: string;
    status?: string;
    published_at?: string;
    tags?: Array<{ name: string; slug: string }>;
    authors?: Array<{ name: string; slug: string }>;
  }

  let post: PostData | null = null;
  try {
    const res = await fetch(
      `${process.env.GHOST_API_URL}/ghost/api/content/posts/${id}/?key=${process.env.GHOST_CONTENT_API_KEY}&include=tags,authors`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    post = data.posts?.[0] || null;
  } catch {
    notFound();
  }

  if (!post) notFound();

  const tags = post.tags || [];
  const authors = post.authors || [];

  return (
    <div className="section-card">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
        <Link
          href="/posts"
          className="text-sm text-accent"
        >
          ← Quay lại danh sách
        </Link>
        <a
          href={`/posts/${id}/edit`}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm no-underline"
        >
          ✏️ Chỉnh sửa
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        {post.title}
      </h1>

      <div className="flex gap-4 text-sm text-text-secondary mb-6 flex-wrap">
        <span>
          Trạng thái:{" "}
          <span
            className={`status-badge ${post.status === "published" ? "status-published" : "status-draft"}`}
          >
            {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
          </span>
        </span>
        <span>Tác giả: {authors.map((a) => a.name).join(", ") || "—"}</span>
        <span>Ngày: {formatDate(post.published_at || "")}</span>
      </div>

      {post.feature_image && (
        <img
          src={post.feature_image}
          alt=""
          className="w-full max-h-[400px] object-cover rounded-lg mb-6"
        />
      )}

      {post.excerpt && (
        <div className="p-4 bg-[#f8fafc] rounded-lg mb-6 italic text-text-secondary">
          {post.excerpt}
        </div>
      )}

      <div
        className="leading-[1.7]"
        dangerouslySetInnerHTML={{ __html: post.html || "" }}
      />

      {tags.length > 0 && (
        <div className="mt-8 pt-4 border-t border-border">
          <strong>Thẻ:{" "}</strong>
          {tags.map((t) => (
            <span
              key={t.slug}
              className="inline-block px-2 py-1 bg-[#e2e8f0] rounded text-xs mr-2 mb-1"
            >
              {t.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
