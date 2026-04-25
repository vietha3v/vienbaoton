import type { GhostPost } from "@/lib/ghost";
import SectionHeader from "@/components/shared/SectionHeader";
import ResearchCard from "@/components/shared/ResearchCard";

interface ResearchSectionProps {
  posts: GhostPost[];
}

export default function ResearchSection({ posts }: ResearchSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="research-section">
      <SectionHeader title="Nghiên cứu Khoa học" viewAllLink="/tag/nghien-cuu" />

      <div className="research-grid">
        {posts.map((post) => (
          <ResearchCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
