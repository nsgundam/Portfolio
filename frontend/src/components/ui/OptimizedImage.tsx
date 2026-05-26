interface OptimizedImageProps {
  /** Base path in /public without extension, e.g. "/og-image" */
  baseSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
}

/**
 * Serves WebP with a JPEG/PNG fallback via <picture>.
 * Place `baseSrc.webp` and `baseSrc.jpg` (or .png) in public/.
 */
export function OptimizedImage({
  baseSrc,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  fetchPriority,
  sizes,
}: OptimizedImageProps) {
  const webp = `${baseSrc}.webp`;
  const fallback = `${baseSrc}.jpg`;

  return (
    <picture>
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
