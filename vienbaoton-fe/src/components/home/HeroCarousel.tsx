import type { GhostPost } from "@/lib/ghost";
import HeroCarouselSlide from "./HeroCarouselSlide";
import HeroCarouselClient from "./HeroCarouselClient";

interface HeroCarouselProps {
  posts: GhostPost[];
}

export default function HeroCarousel({ posts }: HeroCarouselProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="hero-section">
      <div className="hero-carousel">
        {posts.map((post, index) => (
          <HeroCarouselSlide key={post.id} post={post} active={index === 0} />
        ))}

        <HeroCarouselClient slideCount={posts.length} />
      </div>
    </section>
  );
}
