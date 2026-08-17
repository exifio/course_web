import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { getLocationCopy, useLocationContext } from './useLocationContext';

describe('useLocationContext', () => {
  test('getLocationCopy가 기본 지역 문구를 반환한다', () => {
    expect(getLocationCopy('granted', '의정부시')).toBe('현재 위치 기준 · 의정부시');
    expect(getLocationCopy('idle', '의정부시')).toBe('현재 위치 기준 · 의정부시');
  });

  test('브라우저 위치 권한 요청 없이 고정 위치 문맥을 제공한다', () => {
    const { result } = renderHook(() => useLocationContext());
    expect(result.current.regionLabel).toBe('의정부시');
    expect(result.current.locationCopy).toBe('현재 위치 기준 · 의정부시');
  });
});
