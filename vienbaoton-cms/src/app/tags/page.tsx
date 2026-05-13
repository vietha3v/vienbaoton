import { getTags } from "@/lib/ghost";
import Link from "next/link";
import ActionButtons from "@/components/shared/ActionButtons";

export const revalidate = 60;

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="section-card">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
        <div className="section-title mb-0 pb-0 border-none">
          Danh sách thẻ ({tags.length})
        </div>
        <a
          href="/tags/new"
          className="inline-flex items-center gap-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium no-underline"
        >
          + Tạo thẻ mới
        </a>
      </div>
      {tags.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên thẻ</th>
              <th>Slug</th>
              <th>Số bài viết</th>
              <th className="w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td>
                  <Link href={`http://localhost:3000/tag/${tag.slug}`} target="_blank">
                    {tag.name}
                  </Link>
                </td>
                <td>{tag.slug}</td>
                <td>{tag.count?.posts || 0}</td>
                <td>
                  <ActionButtons id={tag.id} type="tags" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">Chưa có thẻ nào</div>
      )}
    </div>
  );
}
