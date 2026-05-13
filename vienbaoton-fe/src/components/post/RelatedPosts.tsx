import { getTranslations } from "next-intl/server";
import type { GhostPost } from "@/lib/ghost";
import NewsCard from "@/components/shared/NewsCard";

interface RelatedPostsProps {
  posts: GhostPost[];
}

export default async function RelatedPosts({ posts }: RelatedPostsProps) {
  const t = await getTranslations("PostPage");

  return (
    <aside className="related-posts-section">
      <div className="section-header">
        <h2>{t("related_title")}</h2>
      </div>
      <div className="news-grid grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => <NewsCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-[var(--text-muted)] italic w-full col-span-3"
          >
            {t("related_empty")}
          </p>
        )}
      </div>
    </aside>
  );
}
