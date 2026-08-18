import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthContext';
import { writeAuthSession } from '../../features/auth/authSession';
import AuthMenu from './AuthMenu';

function renderAuthMenu() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <AuthMenu />
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());

describe('AuthMenu', () => {
  it('비로그인 상태에서 로그인 버튼을 표시한다', () => {
    renderAuthMenu();

    expect(
      screen.getByRole('button', { name: '로그인' }),
    ).toBeInTheDocument();
  });

  it('로그인 상태에서 email과 로그아웃 버튼을 표시한다', () => {
    writeAuthSession({
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    });
    renderAuthMenu();

    expect(screen.getByText('runner@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '로그아웃' }),
    ).toBeInTheDocument();
  });

  it('로그아웃 클릭 시 로그인 버튼으로 돌아간다', async () => {
    const user = userEvent.setup();
    writeAuthSession({
      email: 'runner@example.com',
      signedInAt: '2026-08-18T00:00:00.000Z',
    });
    renderAuthMenu();

    await user.click(screen.getByRole('button', { name: '로그아웃' }));

    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
    expect(localStorage.getItem('runroute:auth-session')).toBeNull();
  });
});
