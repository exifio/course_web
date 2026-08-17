import { describe, test, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { readSavedCourseIds } from '../../services/storage';
import { useSavedCourses } from './useSavedCourses';

beforeEach(() => localStorage.clear());

describe('useSavedCourses', () => {
  test('빈 LocalStorage에서 빈 saved 상태를 반환한다', () => {
    const { result } = renderHook(() => useSavedCourses());
    expect(result.current.savedCourseIds).toEqual([]);
    expect(result.current.savedCourses).toEqual([]);
    expect(result.current.isSaved('buyongcheon')).toBe(false);
  });

  test('saveCourse 호출 후 상태와 저장소가 즉시 갱신된다', () => {
    const { result } = renderHook(() => useSavedCourses());
    act(() => result.current.saveCourse('buyongcheon'));
    expect(result.current.savedCourseIds).toEqual(['buyongcheon']);
    expect(result.current.isSaved('buyongcheon')).toBe(true);
    expect(readSavedCourseIds()).toEqual(['buyongcheon']);
  });

  test('saveCourse를 두 번 호출해도 ID가 한 번만 저장된다', () => {
    const { result } = renderHook(() => useSavedCourses());
    act(() => result.current.saveCourse('buyongcheon'));
    act(() => result.current.saveCourse('buyongcheon'));
    expect(result.current.savedCourseIds).toEqual(['buyongcheon']);
    expect(readSavedCourseIds()).toEqual(['buyongcheon']);
  });

  test('removeCourse 호출 후 즉시 저장 상태에서 제거된다', () => {
    const { result } = renderHook(() => useSavedCourses());
    act(() => result.current.saveCourse('buyongcheon'));
    act(() => result.current.removeCourse('buyongcheon'));
    expect(result.current.savedCourseIds).toEqual([]);
    expect(result.current.isSaved('buyongcheon')).toBe(false);
    expect(readSavedCourseIds()).toEqual([]);
  });

  test('toggleCourse가 저장과 저장 해제를 전환한다', () => {
    const { result } = renderHook(() => useSavedCourses());
    act(() => result.current.toggleCourse('buyongcheon'));
    expect(result.current.isSaved('buyongcheon')).toBe(true);
    act(() => result.current.toggleCourse('buyongcheon'));
    expect(result.current.isSaved('buyongcheon')).toBe(false);
  });

  test('savedCourses가 저장된 ID에 해당하는 코스 객체를 반환한다', () => {
    const { result } = renderHook(() => useSavedCourses());
    act(() => result.current.saveCourse('buyongcheon'));
    expect(result.current.savedCourses).toHaveLength(1);
    expect(result.current.savedCourses[0].id).toBe('buyongcheon');
  });

  test('재마운트 시 LocalStorage 저장 상태가 유지된다', () => {
    const { result, unmount } = renderHook(() => useSavedCourses());
    act(() => result.current.saveCourse('buyongcheon'));
    unmount();

    const { result: result2 } = renderHook(() => useSavedCourses());
    expect(result2.current.savedCourseIds).toEqual(['buyongcheon']);
    expect(result2.current.isSaved('buyongcheon')).toBe(true);
  });
});