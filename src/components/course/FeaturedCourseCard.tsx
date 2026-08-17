import { Link } from 'react-router-dom';
import type { Course, CourseTag } from '../../domain/course';
import { getCourseImageUrl } from '../../utils/courseImage';
import ImageWithFallback from '../ui/ImageWithFallback';
import SaveControl from '../ui/SaveControl';
import CourseMetrics from './CourseMetrics';
import styles from './FeaturedCourseCard.module.css';

export interface FeaturedCourseCardProps {
  course: Course;
  isSaved: boolean;
  onToggleSaved: (courseId: string) => void;
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

export default function FeaturedCourseCard({
  course,
  isSaved,
  onToggleSaved,
}: FeaturedCourseCardProps) {
  return (
    <article className={styles.card}>
      <Link
        to={`/courses/${course.id}`}
        className={styles.link}
        aria-label={`${course.name} 상세 보기`}
      >
        <div className={styles.imageWrapper}>
          <ImageWithFallback
            src={course.image || (course.heroImageKey ? getCourseImageUrl(course.heroImageKey) : '')}
            alt={`${course.name} 대표 이미지`}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{course.name}</h3>
          <p className={styles.summary}>{course.summary}</p>
          <CourseMetrics course={course} />
          <div className={styles.tags}>
            {course.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                {TAG_LABELS[tag as CourseTag] || tag.replace(/^#/, '')}
              </span>
            ))}
          </div>
          <span className={styles.cta}>상세 보기</span>
        </div>
      </Link>
      <div className={styles.saveControlWrapper}>
        <SaveControl
          saved={isSaved}
          onToggle={() => onToggleSaved(course.id)}
          courseName={course.name}
        />
      </div>
    </article>
  );
}