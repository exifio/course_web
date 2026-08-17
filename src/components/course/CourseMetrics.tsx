import type { Course, CourseDifficulty } from '../../domain/course';
import styles from './CourseMetrics.module.css';

const difficultyLabel: Record<CourseDifficulty, string> = {
  easy: '쉬움',
  moderate: '보통',
  hard: '어려움',
  쉬움: '쉬움',
  보통: '보통',
  어려움: '어려움',
};

interface CourseMetricsProps {
  course: Course;
}

export default function CourseMetrics({ course }: CourseMetricsProps) {
  const duration = course.durationMin ?? course.estimatedMinutes ?? 0;
  return (
    <dl className={styles.metrics}>
      <div className={styles.item}>
        <dt className={styles.label}>거리</dt>
        <dd className={styles.value}>{course.distanceKm}km</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>예상 시간</dt>
        <dd className={styles.value}>약 {duration}분</dd>
      </div>
      <div className={styles.item}>
        <dt className={styles.label}>난이도</dt>
        <dd className={styles.value}>{difficultyLabel[course.difficulty] || course.difficulty}</dd>
      </div>
    </dl>
  );
}
