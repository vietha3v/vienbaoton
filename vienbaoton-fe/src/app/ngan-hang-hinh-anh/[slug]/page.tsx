import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import AlbumDetail from "@/components/gallery/AlbumDetail";
import { getAlbumBySlug, getAlbumPosts, GhostPost } from "@/lib/ghost";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  if (!album) {
    return { title: "Album không tìm thấy" };
  }

  return {
    title: album.title,
    description: album.meta_description || album.excerpt,
  };
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("Gallery");

  const album = await getAlbumBySlug(slug);
  const images = await getAlbumPosts(slug);

  if (!album) {
    notFound();
  }

  return (
    <div className="album-detail-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{album.title}</h1>
          <p className="page-subtitle">{album.meta_description || album.excerpt}</p>
        </div>
      </div>

      <section className="album-detail-section">
        <div className="container">
          <AlbumDetail images={images} albumTitle={album.title} />
        </div>
      </section>
    </div>
  );
}
