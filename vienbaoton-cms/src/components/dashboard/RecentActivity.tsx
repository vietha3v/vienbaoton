import Link from "next/link";
import { formatDate } from "@/lib/dates";

interface RecentActivityProps {
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string;
    primaryTag: string | null;
    readingTime: number;
    status: string;
    metaTitle: boolean;
    metaDescription: boolean;
    featureImage: boolean;
    excerpt: boolean;
  }[];
  contentQuality: {
    shortestPost: { id: string; title: string; slug: string; wordCount: number } | null;
    longestPost: { id: string; title: string; slug: string; wordCount: number } | null;
    recentlyUpdated: { id: string; title: string; slug: string; updatedAt: string }[];
    authorDistribution: { name: string; slug: string; count: number }[];
  };
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: ok ? "#22c55e" : "#ef4444" }}
      title={ok ? "Đã có" : "Thiếu"}
    />
  );
}

export default function RecentActivity({ recentPosts, contentQuality }: RecentActivityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="section-card">
        <div className="section-title">Bài viết gần đây & trạng thái SEO</div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="min-w-[200px]">Tiêu đề</th>
                <th className="text-center w-10" title="Meta Title">T</th>
                <th className="text-center w-10" title="Meta Description">D</th>
                <th className="text-center w-10" title="Ảnh đại diện">I</th>
                <th className="text-center w-10" title="Excerpt">E</th>
                <th className="w-24">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
                <tr key={post.id}>
                  <td className="max-w-[300px]">
                    <Link
                      href={`http://localhost:3000/${post.slug}`}
                      target="_blank"
                      className="font-medium truncate block"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                    <span
                      className={`ml-2 text-[0.7rem] px-1.5 py-0.5 rounded-full font-semibold ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {post.status === "published" ? "XB" : "Nháp"}
                    </span>
                  </td>
                  <td className="text-center">
                    <StatusDot ok={post.metaTitle} />
                  </td>
                  <td className="text-center">
                    <StatusDot ok={post.metaDescription} />
                  </td>
                  <td className="text-center">
                    <StatusDot ok={post.featureImage} />
                  </td>
                  <td className="text-center">
                    <StatusDot ok={post.excerpt} />
                  </td>
                  <td className="text-[0.8125rem] text-[var(--color-text-secondary)]">
                    {formatDate(post.publishedAt)}
                  </td>
                </tr>
              ))}
              {recentPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-[var(--color-text-secondary)] italic">
                    Chưa có bài viết nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="section-card">
          <div className="section-title">Cập nhật gần đây</div>
          <div className="space-y-2">
            {contentQuality.recentlyUpdated.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
              >
                <Link
                  href={`http://localhost:3000/${post.slug}`}
                  target="_blank"
                  className="text-sm text-[var(--color-accent)] hover:underline truncate max-w-[70%]"
                >
                  {post.title}
                </Link>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {formatDate(post.updatedAt)}
                </span>
              </div>
            ))}
            {contentQuality.recentlyUpdated.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)] italic">Không có cập nhật mới</p>
            )}
          </div>
        </div>

        <div className="section-card">
          <div className="section-title">Đóng góp tác giả</div>
          <div className="space-y-2">
            {contentQuality.authorDistribution.slice(0, 8).map((author) => (
              <div
                key={author.slug}
                className="flex items-center justify-between py-1.5 border-b border-[var(--color-border)] last:border-0"
              >
                <span className="text-sm text-[var(--color-text-primary)]">{author.name}</span>
                <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-body)] px-2 py-0.5 rounded-full">
                  {author.count} bài
                </span>
              </div>
            ))}
            {contentQuality.authorDistribution.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)] italic">Chưa có tác giả nào</p>
            )}
          </div>
        </div>

        {(contentQuality.shortestPost || contentQuality.longestPost) && (
          <div className="section-card">
            <div className="section-title">Độ dài bài viết</div>
            <div className="grid grid-cols-2 gap-4">
              {contentQuality.shortestPost && (
                <div className="p-3 rounded-lg bg-[var(--color-body)] border border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Ngắn nhất</div>
                  <Link
                    href={`http://localhost:3000/${contentQuality.shortestPost.slug}`}
                    target="_blank"
                    className="text-sm font-medium text-[var(--color-accent)] hover:underline block truncate"
                  >
                    {contentQuality.shortestPost.title}
                  </Link>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {contentQuality.shortestPost.wordCount.toLocaleString()} từ
                  </div>
                </div>
              )}
              {contentQuality.longestPost && (
                <div className="p-3 rounded-lg bg-[var(--color-body)] border border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">Dài nhất</div>
                  <Link
                    href={`http://localhost:3000/${contentQuality.longestPost.slug}`}
                    target="_blank"
                    className="text-sm font-medium text-[var(--color-accent)] hover:underline block truncate"
                  >
                    {contentQuality.longestPost.title}
                  </Link>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {contentQuality.longestPost.wordCount.toLocaleString()} từ
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
