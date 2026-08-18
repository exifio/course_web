import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import {
  AUTH_SESSION_KEY,
  readAuthSession,
  writeAuthSession,
} from './authSession';

function TestConsumer() {
  const { session, isAuthenticated, isLoginModalOpen, openLoginModal, closeLoginModal, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="authenticated">{String(isAuthenticated)}</p>
      <p data-testid="email">{session?.email ?? ''}</p>
      <p data-testid="modal-open">{String(isLoginModalOpen)}</p>
      <button type="button" onClick={() => login('runner@example.com', 'demo')}>
        login
      </button>
      <button type="button" onClick={() => login('  padded@example.com  ', 'demo')}>
        login-padded
      </button>
      <button type="button" onClick={() => login('', 'demo')}>
        login-empty-email
      </button>
      <button type="button" onClick={() => login('runner@example.com', '')}>
        login-empty-password
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
      <button type="button" onClick={openLoginModal}>
        open-modal
      </button>
      <button type="button" onClick={closeLoginModal}>
        close-modal
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>,
  );
}

beforeEach(() => localStorage.clear());

describe('AuthContext', () => {
  it('login 후 인증 상태가 true가 되고 새 세션이 저장된다', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');

    await user.click(screen.getByRole('button', { name: 'login' }));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('email')).toHaveTextContent('runner@example.com');

    const saved = readAuthSession();
    expect(saved?.email).toBe('runner@example.com');
    expect(typeof saved?.signedInAt).toBe('string');
    expect(saved).not.toHaveProperty('password');
  });

  it('login은 입력 email을 trim해서 저장한다', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'login-padded' }));

    expect(screen.getByTestId('email')).toHaveTextContent('padded@example.com');
  });

  it('빈 email 또는 비밀번호는 로그인하지 않는다', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'login-empty-email' }));
    await user.click(screen.getByRole('button', { name: 'login-empty-password' }));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('초기 렌더 시 localStorage 세션을 복원한다', () => {
    writeAuthSession({
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    });

    renderWithProvider();

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('email')).toHaveTextContent('runner@example.com');
  });

  it('logout 후 인증 상태와 localStorage 세션을 제거한다', async () => {
    const user = userEvent.setup();
    writeAuthSession({
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    });
    renderWithProvider();

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'logout' }));

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('email')).toHaveTextContent('');
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();
  });

  it('logout은 auth session만 제거하고 다른 localStorage는 유지한다', async () => {
    const user = userEvent.setup();
    localStorage.setItem('runroute:saved-course-ids', '["buyongcheon"]');
    writeAuthSession({
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    });
    renderWithProvider();

    await user.click(screen.getByRole('button', { name: 'logout' }));

    expect(localStorage.getItem('runroute:saved-course-ids')).toBe(
      '["buyongcheon"]',
    );
  });

  it('AuthProvider 밖에서 useAuth를 호출하면 에러를 던진다', () => {
    function ThrowsOnMount() {
      useAuth();
      return null;
    }

    expect(() => render(<ThrowsOnMount />)).toThrow(
      'AuthProvider 안에서만 사용',
    );
  });

  it('openLoginModal은 모달 상태를 true로, closeLoginModal은 false로 변경한다', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    expect(screen.getByTestId('modal-open')).toHaveTextContent('false');

    await user.click(screen.getByRole('button', { name: 'open-modal' }));
    expect(screen.getByTestId('modal-open')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'close-modal' }));
    expect(screen.getByTestId('modal-open')).toHaveTextContent('false');
  });
});
