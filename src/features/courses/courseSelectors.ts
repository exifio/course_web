import type { Course } from '../../domain/course';

const FEATURED_COURSE_ID = 'buyongcheon';

/**
 * 오늘의 추천 코스를 반환합니다.
 * FEATURED_COURSE_ID와 일치하는 코스를 우선 반환하고 없으면 첫 번째 코스를 반환합니다.
 */
export function getFeaturedCourse(courses: Course[]): Course | undefined {
  return courses.find((course) => course.id === FEATURED_COURSE_ID) ?? courses[0];
}

/**
 * 오늘의 추천 코스를 제외한 일반 추천 코스 목록을 반환합니다.
 */
export function getOtherCourses(courses: Course[], featuredCourseId: string): Course[] {
  return courses.filter((course) => course.id !== featuredCourseId);
}
