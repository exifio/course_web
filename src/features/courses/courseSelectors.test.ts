import { describe, it, expect } from 'vitest';
import { courses } from '../../data/courses';
import { getFeaturedCourse, getOtherCourses } from './courseSelectors';

describe('courseSelectors', () => {
  it('오늘의 추천 코스를 1개 반환한다', () => {
    const featured = getFeaturedCourse(courses);
    expect(featured).toBeDefined();
    expect(featured?.id).toBe('buyongcheon');
  });

  it('코스 목록이 비어있지 않으면 첫 번째 코스를 반환한다 (featured ID 미일치 시 fallback)', () => {
    const mockCourses = [
      { ...courses[1], id: 'course-1' },
      { ...courses[2], id: 'course-2' },
    ];
    const featured = getFeaturedCourse(mockCourses);
    expect(featured?.id).toBe('course-1');
  });

  it('오늘의 추천 코스를 일반 목록에서 제외한다', () => {
    const featured = getFeaturedCourse(courses)!;
    const others = getOtherCourses(courses, featured.id);

    expect(others.some((course) => course.id === featured.id)).toBe(false);
    expect(others).toHaveLength(courses.length - 1);
  });
});
