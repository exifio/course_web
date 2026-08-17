import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GNB from './GNB';

describe('GNB Component', () => {
  test('RunRoute 로고와 허용된 메뉴(홈, 저장한 코스)만 렌더링한다', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <GNB />
      </MemoryRouter>,
    );

    expect(screen.getByText('RunRoute')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '저장한 코스' })).toBeInTheDocument();
  });

  test('/와 /courses/:id에서는 홈이 active이고, /saved에서는 저장한 코스가 active이다', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/courses/buyongcheon']}>
        <GNB />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link', { name: '홈' });
    const savedLink = screen.getByRole('link', { name: '저장한 코스' });
    expect(homeLink.className).toMatch(/active/);
    expect(savedLink.className).not.toMatch(/active/);
    unmount();

    render(
      <MemoryRouter initialEntries={['/saved']}>
        <GNB />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: '저장한 코스' }).className).toMatch(/active/);
  });

  test('GNB에서 제외된 항목(운동 기록, 알림, 다크모드, 프로필, 설정, 위치 등)이 렌더링되지 않는다', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <GNB />
      </MemoryRouter>,
    );

    expect(screen.queryByText('운동 기록')).not.toBeInTheDocument();
    expect(screen.queryByText('운동 시작')).not.toBeInTheDocument();
    expect(screen.queryByText('프로필')).not.toBeInTheDocument();
    expect(screen.queryByText('알림')).not.toBeInTheDocument();
    expect(screen.queryByText('다크모드')).not.toBeInTheDocument();
    expect(screen.queryByText('설정')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/알림|다크모드|프로필|위치|설정/)).not.toBeInTheDocument();
  });
});
