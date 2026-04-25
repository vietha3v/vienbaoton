import Link from "next/link";
import type { GhostPost } from "@/lib/ghost";

interface NewsCardProps {
  post: GhostPost;
  featured?: boolean;
}

export default function NewsCard({ post, featured }: NewsCardProps) {
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

  return (
    <article className={`news-card ${featured ? "featured-card" : ""}`}>
      {post.feature_image && (
        <Link className="news-card-image-link" href={`/${post.slug}`}>
          <img
            className="news-card-image"
            src={post.feature_image}
            alt={post.title}
          />
        </Link>
      )}
      <div className="news-card-content">
        <div className="news-card-meta">
          {post.primary_tag && (
            <>
              <span className="news-tag">{post.primary_tag.name}</span> &bull;{" "}
            </>
          )}
          <time>{formatDate(post.published_at)}</time>
        </div>
        <h3 className="news-card-title">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h3>
        {featured && post.excerpt && (
          <p className="news-card-excerpt">{truncate(post.excerpt, 25)}...</p>
        )}
      </div>
    </article>
  );
}
