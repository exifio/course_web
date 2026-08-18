import { beforeEach, describe, expect, it } from 'vitest';
import {
  AUTH_SESSION_KEY,
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from './authSession';

beforeEach(() => localStorage.clear());

describe('authSession', () => {
  it('세션을 localStorage에 저장하고 다시 읽는다', () => {
    const session = {
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    };

    writeAuthSession(session);

    expect(readAuthSession()).toEqual(session);
  });

  it('손상된 세션 JSON은 null로 복구한다', () => {
    localStorage.setItem(AUTH_SESSION_KEY, '{broken');

    expect(readAuthSession()).toBeNull();
  });

  it('비밀번호는 저장 모델에 포함하지 않는다', () => {
    const session = {
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    };

    writeAuthSession(session);

    expect(localStorage.getItem(AUTH_SESSION_KEY)).not.toContain('password');
  });

  it('저장된 값은 email과 signedInAt만 가진다', () => {
    const session = {
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    };

    writeAuthSession(session);

    const stored = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) ?? 'null');
    expect(Object.keys(stored).sort()).toEqual(['email', 'signedInAt']);
  });

  it('세션이 없으면 null을 반환한다', () => {
    expect(readAuthSession()).toBeNull();
  });

  it('형식이 다른 JSON은 null로 복구하고 잘못된 값을 제거한다', () => {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ foo: 'bar' }));

    expect(readAuthSession()).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('email이 누락된 객체는 null로 복구하고 잘못된 값을 제거한다', () => {
    localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({ signedInAt: '2026-08-18T00:00:00.000Z' }),
    );

    expect(readAuthSession()).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('clearAuthSession은 세션을 제거한다', () => {
    writeAuthSession({
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    });

    clearAuthSession();

    expect(readAuthSession()).toBeNull();
  });
});
