import { getNewsPosts } from "@/lib/ghost";
import { formatDate } from "@/lib/dates";
import Link from "next/link";
import ActionButtons from "@/components/shared/ActionButtons";

export const revalidate = 60;

export default async function PostsPage() {
  const posts = await getNewsPosts();

  return (
    <div className="section-card">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
        <div className="section-title mb-0 pb-0 border-none">
          Danh sách bài viết ({posts.length})
        </div>
        <a
          href="/posts/new"
          className="inline-flex items-center gap-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium no-underline"
        >
          + Viết bài mới
        </a>
      </div>
      {posts.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Thẻ</th>
              <th>Ngày xuất bản</th>
              <th className="w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link href={`/posts/${post.id}`}>
                    {post.title}
                  </Link>
                </td>
                <td>{post.authors?.map((a) => a.name).join(", ") || "—"}</td>
                <td>{post.tags?.map((t) => t.name).join(", ") || "—"}</td>
                <td>{formatDate(post.published_at)}</td>
                <td>
                  <ActionButtons id={post.id} type="posts" slug={post.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">Chưa có bài viết nào</div>
      )}
    </div>
  );
}
