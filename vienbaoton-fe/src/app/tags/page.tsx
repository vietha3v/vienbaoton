import { getTranslations } from "next-intl/server";
import { getTags } from "@/lib/ghost";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";

export const metadata = {
  title: "Danh mục",
  description: "Danh sách các chuyên mục, chủ đề bài viết",
};

export default async function TagsPage() {
  const t = await getTranslations("Tags");
  const tags = await getTags();

  return (
    <div className="tags-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t("title")}</h1>
          <p className="page-subtitle">{t("subtitle")}</p>
        </div>
      </div>

      <section className="tags-section">
        <div className="container">
          {tags.length > 0 ? (
            <div className="tags-grid">
              {tags.map((tag) => (
                <Link href={`/tag/${tag.slug}`} key={tag.slug} className="tag-card">
                  <div className="tag-card-content">
                    <h3 className="tag-name">{tag.name}</h3>
                    {tag.count && tag.count.posts > 0 && (
                      <span className="tag-count">{tag.count.posts} bài viết</span>
                    )}
                  </div>
                  <div className="tag-arrow">→</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-tags">
              <p>{t("empty")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
