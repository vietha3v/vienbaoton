interface FeatureImageProps {
  src: string;
  alt?: string;
  caption?: string | null;
  passePartout?: boolean;
}

export default function FeatureImage({ src, alt, caption, passePartout = true }: FeatureImageProps) {
  if (passePartout) {
    return (
      <figure className="single-feature-image">
        <div className="feature-image-frame">
          <img src={src} alt={alt || ""} />
        </div>
        {caption && <figcaption className="image-caption">{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="single-feature-image">
      <img src={src} alt={alt || ""} />
      {caption && <figcaption className="image-caption">{caption}</figcaption>}
    </figure>
  );
}
