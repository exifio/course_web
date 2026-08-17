import { useCallback, useRef, useState } from 'react';
import type { Course } from '../../domain/course';
import { getCourseImageUrl } from '../../utils/courseImage';
import ImageWithFallback from '../ui/ImageWithFallback';
import styles from './CourseMediaCarousel.module.css';

interface Slide {
  src: string;
  alt: string;
  label: string;
}

interface CourseMediaCarouselProps {
  course: Course;
}

export default function CourseMediaCarousel({
  course,
}: CourseMediaCarouselProps) {
  const routeSrc = getCourseImageUrl(course.routeImageKey);
  const heroSrc =
    course.image && course.image.length > 0
      ? course.image
      : getCourseImageUrl(course.heroImageKey);

  const slides: Slide[] = [
    { src: routeSrc, alt: `${course.name} 경로 이미지`, label: '경로' },
    { src: heroSrc, alt: `${course.name} 대표 이미지`, label: '대표' },
  ];

  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const drag = useRef({
    active: false,
    startX: 0,
    startLeft: 0,
    moved: false,
  });

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const clamped = Math.min(Math.max(index, 0), slides.length - 1);
      setActiveIndex(clamped);
      if (!track || typeof track.scrollTo !== 'function') return;
      track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
    },
    [slides.length],
  );

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    if (width === 0) return;
    const idx = Math.round(track.scrollLeft / width);
    setActiveIndex(Math.min(Math.max(idx, 0), slides.length - 1));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLUListElement>) {
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startLeft: track.scrollLeft,
      moved: false,
    };
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLUListElement>) {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const dx = event.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    track.scrollLeft = drag.current.startLeft - dx;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLUListElement>) {
    const track = trackRef.current;
    if (!track) return;
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    if (drag.current.moved) {
      const width = track.clientWidth || 1;
      const idx = Math.round(track.scrollLeft / width);
      scrollToIndex(idx);
    }
    drag.current.active = false;
  }

  function handleKey(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  }

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${course.name} 이미지`}
    >
      <ul
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKey}
      >
        {slides.map((slide, index) => (
          <li
            key={slide.label}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slides.length} — ${slide.label}`}
            aria-hidden={index !== activeIndex}
          >
            <ImageWithFallback
              src={slide.src}
              alt={slide.alt}
              className={styles.image}
            />
            <span className={styles.badge} aria-hidden="true">
              {slide.label}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowPrev}`}
        aria-label="이전 이미지"
        onClick={() => scrollToIndex(activeIndex - 1)}
        disabled={activeIndex === 0}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowNext}`}
        aria-label="다음 이미지"
        onClick={() => scrollToIndex(activeIndex + 1)}
        disabled={activeIndex === slides.length - 1}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.indicators} role="tablist" aria-label="이미지 위치">
        {slides.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`${index + 1}번째 이미지 (${slide.label})`}
            className={
              index === activeIndex
                ? `${styles.dot} ${styles.dotActive}`
                : styles.dot
            }
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
