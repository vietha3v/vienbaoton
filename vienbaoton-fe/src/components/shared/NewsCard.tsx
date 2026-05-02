"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { GhostPost } from "@/lib/ghost";
import { formatDate } from "@/lib/dates";

interface NewsCardProps {
  post: GhostPost;
  featured?: boolean;
}

export default function NewsCard({ post, featured }: NewsCardProps) {
  const locale = useLocale();

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
          <time>{formatDate(post.published_at, locale)}</time>
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
