import GhostContentAPI from "@tryghost/content-api";
import { formatDate } from "@/lib/dates";
import Link from "next/link";
import ActionButtons from "@/components/shared/ActionButtons";

const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL || "http://localhost:2368",
  key: process.env.GHOST_CONTENT_API_KEY || "",
  version: "v5.0",
});

export const revalidate = 60;

export default async function PagesPage() {
  const pages = await api.pages.browse({
    limit: "all",
    include: ["tags"],
    order: "published_at DESC",
  });

  const items = pages as unknown as Array<{
    id: string;
    slug: string;
    title: string;
    published_at: string;
    tags?: { slug: string; name: string }[];
  }>;

  return (
    <div className="section-card">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
        <div className="section-title mb-0 pb-0 border-none">
          Danh sách trang tĩnh ({items.length})
        </div>
        <a
          href="/pages/new"
          className="inline-flex items-center gap-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium no-underline"
        >
          + Tạo trang mới
        </a>
      </div>
      {items.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Slug</th>
              <th>Loại</th>
              <th>Ngày xuất bản</th>
              <th className="w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((page) => {
              const isAlbum = page.tags?.some((t) => t.slug === "album");
              return (
                <tr key={page.id}>
                  <td>
                    <Link href={`/pages/${page.id}`}>
                      {page.title}
                    </Link>
                  </td>
                  <td>{page.slug}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        isAlbum ? "status-published" : "status-draft"
                      }`}
                    >
                      {isAlbum ? "Album" : "Trang"}
                    </span>
                  </td>
                  <td>{formatDate(page.published_at)}</td>
                  <td>
                    <ActionButtons id={page.id} type="pages" slug={page.slug} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">Chưa có trang tĩnh nào</div>
      )}
    </div>
  );
}
