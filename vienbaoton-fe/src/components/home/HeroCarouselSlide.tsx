"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { GhostPost } from "@/lib/ghost";
import { formatDate } from "@/lib/dates";

interface HeroCarouselSlideProps {
  post: GhostPost;
  active?: boolean;
}

export default function HeroCarouselSlide({
  post,
  active,
}: HeroCarouselSlideProps) {
  const t = useTranslations("HomePage");
  const locale = useLocale();

  const readingTimeText =
    post.reading_time <= 1
      ? t("reading_time_1")
      : t("reading_time", { count: post.reading_time });

  const truncate = (text: string, words: number) => {
    return text.split(/\s+/).slice(0, words).join(" ");
  };

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
              {post.primary_tag
                ? post.primary_tag.name
                : t("focus_label")}{" "}
              • {readingTimeText}
            </div>
            <h1 className="hero-title">{post.title}</h1>
            <p className="hero-excerpt">
              {truncate(post.excerpt, 30)}...
            </p>
            <div className="hero-author-date">
              <span>{post.primary_author?.name}</span> &bull;{" "}
              <time>{formatDate(post.published_at, locale)}</time>
            </div>
            <Link href={`/${post.slug}`} className="hero-btn">
              {t("hero_read_more")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
