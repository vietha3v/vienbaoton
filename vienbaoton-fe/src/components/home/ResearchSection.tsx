import { getTranslations } from "next-intl/server";
import type { GhostPost } from "@/lib/ghost";
import SectionHeader from "@/components/shared/SectionHeader";
import ResearchCard from "@/components/shared/ResearchCard";

interface ResearchSectionProps {
  posts: GhostPost[];
}

export default async function ResearchSection({ posts }: ResearchSectionProps) {
  const t = await getTranslations("HomePage");

  if (!posts || posts.length === 0) return null;

  return (
    <section className="research-section">
      <SectionHeader
        title={t("research_title")}
        viewAllLink="/tag/nghien-cuu"
        viewAllText={t("view_all")}
      />
      <div className="research-grid">
        {posts.map((post) => (
          <ResearchCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
