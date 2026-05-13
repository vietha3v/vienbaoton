import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { getAuthorBySlug, getAuthorPosts } from "@/lib/ghost";
import { formatDate } from "@/lib/dates";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: "Tác giả không tìm thấy" };
  }

  return {
    title: author.name,
    description: author.bio || `Các bài viết của ${author.name}`,
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("Tags");

  const author = await getAuthorBySlug(slug);
  const posts = await getAuthorPosts(slug, locale);

  if (!author) {
    notFound();
  }

  return (
    <div className="author-page">
      <div className="page-header">
        <div className="container">
          <div className="author-profile">
            {author.profile_image && (
              <div className="author-avatar">
                <Image
                  src={author.profile_image}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
            )}
            <h1 className="page-title">{author.name}</h1>
            {author.bio && <p className="page-subtitle">{author.bio}</p>}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="author-website"
              >
                {author.website}
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="author-posts-section">
        <div className="container">
          <h2 className="section-title">
            {locale === "en" ? "Articles" : "Bài viết"} ({posts.length})
          </h2>
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link href={`/${post.slug}`} key={post.id} className="post-card">
                  {post.feature_image && (
                    <div className="post-card-image">
                      <Image
                        src={post.feature_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="post-card-content">
                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>
                    <div className="post-card-meta">
                      <span className="post-date">
                        {formatDate(post.published_at, locale)}
                      </span>
                      <span className="post-reading-time">
                        {t("reading_time", { count: post.reading_time || 1 })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="empty-posts">
                {locale === "en" ? "No articles yet." : "Chưa có bài viết nào."}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
