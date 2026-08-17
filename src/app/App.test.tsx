import { describe, test, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { readSavedCourseIds, writeSavedCourseIds } from '../services/storage';
import { courses } from '../data/courses';
import App from './App';

beforeEach(() => localStorage.clear());

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App Routes', () => {
  test('루트에서 홈을 렌더링한다', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { name: /오늘 어디서 뛰어볼까요/i }),
    ).toBeInTheDocument();
  });

  test('저장 route를 렌더링한다', () => {
    renderAt('/saved');
    expect(
      screen.getByRole('heading', { name: '저장한 코스' }),
    ).toBeInTheDocument();
  });

  test('코스 상세 route를 렌더링한다', () => {
    renderAt('/courses/buyongcheon');
    expect(
      screen.getByRole('heading', { name: '부용천 산책로 코스' }),
    ).toBeInTheDocument();
  });

  test('알 수 없는 URL 접근 시 NotFound 안내를 표시한다', () => {
    renderAt('/invalid-page');
    expect(
      screen.getByRole('heading', { name: '페이지를 찾을 수 없습니다.' }),
    ).toBeInTheDocument();
  });

  test('저장된 코스가 없을 때 Saved 페이지에서 Empty State를 표시한다', () => {
    renderAt('/saved');
    expect(screen.getByText('아직 저장한 코스가 없습니다')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '추천 코스 보러가기' }),
    ).toBeInTheDocument();
  });

  test('저장된 코스가 있을 때 Saved 페이지에서 목록을 표시한다', () => {
    writeSavedCourseIds(['buyongcheon']);
    renderAt('/saved');
    expect(screen.getByText('부용천 산책로 코스')).toBeInTheDocument();
  });
});

describe('End-to-End User Flow Regression', () => {
  test('홈 -> 코스 상세 -> 저장 -> 저장한 코스 -> 상세 재진입 플로우가 정상 동작한다', async () => {
    const user = userEvent.setup();
    renderAt('/');

    const courseLink = screen.getAllByRole('link', {
      name: /부용천 산책로 코스 상세 보기/,
    })[0];
    await user.click(courseLink);

    expect(
      screen.getByRole('heading', { name: '부용천 산책로 코스' }),
    ).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: '코스 저장' });
    await user.click(saveBtn);
    expect(
      screen.getByRole('button', { name: '코스 저장 해제' }),
    ).toBeInTheDocument();
    expect(readSavedCourseIds()).toContain('buyongcheon');

    const gnbNav = screen.getByRole('navigation', { name: '주요 메뉴' });
    const savedNav = within(gnbNav).getByRole('link', { name: '저장한 코스' });
    await user.click(savedNav);

    expect(
      screen.getByRole('heading', { name: '저장한 코스' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('1개의 코스가 저장되어 있습니다'),
    ).toBeInTheDocument();
    expect(screen.getByText('부용천 산책로 코스')).toBeInTheDocument();

    const detailReEntryLink = screen.getByRole('link', {
      name: /부용천 산책로 코스 상세 보기/,
    });
    await user.click(detailReEntryLink);
    expect(
      screen.getByRole('heading', { name: '부용천 산책로 코스' }),
    ).toBeInTheDocument();
  });

  test('상세 -> 길찾기 클릭 -> 안내 Modal -> 확인 닫힘 플로우가 정상 동작한다', async () => {
    const user = userEvent.setup();
    renderAt('/courses/buyongcheon');

    const directionsBtn = screen.getByRole('button', { name: '길찾기' });
    await user.click(directionsBtn);

    const modal = screen.getByRole('dialog', {
      name: '길찾기 기능을 준비하고 있습니다.',
    });
    expect(modal).toBeInTheDocument();
    expect(
      within(modal).getByText(
        '현재 MVP에서는 코스 정보 확인과 길찾기 이용 의향을 우선 검증하고 있습니다.',
      ),
    ).toBeInTheDocument();

    const confirmBtn = within(modal).getByRole('button', {
      name: '코스 상세로 돌아가기',
    });
    await user.click(confirmBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Router / 상태 동기화 검증', () => {
  test('홈에서 북마크 저장하면 Toast 없이 저장되고, 상세 이동 후 저장 상태가 유지된다', async () => {
    const user = userEvent.setup();
    renderAt('/');

    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    const saveButton = within(featuredSection).getByRole('button', {
      name: new RegExp(courses[0].name),
    });
    await user.click(saveButton);

    expect(saveButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(readSavedCourseIds()).toContain('buyongcheon');

    const detailLink = within(featuredSection).getByRole('link', {
      name: `${courses[0].name} 상세 보기`,
    });
    await user.click(detailLink);

    expect(
      screen.getByRole('heading', { name: '부용천 산책로 코스' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '코스 저장 해제' }),
    ).toBeInTheDocument();
  });

  test('상세에서 저장 해제하면 Toast가 표시되고 저장 페이지에서 Empty State가 나타난다', async () => {
    const user = userEvent.setup();
    writeSavedCourseIds(['buyongcheon']);
    renderAt('/courses/buyongcheon');

    await user.click(screen.getByRole('button', { name: '코스 저장 해제' }));

    expect(screen.getByText('코스 저장이 해제되었습니다')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '코스 저장' }),
    ).toBeInTheDocument();
    expect(readSavedCourseIds()).not.toContain('buyongcheon');

    const gnbNav = screen.getByRole('navigation', { name: '주요 메뉴' });
    await user.click(
      within(gnbNav).getByRole('link', { name: '저장한 코스' }),
    );

    expect(
      screen.getByText('아직 저장한 코스가 없습니다'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '추천 코스 보러가기' }),
    ).toHaveAttribute('href', '/');
  });

  test('홈에서 북마크 저장한 코스가 저장 페이지 목록에 나타나고, 해제하면 즉시 Empty State로 전환된다', async () => {
    const user = userEvent.setup();
    renderAt('/');

    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    await user.click(
      within(featuredSection).getByRole('button', {
        name: new RegExp(courses[0].name),
      }),
    );

    const gnbNav = screen.getByRole('navigation', { name: '주요 메뉴' });
    await user.click(
      within(gnbNav).getByRole('link', { name: '저장한 코스' }),
    );

    expect(screen.getByText('부용천 산책로 코스')).toBeInTheDocument();
    expect(
      screen.getByText('1개의 코스가 저장되어 있습니다'),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: '부용천 산책로 코스 저장 해제' }),
    );

    expect(screen.queryByText('부용천 산책로 코스')).not.toBeInTheDocument();
    expect(screen.getByText('코스 저장이 해제되었습니다')).toBeInTheDocument();
    expect(
      screen.getByText('아직 저장한 코스가 없습니다'),
    ).toBeInTheDocument();
  });

  test('새로고침(리마운트) 후에도 저장 상태가 유지된다', async () => {
    const user = userEvent.setup();
    const { unmount } = renderAt('/');

    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    await user.click(
      within(featuredSection).getByRole('button', {
        name: new RegExp(courses[0].name),
      }),
    );

    unmount();
    renderAt('/');

    const remountedFeatured = screen.getByLabelText('오늘의 추천 코스');
    const remountedSaveButton = within(remountedFeatured).getByRole('button', {
      name: new RegExp(courses[0].name),
    });
    expect(remountedSaveButton).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Final Acceptance - Console', () => {
  test('주요 route 렌더링 시 console.error/warning이 발생하지 않는다', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderAt('/');
    renderAt('/courses/buyongcheon');
    writeSavedCourseIds(['buyongcheon']);
    renderAt('/saved');
    renderAt('/courses/not-a-course');

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});

describe('GNB Scope Guard', () => {
  test('제외 항목(운동 기록, 프로필, 알림, 다크모드, 설정, 위치 Utility)이 GNB에 노출되지 않는다', () => {
    renderAt('/');

    const gnb = screen.getByRole('banner');
    expect(within(gnb).queryByText('운동 기록')).not.toBeInTheDocument();
    expect(within(gnb).queryByText('운동 시작')).not.toBeInTheDocument();
    expect(within(gnb).queryByText('프로필')).not.toBeInTheDocument();
    expect(within(gnb).queryByText('알림')).not.toBeInTheDocument();
    expect(within(gnb).queryByText('다크모드')).not.toBeInTheDocument();
    expect(within(gnb).queryByText('설정')).not.toBeInTheDocument();
    expect(within(gnb).queryByText(/의정부시/)).not.toBeInTheDocument();

    expect(within(gnb).getByText('RunRoute')).toBeInTheDocument();
    expect(within(gnb).getByRole('link', { name: '홈' })).toBeInTheDocument();
    expect(
      within(gnb).getByRole('link', { name: '저장한 코스' }),
    ).toBeInTheDocument();
  });
});
