import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  readSavedCourseIds,
  writeSavedCourseIds,
} from './savedCoursesStorage';

describe('savedCoursesStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장 키는 runroute:saved-course-ids이다', () => {
    expect(STORAGE_KEY).toBe('runroute:saved-course-ids');
  });

  it('저장값이 없으면 빈 배열을 반환한다', () => {
    expect(readSavedCourseIds()).toEqual([]);
  });

  it('course id 배열을 저장하고 다시 읽는다', () => {
    writeSavedCourseIds(['course-1', 'course-2']);
    expect(readSavedCourseIds()).toEqual(['course-1', 'course-2']);
  });

  it('중복 course id를 저장하지 않는다', () => {
    writeSavedCourseIds(['course-1', 'course-1', 'course-2']);
    expect(readSavedCourseIds()).toEqual(['course-1', 'course-2']);
  });

  it('깨진 JSON이 있어도 빈 배열로 복구한다', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    expect(readSavedCourseIds()).toEqual([]);
  });

  it('배열이 아닌 JSON 값이 있어도 빈 배열을 반환한다', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'course-1' }));
    expect(readSavedCourseIds()).toEqual([]);
  });
});
