import GhostContentAPI from "@tryghost/content-api";
import Link from "next/link";
import Image from "next/image";
import ActionButtons from "@/components/shared/ActionButtons";

const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL || "http://localhost:2368",
  key: process.env.GHOST_CONTENT_API_KEY || "",
  version: "v5.0",
});

export const revalidate = 60;

export default async function AuthorsPage() {
  const authors = await api.authors.browse({
    limit: "all",
    include: ["count.posts"],
    order: "name ASC",
  });

  const items = authors as unknown as Array<{
    id: string;
    slug: string;
    name: string;
    profile_image: string | null;
    bio: string | null;
    website: string | null;
    count?: { posts: number };
  }>;

  return (
    <div className="section-card">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
        <div className="section-title mb-0 pb-0 border-none">
          Danh sách tác giả ({items.length})
        </div>
        <a
          href="/authors/new"
          className="inline-flex items-center gap-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium no-underline"
        >
          + Tạo tác giả mới
        </a>
      </div>
      {items.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Bio</th>
              <th>Số bài viết</th>
              <th className="w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((author) => (
              <tr key={author.id}>
                <td>
                  {author.profile_image ? (
                    <Image
                      src={author.profile_image}
                      alt={author.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-xs text-text-secondary"
                    >
                      {author.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td>
                  <Link href={`http://localhost:3000/author/${author.slug}`} target="_blank">
                    {author.name}
                  </Link>
                </td>
                <td className="max-w-[400px] text-text-secondary">
                  {author.bio || "—"}
                </td>
                <td>{author.count?.posts || 0}</td>
                <td>
                  <ActionButtons id={author.id} type="authors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">Chưa có tác giả nào</div>
      )}
    </div>
  );
}
