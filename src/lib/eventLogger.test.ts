import { describe, expect, test, vi } from 'vitest';
import { logEvent } from './eventLogger';

describe('eventLogger', () => {
  test('console.info에 [RunRoute event] prefix와 함께 이벤트를 기록한다', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    const entry = logEvent('navigation_click', {
      courseId: 'buyongcheon',
      courseName: '부용천 산책로 코스',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[RunRoute event]',
      expect.objectContaining({
        name: 'navigation_click',
        payload: {
          courseId: 'buyongcheon',
          courseName: '부용천 산책로 코스',
        },
        occurredAt: expect.any(String),
      }),
    );

    expect(entry.name).toBe('navigation_click');
    expect(entry.payload).toEqual({
      courseId: 'buyongcheon',
      courseName: '부용천 산책로 코스',
    });

    consoleSpy.mockRestore();
  });

  test('payload 기본값은 빈 객체이다', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    const entry = logEvent('page_view');

    expect(consoleSpy).toHaveBeenCalledWith(
      '[RunRoute event]',
      expect.objectContaining({
        name: 'page_view',
        payload: {},
        occurredAt: expect.any(String),
      }),
    );

    consoleSpy.mockRestore();
  });
});
