import { describe, test, expect } from 'vitest';
import { courses, getCourseById } from './courses';

const EXPECTED_COURSE_IDS = [
  'buyongcheon',
  'jungnangcheon',
  'baekseokcheon',
  'jikdong',
  'chudong',
  'songsansaji',
] as const;

describe('의정부 Mock Course 데이터', () => {
  test('코스는 6개만 제공한다', () => {
    expect(courses.length).toBe(6);
  });

  test('6개 코스 id가 PRD와 일치한다', () => {
    expect(courses.map((course) => course.id)).toEqual([...EXPECTED_COURSE_IDS]);
  });

  test('모든 코스 id는 유일하다', () => {
    expect(new Set(courses.map((course) => course.id)).size).toBe(
      courses.length,
    );
  });

  test('모든 코스는 의정부시 데이터이며 이미지 key를 가진다', () => {
    for (const course of courses) {
      expect(course.region).toBe('의정부시');
      expect(course.heroImageKey).toBeTruthy();
      expect(course.routeImageKey).toBeTruthy();
      expect(course.image).toMatch(/^\/course-images\/.*-hero\.png$/);
      expect(course.routeImage).toMatch(/^\/course-images\/.*-route\.png$/);
    }
  });

  test('모든 코스 summary는 비어 있지 않고 서로 다르다', () => {
    const summaries = courses.map((course) => course.summary.trim());
    expect(new Set(summaries).size).toBe(courses.length);
    for (const summary of summaries) {
      expect(summary.length).toBeGreaterThan(0);
    }
  });

  test('모든 코스는 리디자인 스키마 필수 필드와 카테고리를 포함한다', () => {
    const validCategories = new Set(['안전성', '노면', '편의시설', '분위기']);
    for (const course of courses) {
      expect(course.summary).toBeTruthy();
      expect(course.image).toBeTruthy();
      expect(course.routeImage).toBeTruthy();
      expect(course.durationMin).toBeGreaterThan(0);
      expect(course.difficulty).toBeTruthy();
      expect(course.safety.lighting).toBeTruthy();
      expect(course.safety.cctv).toBeTruthy();
      expect(course.safety.roadSeparation).toBeTruthy();
      expect(course.surface.slope).toBeTruthy();
      expect(course.surface.stairs).toBeTruthy();
      expect(course.atmosphere).toBeTruthy();
      expect(course.categories.length).toBeGreaterThan(0);
      expect(course.categories).not.toContain('전체');
      for (const cat of course.categories) {
        expect(validCategories.has(cat)).toBe(true);
      }
    }
  });

  test('모든 코스는 안전성·노면·편의시설·분위기 샘플 값을 갖는다', () => {
    for (const course of courses) {
      expect(course.safety.lighting.trim()).not.toBe('');
      expect(course.safety.cctv.trim()).not.toBe('');
      expect(course.safety.footTraffic?.trim()).not.toBe('');
      expect(course.safety.roadSeparation.trim()).not.toBe('');

      expect(course.surface.primary?.trim()).not.toBe('');
      expect(course.surface.slope.trim()).not.toBe('');
      expect(course.surface.stairs.trim()).not.toBe('');

      expect(course.facilities.toilets?.trim()).not.toBe('');
      expect(course.facilities.convenienceStores?.trim()).not.toBe('');
      expect(course.facilities.waterFountains?.trim()).not.toBe('');
      expect(course.facilities.lockers?.trim()).not.toBe('');

      const atmosphere =
        typeof course.atmosphere === 'string'
          ? course.atmosphere
          : course.atmosphere.description;
      expect(atmosphere.trim()).not.toBe('');
    }
  });

  test('id로 코스를 조회한다', () => {
    expect(getCourseById('buyongcheon')?.id).toBe('buyongcheon');
    expect(getCourseById('missing')).toBeUndefined();
  });

  test('6개 코스 route id로 모두 조회 가능하다', () => {
    for (const id of EXPECTED_COURSE_IDS) {
      expect(getCourseById(id)?.id).toBe(id);
    }
  });
});
