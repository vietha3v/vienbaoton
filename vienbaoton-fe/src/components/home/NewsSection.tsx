import type { GhostPost } from "@/lib/ghost";
import SectionHeader from "@/components/shared/SectionHeader";
import NewsCard from "@/components/shared/NewsCard";

interface NewsSectionProps {
  posts: GhostPost[];
}

export default function NewsSection({ posts }: NewsSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="news-section" id="tin-tuc">
      <SectionHeader title="Tin tức Viện" viewAllLink="/tag/tin-tuc" />

      <div className="news-grid">
        {posts.map((post, index) => (
          <NewsCard key={post.id} post={post} featured={index === 0} />
        ))}
      </div>
    </section>
  );
}
