import { useState } from 'react';
import styles from './ImageWithFallback.module.css';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${styles.fallback} ${className}`.trim()}
        role="img"
        aria-label={alt}
      >
        코스 이미지 준비 중
      </div>
    );
  }

  return (
    <img
      className={`${styles.image} ${className}`.trim()}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
