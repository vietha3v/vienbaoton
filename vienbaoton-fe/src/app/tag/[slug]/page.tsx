import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { getTagBySlug, getTagPosts } from "@/lib/ghost";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: "Tag không tìm thấy" };
  }

  return {
    title: tag.name,
    description: tag.description || `Các bài viết thuộc chủ đề ${tag.name}`,
  };
}

export default async function TagDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("Tags");

  const tag = await getTagBySlug(slug);
  const posts = await getTagPosts(slug);

  if (!tag) {
    notFound();
  }

  return (
    <div className="tag-detail-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{tag.name}</h1>
          {tag.description && (
            <p className="page-subtitle">{tag.description}</p>
          )}
        </div>
      </div>

      <section className="tag-posts-section">
        <div className="container">
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
                        {new Date(post.published_at).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="post-reading-time">
                        {t("reading_time", { count: post.reading_time || 1 })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="empty-posts">{t("no_posts")}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
