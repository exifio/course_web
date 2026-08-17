import { readEvents, trackDirectionsClick } from './eventTracker';

beforeEach(() => localStorage.clear());

test('길찾기 클릭 이벤트를 기록한다', () => {
  trackDirectionsClick('buyongcheon');
  expect(readEvents()).toEqual([
    expect.objectContaining({
      name: 'directions_click',
      courseId: 'buyongcheon',
    }),
  ]);
});

test('손상된 이벤트 데이터는 빈 배열로 복구한다', () => {
  localStorage.setItem('running-course:events:v1', '{corrupted_json');
  expect(readEvents()).toEqual([]);
});

test('유효하지 않은 이벤트 객체는 걸러낸다', () => {
  localStorage.setItem(
    'running-course:events:v1',
    JSON.stringify([
      { name: 'invalid_event', courseId: '1' },
      { name: 'directions_click', courseId: 'buyongcheon', occurredAt: '2026-08-16T00:00:00.000Z' },
    ]),
  );
  expect(readEvents()).toHaveLength(1);
  expect(readEvents()[0].courseId).toBe('buyongcheon');
});
