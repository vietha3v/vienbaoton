"use client";

import Link from "next/link";
import Image from "next/image";
import { GhostAlbum } from "@/lib/ghost";

interface AlbumGalleryProps {
  albums: GhostAlbum[];
}

export default function AlbumGallery({ albums }: AlbumGalleryProps) {
  if (albums.length === 0) {
    return (
      <div className="empty-gallery">
        <p>Chưa có album ảnh nào. Vui lòng tạo album trong Ghost Admin.</p>
      </div>
    );
  }

  return (
    <div className="album-grid">
      {albums.map((album) => {
        // Đếm số ảnh từ HTML content (img tags)
        const imageCount = (album.html?.match(/<img\s/g) || []).length;

        return (
          <Link href={`/ngan-hang-hinh-anh/${album.slug}`} key={album.id} className="album-card">
            <div className="album-cover">
              {album.feature_image ? (
                <Image
                  src={album.feature_image}
                  alt={album.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="album-cover-placeholder">
                  <span>Không có ảnh</span>
                </div>
              )}
              <div className="album-overlay">
                <span className="view-album-btn">Xem album</span>
              </div>
            </div>
            <div className="album-info">
              <h3 className="album-title">{album.title}</h3>
              <p className="album-description">{album.excerpt || album.meta_description}</p>
              <div className="album-meta">
                <span className="image-count">{imageCount} ảnh</span>
                <span className="album-date">
                  {new Date(album.published_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
