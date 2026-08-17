import { useMemo, useState } from 'react';
import { courses } from '../data/courses';
import { getFeaturedCourse, getOtherCourses } from '../features/courses/courseSelectors';
import { useSavedCourses } from '../features/saved/useSavedCourses';
import { useLocationContext } from '../hooks/useLocationContext';
import CourseCard from '../features/courses/CourseCard';
import FeaturedCourseCard from '../components/course/FeaturedCourseCard';
import FeaturedCourseSkeleton from '../components/course/FeaturedCourseSkeleton';
import CourseGridSkeleton from '../components/course/CourseGridSkeleton';
import Chip from '../components/ui/Chip';
import MockDataNotice from '../components/ui/MockDataNotice';
import styles from './HomePage.module.css';

interface HomePageProps {
  isLoading?: boolean;
}

export default function HomePage({ isLoading = false }: HomePageProps) {
  const saved = useSavedCourses();
  const location = useLocationContext();
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const featuredCourse = useMemo(() => getFeaturedCourse(courses), []);
  const otherCourses = useMemo(
    () => (featuredCourse ? getOtherCourses(courses, featuredCourse.id) : courses),
    [featuredCourse],
  );

  const categoryOptions = useMemo(
    () => ['전체', ...new Set(otherCourses.flatMap((course) => course.categories))],
    [otherCourses],
  );

  const filteredCourses = useMemo(() => {
    if (selectedCategory === '전체') return otherCourses;
    return otherCourses.filter((course) => course.categories.includes(selectedCategory));
  }, [selectedCategory, otherCourses]);

  return (
    <div className={styles.page}>
      <section className={styles.intro} aria-label="추천 탐색">
        <p className={styles.location}>
          {location.locationCopy}
        </p>
        <h1 className={styles.heading}>오늘 어디서 뛰어볼까요?</h1>
        <p className={styles.subheading}>
          러너에게 필요한 안전성·노면·편의시설·분위기 정보를 확인하고 코스를 선택해보세요.
        </p>
      </section>

      {featuredCourse && (
        <section
          className={styles.featuredSection}
          aria-label="오늘의 추천 코스"
          aria-busy={isLoading}
        >
          <h2 className={styles.sectionTitle}>오늘의 추천 코스</h2>
          {isLoading ? (
            <FeaturedCourseSkeleton />
          ) : (
            <FeaturedCourseCard
              course={featuredCourse}
              isSaved={saved.isSaved(featuredCourse.id)}
              onToggleSaved={saved.toggleCourse}
            />
          )}
        </section>
      )}

      <section
        className={styles.recommendSection}
        aria-label="다른 추천 코스"
        aria-busy={isLoading}
      >
        <h2 className={styles.sectionTitle}>다른 추천 코스</h2>
        {isLoading ? (
          <CourseGridSkeleton count={6} />
        ) : (
          <>
            <div className={styles.filterRow} role="group" aria-label="코스 필터">
              {categoryOptions.map((category) => (
                <Chip
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Chip>
              ))}
            </div>
            <div className={styles.grid} aria-label="추천 코스 목록">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isSaved={saved.isSaved(course.id)}
                  onToggleSaved={saved.toggleCourse}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <MockDataNotice />
    </div>
  );
}