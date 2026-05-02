"use client";

import { useState } from "react";
import Image from "next/image";
import { GhostPost } from "@/lib/ghost";

interface AlbumDetailProps {
  images: GhostPost[];
  albumTitle: string;
}

export default function AlbumDetail({ images, albumTitle }: AlbumDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div className="empty-album">
        <p>Album chưa có ảnh nào.</p>
      </div>
    );
  }

  return (
    <>
      <div className="album-photo-grid">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="photo-item"
            onClick={() => openLightbox(index)}
          >
            {image.feature_image ? (
              <Image
                src={image.feature_image}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 200px"
              />
            ) : (
              <div className="photo-placeholder">
                <span>{image.title}</span>
              </div>
            )}
            <div className="photo-caption">{image.title}</div>
          </div>
        ))}
      </div>

      {lightboxOpen && images[currentIndex] && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            ✕
          </button>
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); goToPrevious(); }}>
            ‹
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {images[currentIndex].feature_image && (
              <Image
                src={images[currentIndex].feature_image}
                alt={images[currentIndex].title}
                width={1200}
                height={800}
                className="lightbox-image"
              />
            )}
          </div>
          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
            ›
          </button>
          <div className="lightbox-caption">
            <span className="lightbox-counter">{currentIndex + 1} / {images.length}</span>
            <span className="lightbox-title">{images[currentIndex].title}</span>
          </div>
        </div>
      )}
    </>
  );
}
