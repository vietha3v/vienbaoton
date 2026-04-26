import Link from "next/link";
import type { GhostPost } from "@/lib/ghost";

interface HeroCarouselSlideProps {
  post: GhostPost;
  active?: boolean;
}

export default function HeroCarouselSlide({ post, active }: HeroCarouselSlideProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const truncate = (text: string, words: number) => {
    return text.split(/\s+/).slice(0, words).join(" ");
  };

  const readingTimeText = post.reading_time <= 1
    ? "1 phút đọc"
    : `${post.reading_time} phút đọc`;

  return (
    <div className={`hero-slide ${active ? "active" : ""}`}>
      <div className="hero-slide-inner">
        {post.feature_image && (
          <div
            className="hero-bg-image"
            style={{ backgroundImage: `url('${post.feature_image}')` }}
          />
        )}
        <div className="hero-content-wrapper">
          <div className="hero-content-inner">
            <div className="hero-meta">
              {post.primary_tag ? post.primary_tag.name : "TIÊU ĐIỂM"} • {readingTimeText}
            </div>
            <h1 className="hero-title">{post.title}</h1>
            <p className="hero-excerpt">{truncate(post.excerpt, 30)}...</p>
            <div className="hero-author-date">
              <span>{post.primary_author?.name}</span> &bull;{" "}
              <time>{formatDate(post.published_at)}</time>
            </div>
            <Link href={`/${post.slug}`} className="hero-btn">
              Đọc chi tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
