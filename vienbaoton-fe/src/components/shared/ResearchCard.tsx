import Link from "next/link";
import type { GhostPost } from "@/lib/ghost";

interface ResearchCardProps {
  post: GhostPost;
}

export default function ResearchCard({ post }: ResearchCardProps) {
  return (
    <article className="research-card">
      {post.feature_image && (
        <Link href={`/${post.slug}`} className="research-image-link">
          <img src={post.feature_image} alt={post.title} />
        </Link>
      )}
      <div className="research-card-content">
        <h3 className="research-title">
          <Link href={`/${post.slug}`}>{post.title}</Link>
        </h3>
      </div>
    </article>
  );
}
