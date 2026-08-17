import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { readSavedCourseIds } from '../utils/savedCoursesStorage';
import { useSavedCourses } from './useSavedCourses';

beforeEach(() => {
  localStorage.clear();
});

describe('useSavedCourses hook', () => {
  it('코스를 저장하고 해제하며 localStorage에 유지한다', () => {
    const { result } = renderHook(() => useSavedCourses());

    act(() => result.current.saveCourse('buyongcheon'));
    expect(result.current.isSaved('buyongcheon')).toBe(true);
    expect(readSavedCourseIds()).toEqual(['buyongcheon']);

    act(() => result.current.removeCourse('buyongcheon'));
    expect(result.current.isSaved('buyongcheon')).toBe(false);
    expect(readSavedCourseIds()).toEqual([]);
  });

  it('toggleCourse는 변경 후 저장 상태를 boolean으로 반환한다', () => {
    const { result } = renderHook(() => useSavedCourses());

    let nextState: boolean = false;
    act(() => {
      nextState = result.current.toggleCourse('buyongcheon');
    });
    expect(nextState).toBe(true);
    expect(result.current.isSaved('buyongcheon')).toBe(true);

    act(() => {
      nextState = result.current.toggleCourse('buyongcheon');
    });
    expect(nextState).toBe(false);
    expect(result.current.isSaved('buyongcheon')).toBe(false);
  });

  it('중복 저장 시 중복 id를 추가하지 않는다', () => {
    const { result } = renderHook(() => useSavedCourses());

    act(() => result.current.saveCourse('buyongcheon'));
    act(() => result.current.saveCourse('buyongcheon'));
    expect(result.current.savedCourseIds).toEqual(['buyongcheon']);
  });
});
