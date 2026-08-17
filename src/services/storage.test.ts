import {
  readSavedCourseIds,
  writeSavedCourseIds,
  SAVED_COURSES_KEY,
} from './storage';

beforeEach(() => localStorage.clear());

test('빈 LocalStorage에서 빈 배열을 반환한다', () => {
  expect(readSavedCourseIds()).toEqual([]);
});

test('저장 id를 기록하고 다시 읽는다', () => {
  writeSavedCourseIds(['buyongcheon']);
  expect(readSavedCourseIds()).toEqual(['buyongcheon']);
});

test('손상된 JSON은 빈 배열로 복구한다', () => {
  localStorage.setItem(SAVED_COURSES_KEY, 'broken-json');
  expect(readSavedCourseIds()).toEqual([]);
});

test('저장 키는 runroute:saved-course-ids이다', () => {
  expect(SAVED_COURSES_KEY).toBe('runroute:saved-course-ids');
});

test('중복 ID는 한 번만 저장된다', () => {
  writeSavedCourseIds(['buyongcheon', 'buyongcheon', 'jungnangcheon']);
  expect(readSavedCourseIds()).toEqual(['buyongcheon', 'jungnangcheon']);
});

test('저장된 중복 ID는 읽을 때도 정리된다', () => {
  localStorage.setItem(
    SAVED_COURSES_KEY,
    JSON.stringify(['buyongcheon', 'buyongcheon']),
  );
  expect(readSavedCourseIds()).toEqual(['buyongcheon']);
});
