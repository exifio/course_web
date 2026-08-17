import { Link } from 'react-router-dom';
import type { Course, CourseTag } from '../../domain/course';
import { getCourseImageUrl } from '../../utils/courseImage';
import ImageWithFallback from '../ui/ImageWithFallback';
import Tag from '../ui/Tag';
import SaveControl from '../ui/SaveControl';
import styles from './CourseCard.module.css';

export interface CourseCardProps {
  course: Course;
  variant?: 'grid' | 'saved';
  isSaved?: boolean;
  saved?: boolean;
  onToggleSaved?: (courseId: string) => void;
  onToggleSave?: (courseId: string) => void;
  onRemove?: (courseId: string) => void;
}

const TAG_LABELS: Record<CourseTag, string> = {
  'night-safe': '야간안심',
  flat: '평지',
  beginner: '초보추천',
  riverside: '수변',
  park: '공원',
  forest: '숲',
  city: '도심',
  'long-run': '장거리',
  refresh: '리프레시',
};

export default function CourseCard({
  course,
  variant = 'grid',
  isSaved,
  saved,
  onToggleSaved,
  onToggleSave,
  onRemove,
}: CourseCardProps) {
  const duration = course.durationMin ?? course.estimatedMinutes ?? 0;
  const activeSaved = isSaved ?? saved ?? false;
  const toggleHandler = onToggleSaved ?? onToggleSave;
  const imageUrl =
    course.image ||
    (course.heroImageKey ? getCourseImageUrl(course.heroImageKey) : '');

  if (variant === 'saved') {
    return (
      <article className={`${styles.card} ${styles.savedCard}`}>
        <Link
          to={`/courses/${course.id}`}
          className={styles.savedLink}
          aria-label={`${course.name} 상세 보기`}
        >
          <div className={styles.savedImageWrapper}>
            <ImageWithFallback
              src={imageUrl}
              alt={`${course.name} 대표 이미지`}
              className={styles.image}
            />
          </div>
          <div className={styles.savedContent}>
            <h3 className={styles.title}>{course.name}</h3>
            <p className={styles.metrics}>
              {course.distanceKm}km · 약 {duration}분
            </p>
            <div className={styles.tags}>
              {course.tags.slice(0, 3).map((tag) => (
                <Tag key={tag}>{TAG_LABELS[tag] || tag.replace(/^#/, '')}</Tag>
              ))}
            </div>
          </div>
        </Link>
        {onRemove && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(course.id);
            }}
            aria-label={`${course.name} 저장 해제`}
          >
            저장 해제
          </button>
        )}
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <Link
        to={`/courses/${course.id}`}
        className={styles.link}
        aria-label={`${course.name} 상세 보기`}
      >
        <div className={styles.imageWrapper}>
          <ImageWithFallback
            src={imageUrl}
            alt={`${course.name} 대표 이미지`}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{course.name}</h3>
          <p className={styles.metrics}>
            {course.distanceKm}km · 약 {duration}분
          </p>
          <div className={styles.tags}>
            {course.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{TAG_LABELS[tag] || tag.replace(/^#/, '')}</Tag>
            ))}
          </div>
        </div>
      </Link>
      {toggleHandler ? (
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
          <SaveControl
            saved={Boolean(activeSaved)}
            onToggle={() => toggleHandler(course.id)}
            courseName={course.name}
          />
        </div>
      ) : null}
    </article>
  );
}
