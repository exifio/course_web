import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthContext';
import GNB from './GNB';

function renderGNB(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <GNB />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('GNB Component', () => {
  test('RunRoute 로고와 허용된 메뉴(홈, 저장)만 렌더링한다', () => {
    renderGNB();

    expect(screen.getByText('RunRoute')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '저장' })).toBeInTheDocument();
  });

  test('/와 /courses/:id에서는 홈이 active이고, /saved에서는 저장 링크가 active이다', () => {
    const { unmount } = renderGNB('/courses/buyongcheon');

    const homeLink = screen.getByRole('link', { name: '홈' });
    const savedLink = screen.getByRole('link', { name: '저장' });
    expect(homeLink.className).toMatch(/active/);
    expect(savedLink.className).not.toMatch(/active/);
    unmount();

    renderGNB('/saved');
    expect(screen.getByRole('link', { name: '저장' }).className).toMatch(/active/);
  });

  test('GNB에서 제외된 항목(운동 기록, 알림, 다크모드, 프로필, 설정, 위치 등)이 렌더링되지 않는다', () => {
    renderGNB();

    expect(screen.queryByText('운동 기록')).not.toBeInTheDocument();
    expect(screen.queryByText('운동 시작')).not.toBeInTheDocument();
    expect(screen.queryByText('프로필')).not.toBeInTheDocument();
    expect(screen.queryByText('알림')).not.toBeInTheDocument();
    expect(screen.queryByText('다크모드')).not.toBeInTheDocument();
    expect(screen.queryByText('설정')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/알림|다크모드|프로필|위치|설정/)).not.toBeInTheDocument();
  });

  test('비로그인 상태에서 우측에 로그인 버튼을 표시한다', () => {
    renderGNB();

    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  test('로그인 상태에서 우측에 email과 로그아웃 버튼을 표시한다', () => {
    localStorage.setItem(
      'runroute:auth-session',
      JSON.stringify({
        email: 'runner@example.com',
        signedInAt: '2026-08-18T00:00:00.000Z',
      }),
    );

    renderGNB();

    expect(screen.getByText('runner@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});

