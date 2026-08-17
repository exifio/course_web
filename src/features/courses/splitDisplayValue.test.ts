import { describe, expect, test } from 'vitest';
import { splitDisplayValue } from './splitDisplayValue';

describe('splitDisplayValue', () => {
  test('Primary (Helper) 패턴을 분리한다', () => {
    expect(splitDisplayValue('밝음 (가로등 연속 배치)')).toEqual({
      value: '밝음',
      helper: '가로등 연속 배치',
    });
    expect(splitDisplayValue('주요 구간 설치 (5개소)')).toEqual({
      value: '주요 구간 설치',
      helper: '5개소',
    });
    expect(splitDisplayValue('2곳 (산책로 입구/중간)')).toEqual({
      value: '2곳',
      helper: '산책로 입구/중간',
    });
  });

  test('괄호 패턴이 없으면 전체를 value로 유지한다', () => {
    expect(splitDisplayValue('없음')).toEqual({ value: '없음' });
    expect(splitDisplayValue('전 구간 연속 감시')).toEqual({
      value: '전 구간 연속 감시',
    });
    expect(splitDisplayValue('보통')).toEqual({ value: '보통' });
  });
});
