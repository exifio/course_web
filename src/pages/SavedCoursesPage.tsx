import { useState } from 'react';
import { courses } from '../data/courses';
import { useSavedCourses } from '../hooks/useSavedCourses';
import CourseCard from '../features/courses/CourseCard';
import EmptyState from '../components/ui/EmptyState';
import Toast, { type ToastVariant } from '../components/feedback/Toast';
import styles from './SavedCoursesPage.module.css';

export default function SavedCoursesPage() {
  const { savedCourseIds, removeCourse } = useSavedCourses();
  const [toast, setToast] = useState<ToastVariant | null>(null);

  const savedCourses = courses.filter((course) =>
    savedCourseIds.includes(course.id),
  );

  function handleRemove(courseId: string) {
    removeCourse(courseId);
    setToast('unsaved');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>저장한 코스</h1>
        {savedCourses.length > 0 && (
          <p className={styles.count}>
            {savedCourses.length}개의 코스가 저장되어 있습니다
          </p>
        )}
      </header>

      {savedCourses.length === 0 ? (
        <EmptyState
          title="아직 저장한 코스가 없습니다"
          description="마음에 드는 코스를 저장해보세요"
          href="/"
          actionLabel="추천 코스 보러가기"
        />
      ) : (
        <section className={styles.grid} aria-label="저장한 코스 목록">
          {savedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSaved
              onToggleSaved={handleRemove}
            />
          ))}
        </section>
      )}

      <Toast variant={toast} onClose={() => setToast(null)} />
    </div>
  );
}
