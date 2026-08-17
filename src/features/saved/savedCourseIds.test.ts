import { toggleSavedCourseId } from './savedCourseIds';

test('없는 id를 저장한다', () => {
  expect(toggleSavedCourseId([], 'buyongcheon')).toEqual(['buyongcheon']);
});

test('이미 있는 id는 제거한다', () => {
  expect(toggleSavedCourseId(['buyongcheon'], 'buyongcheon')).toEqual([]);
});
