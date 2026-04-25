import type { GhostPost } from "@/lib/ghost";
import NewsCard from "@/components/shared/NewsCard";

interface RelatedPostsProps {
  posts: GhostPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <aside className="related-posts-section">
      <div className="section-header">
        <h2>Nội dung liên quan</h2>
      </div>
      <div className="news-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {posts.length > 0 ? (
          posts.map((post) => <NewsCard key={post.id} post={post} />)
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontStyle: "italic",
              width: "100%",
              gridColumn: "span 3",
            }}
          >
            Các thư tịch liên đới đang trong quá trình bảo tồn...
          </p>
        )}
      </div>
    </aside>
  );
}
