import { getTranslations } from "next-intl/server";
import type { GhostPost } from "@/lib/ghost";
import SectionHeader from "@/components/shared/SectionHeader";
import NewsCard from "@/components/shared/NewsCard";

interface NewsSectionProps {
  posts: GhostPost[];
}

export default async function NewsSection({ posts }: NewsSectionProps) {
  const t = await getTranslations("HomePage");

  if (!posts || posts.length === 0) return null;

  return (
    <section className="news-section" id="tin-tuc">
      <SectionHeader
        title={t("news_title")}
        viewAllLink="/tag/tin-tuc"
        viewAllText={t("view_all")}
      />
      <div className="news-grid">
        {posts.map((post, index) => (
          <NewsCard key={post.id} post={post} featured={index === 0} />
        ))}
      </div>
    </section>
  );
}
