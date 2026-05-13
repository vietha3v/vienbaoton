import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getPostBySlug, getPageBySlug, getRelatedPosts, getAllSlugs, getSettings } from "@/lib/ghost";
import type { GhostPost, GhostPage } from "@/lib/ghost";
import { formatDate } from "@/lib/dates";
import FeatureImage from "@/components/post/FeatureImage";
import RelatedPosts from "@/components/post/RelatedPosts";
import HeritageTimeline from "@/components/page/HeritageTimeline";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      openGraph: post.og_image
        ? { images: [{ url: post.og_image }] }
        : undefined,
    };
  } catch {
    try {
      const page = await getPageBySlug(slug);
      return {
        title: page.meta_title || page.title,
        description: page.meta_description || page.excerpt,
      };
    } catch {
      return { title: "Not Found" };
    }
  }
}

async function PostView({ post, relatedPosts, locale }: { post: GhostPost; relatedPosts: GhostPost[]; locale: string }) {
  const t = await getTranslations("HomePage");
  const pt = await getTranslations("PostPage");

  const readingTimeText =
    post.reading_time <= 1
      ? t("reading_time_1")
      : t("reading_time", { count: post.reading_time });

  return (
    <div className="post-container">
      <article className="single-post">
        <header className="single-header">
          {post.primary_tag && (
            <a href={post.primary_tag.url || `/tag/${post.primary_tag.slug}`} className="single-tag">
              {post.primary_tag.name}
            </a>
          )}
          <h1 className="single-title">{post.title}</h1>
          <div className="single-meta">
            <span className="meta-author">
              {pt("by_author", { authors: post.authors?.map((a) => a.name).join(", ") })}
            </span>
            <span className="meta-divider">❖</span>
            <time dateTime={post.published_at}>{formatDate(post.published_at, locale)}</time>
            <span className="meta-divider">❖</span>
            <span>{readingTimeText}</span>
          </div>
          <div className="single-header-line" />
        </header>

        {post.feature_image && (
          <FeatureImage
            src={post.feature_image}
            alt={post.title}
            caption={post.feature_image_caption}
            passePartout
          />
        )}

        <section
          className="single-content gh-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <footer className="single-footer">
          <div className="post-tags">
            {post.tags && post.tags.length > 0 && (
              <>
                <span>{pt("tag_label")} </span>
                {post.tags.map((tag, i) => (
                  <a key={tag.slug} href={tag.url || `/tag/${tag.slug}`}>
                    {tag.name}
                  </a>
                ))}
              </>
            )}
          </div>
        </footer>
      </article>

      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}

function PageView({ page }: { page: GhostPage }) {
  return (
    <div className="post-container">
      <article className="single-post page-post">
        <header className="single-header">
          <h1 className="single-title">{page.title}</h1>
        </header>

        {page.feature_image && (
          <FeatureImage
            src={page.feature_image}
            alt={page.title}
            caption={page.feature_image_caption}
            passePartout={false}
          />
        )}

        <section
          className="single-content gh-content"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </article>
    </div>
  );
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  let pageHtml: string | null = null;

  // Check for special template pages
  if (slug === "lich-su-hinh-thanh") {
    try {
      const page = await getPageBySlug(slug);
      pageHtml = page.html;
    } catch (e) {
      console.error("[SlugPage] Timeline page fetch failed:", e);
    }

    const pt = await getTranslations("PostPage");

    return (
      <div className="post-container">
        <article className="single-post">
          <header className="single-header">
            <h1 className="single-title">{pt("timeline_title")}</h1>
            <div className="single-meta">
              <span className="meta-author">{pt("timeline_subtitle")}</span>
            </div>
            <div className="single-header-line" />
          </header>

          {pageHtml && (
            <section
              className="single-content gh-content mb-16"
              dangerouslySetInnerHTML={{ __html: pageHtml }}
            />
          )}

          <HeritageTimeline />
        </article>
      </div>
    );
  }

  // Try to fetch as a post first
  try {
    const post = await getPostBySlug(slug);
    const relatedPosts = await getRelatedPosts(
      post.primary_tag?.slug || "",
      post.id,
      locale
    );
    return <PostView post={post} relatedPosts={relatedPosts} locale={locale} />;
  } catch (e) {
    console.error(`[SlugPage] Post fetch failed for "${slug}":`, e);
    // Fall back to page
    try {
      const page = await getPageBySlug(slug);
      return <PageView page={page} />;
    } catch (e2) {
      console.error(`[SlugPage] Page fetch also failed for "${slug}":`, e2);
      notFound();
    }
  }
}
