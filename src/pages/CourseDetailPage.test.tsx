import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import CourseDetailPage from './CourseDetailPage';
import SavedPage from './SavedPage';

beforeEach(() => localStorage.clear());

function renderDetail(path: string, isLoading = false) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/courses/:courseId"
          element={<CourseDetailPage isLoading={isLoading} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

test('상세 Hero는 코스 정보와 경로/액션을 모두 제공한다', () => {
  renderDetail('/courses/buyongcheon');

  const hero = screen.getByTestId('course-detail-hero');
  expect(
    within(hero).getByRole('heading', { name: '부용천 산책로 코스' }),
  ).toBeInTheDocument();
  expect(within(hero).getByText('5.2')).toBeInTheDocument();
  expect(within(hero).getByRole('button', { name: '길찾기' })).toBeInTheDocument();
  expect(
    within(hero).getByRole('button', { name: /코스 저장/ }),
  ).toBeInTheDocument();
});

test('선택한 코스의 핵심 정보를 표시한다', () => {
  renderDetail('/courses/buyongcheon');

  expect(
    screen.getByRole('heading', { name: '부용천 산책로 코스' }),
  ).toBeInTheDocument();
  expect(
    screen.getByText('평탄한 수변 산책로를 따라 가볍게 달리기 좋은 코스'),
  ).toBeInTheDocument();
  expect(screen.getByText('5.2')).toBeInTheDocument();
  expect(screen.getByText('35')).toBeInTheDocument();
  expect(screen.getByText('쉬움')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '길찾기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '코스 저장' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '코스 저장' })).toHaveTextContent('저장');
  expect(screen.getByText('안전성')).toBeInTheDocument();
  expect(screen.getByText('노면 상태')).toBeInTheDocument();
  expect(screen.getByText('편의시설')).toBeInTheDocument();
  expect(screen.getByText('분위기')).toBeInTheDocument();
});

test('상세 Action Row는 길찾기 다음 저장 순서로 제공한다', () => {
  renderDetail('/courses/buyongcheon');

  const actions = screen.getByTestId('course-detail-actions');
  const buttons = within(actions).getAllByRole('button');

  expect(buttons[0]).toHaveAccessibleName('길찾기');
  expect(buttons[1]).toHaveAccessibleName('코스 저장');
});

test('태그가 중복 노출되지 않는다', () => {
  renderDetail('/courses/buyongcheon');

  expect(screen.getAllByText('야간안심')).toHaveLength(1);
  expect(screen.getAllByText('평지')).toHaveLength(1);
  expect(screen.getAllByText('수변')).toHaveLength(1);
});

test('Hero 태그는 정적 정보 목록이며 Switch/Button이 아니다', () => {
  renderDetail('/courses/buyongcheon');

  const list = screen.getByRole('list', { name: '코스 특징' });
  const items = within(list).getAllByRole('listitem');
  expect(items).toHaveLength(3);
  expect(within(items[0]).getByText('야간안심')).toBeInTheDocument();
  expect(within(items[1]).getByText('평지')).toBeInTheDocument();
  expect(within(items[2]).getByText('수변')).toBeInTheDocument();

  // 태그는 클릭/토글용 컨트롤이 아니다.
  expect(within(list).queryByRole('button')).not.toBeInTheDocument();
  expect(within(list).queryByRole('checkbox')).not.toBeInTheDocument();
  expect(within(list).queryByRole('switch')).not.toBeInTheDocument();
  const tagElements = within(list).getAllByText(/야간안심|평지|수변/);
  for (const el of tagElements) {
    expect(el).not.toHaveAttribute('aria-pressed');
    expect(el).not.toHaveAttribute('role', 'button');
  }
});

test('거리, 예상 시간, 난이도가 표시된다', () => {
  renderDetail('/courses/buyongcheon');

  expect(screen.getByText('거리')).toBeInTheDocument();
  expect(screen.getByText('5.2')).toBeInTheDocument();
  expect(screen.getByText('km')).toBeInTheDocument();

  expect(screen.getByText('예상 시간')).toBeInTheDocument();
  expect(screen.getByText('35')).toBeInTheDocument();
  expect(screen.getByText('분')).toBeInTheDocument();

  expect(screen.getByText('난이도')).toBeInTheDocument();
  expect(screen.getByText('쉬움')).toBeInTheDocument();
});

test('안전성 정보가 표시된다', () => {
  renderDetail('/courses/buyongcheon');
  const section = within(screen.getByRole('region', { name: '안전성' }));

  expect(section.getByText('조명')).toBeInTheDocument();
  expect(section.getByText('밝음')).toBeInTheDocument();
  expect(section.getByText('주요 구간 가로등 연속 배치')).toBeInTheDocument();
  expect(section.getByText('CCTV')).toBeInTheDocument();
  expect(section.getByText('주요 구간 설치')).toBeInTheDocument();
  expect(section.getByText('5개소')).toBeInTheDocument();
  expect(section.getByText('인적')).toBeInTheDocument();
  expect(section.getByText('보통')).toBeInTheDocument();
  expect(section.getByText('저녁 시간 산책 이용자 있음')).toBeInTheDocument();
  expect(section.getByText('차도 분리')).toBeInTheDocument();
  expect(section.getByText('완전 분리')).toBeInTheDocument();
  expect(section.getByText('수변 전용로 중심')).toBeInTheDocument();
});

test('노면 상태 정보가 표시된다', () => {
  renderDetail('/courses/buyongcheon');
  const section = within(screen.getByRole('region', { name: '노면 상태' }));

  expect(section.getByText('주요 노면')).toBeInTheDocument();
  expect(section.getByText('우레탄')).toBeInTheDocument();
  expect(section.getByText('탄성 포장 중심')).toBeInTheDocument();
  expect(section.getByText('경사')).toBeInTheDocument();
  expect(section.getByText('완만함')).toBeInTheDocument();
  expect(section.getByText('평지 위주')).toBeInTheDocument();
  expect(section.getByText('계단')).toBeInTheDocument();
  expect(section.getByText('없음')).toBeInTheDocument();
});

test('편의시설 정보가 표시된다', () => {
  renderDetail('/courses/buyongcheon');
  const section = within(screen.getByRole('region', { name: '편의시설' }));

  expect(section.getByText('화장실')).toBeInTheDocument();
  expect(section.getByText('2곳')).toBeInTheDocument();
  expect(section.getByText('산책로 입구·중간')).toBeInTheDocument();
  expect(section.getByText('편의점')).toBeInTheDocument();
  expect(section.getByText('3곳')).toBeInTheDocument();
  expect(section.getByText('인근 상가 연결')).toBeInTheDocument();
  expect(section.getByText('개수대')).toBeInTheDocument();
  expect(section.getByText('1곳')).toBeInTheDocument();
  expect(section.getByText('중간 쉼터')).toBeInTheDocument();
  expect(section.getByText('보관함')).toBeInTheDocument();
  expect(section.getByText('없음')).toBeInTheDocument();
  expect(section.getByText('미설치')).toBeInTheDocument();
});

test('분위기 정보가 러닝 환경 카드에 표시된다', () => {
  renderDetail('/courses/buyongcheon');
  const section = within(screen.getByRole('region', { name: '분위기' }));

  expect(section.getByText('분위기')).toBeInTheDocument();
  expect(
    section.getByText('수변 풍경과 야간 조명이 어우러진 차분한 분위기'),
  ).toBeInTheDocument();
});

test('상세 페이지에서 코스를 저장 및 저장 해제할 수 있으며 보이는 라벨은 항상 저장으로 유지된다', async () => {
  const user = userEvent.setup();
  renderDetail('/courses/buyongcheon');

  const saveBtn = screen.getByRole('button', { name: '코스 저장' });
  expect(saveBtn).toHaveAttribute('aria-pressed', 'false');
  expect(saveBtn).toHaveTextContent('저장');
  expect(saveBtn.querySelector('[data-bookmark-state="outline"]')).toBeTruthy();

  await user.click(saveBtn);
  const unsaveBtn = screen.getByRole('button', { name: '코스 저장 해제' });
  expect(unsaveBtn).toHaveAttribute('aria-pressed', 'true');
  expect(unsaveBtn).toHaveTextContent('저장');
  expect(unsaveBtn.querySelector('[data-bookmark-state="filled"]')).toBeTruthy();
  expect(localStorage.getItem('runroute:saved-course-ids')).toContain(
    'buyongcheon',
  );

  await user.click(unsaveBtn);
  const revertedSaveBtn = screen.getByRole('button', { name: '코스 저장' });
  expect(revertedSaveBtn).toHaveAttribute('aria-pressed', 'false');
  expect(revertedSaveBtn).toHaveTextContent('저장');
  expect(revertedSaveBtn.querySelector('[data-bookmark-state="outline"]')).toBeTruthy();
  expect(localStorage.getItem('runroute:saved-course-ids')).not.toContain(
    'buyongcheon',
  );
});

test('저장 시 저장 성공 Toast가 표시된다', async () => {
  const user = userEvent.setup();
  renderDetail('/courses/buyongcheon');

  await user.click(screen.getByRole('button', { name: '코스 저장' }));
  expect(screen.getByText('코스가 저장되었습니다!')).toBeInTheDocument();
  expect(
    screen.getByText('저장한 코스 페이지에서 확인할 수 있어요'),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: '저장한 코스 보기' }),
  ).toBeInTheDocument();
});

test('저장 해제 시 해제 Toast가 표시되고 Undo가 없다', async () => {
  const user = userEvent.setup();
  localStorage.setItem(
    'runroute:saved-course-ids',
    JSON.stringify(['buyongcheon']),
  );
  renderDetail('/courses/buyongcheon');

  await user.click(screen.getByRole('button', { name: '코스 저장 해제' }));
  expect(screen.getByText('코스 저장이 해제되었습니다')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /되돌리기|undo/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: '저장한 코스 보기' }),
  ).not.toBeInTheDocument();
});

test('저장 성공 Toast의 저장한 코스 보기 클릭 시 /saved로 이동한다', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/courses/buyongcheon']}>
      <Routes>
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/saved" element={<SavedPage />} />
      </Routes>
    </MemoryRouter>,
  );

  await user.click(screen.getByRole('button', { name: '코스 저장' }));
  await user.click(
    screen.getByRole('button', { name: '저장한 코스 보기' }),
  );

  expect(
    screen.getByRole('heading', { name: '저장한 코스' }),
  ).toBeInTheDocument();
  expect(screen.getByText('부용천 산책로 코스')).toBeInTheDocument();
});

test('길찾기 클릭 후 Dialog가 열리고 외부 지도 navigation이 발생하지 않는다', async () => {
  const user = userEvent.setup();
  const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  renderDetail('/courses/buyongcheon');

  const directionsBtn = screen.getByRole('button', { name: '길찾기' });
  await user.click(directionsBtn);

  expect(consoleSpy).toHaveBeenCalledWith(
    '[RunRoute event]',
    expect.objectContaining({
      name: 'navigation_click',
      payload: {
        courseId: 'buyongcheon',
        courseName: '부용천 산책로 코스',
      },
    }),
  );

  const dialog = screen.getByRole('dialog', {
    name: '길찾기 기능을 준비하고 있습니다.',
  });
  expect(dialog).toBeInTheDocument();
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(
    screen.getByText(
      '현재 MVP에서는 코스 정보 확인과 길찾기 이용 의향을 우선 검증하고 있습니다.',
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: '코스 상세로 돌아가기' }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '코스 상세로 돌아가기' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  consoleSpy.mockRestore();
});

test('Modal은 ESC 키와 Overlay 클릭으로 닫힌다', async () => {
  const user = userEvent.setup();
  renderDetail('/courses/buyongcheon');

  const directionsBtn = screen.getByRole('button', { name: '길찾기' });
  await user.click(directionsBtn);
  expect(
    screen.getByRole('dialog', { name: '길찾기 기능을 준비하고 있습니다.' }),
  ).toBeInTheDocument();

  await user.keyboard('{Escape}');
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  await user.click(directionsBtn);
  const dialog = screen.getByRole('dialog', {
    name: '길찾기 기능을 준비하고 있습니다.',
  });
  expect(dialog).toBeInTheDocument();

  const overlay = dialog.parentElement!;
  await user.click(overlay);
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

test('Modal Close 후 길찾기 trigger로 focus가 돌아온다', async () => {
  const user = userEvent.setup();
  renderDetail('/courses/buyongcheon');

  const directionsBtn = screen.getByRole('button', { name: '길찾기' });
  directionsBtn.focus();
  await user.click(directionsBtn);

  const closeButton = screen.getByRole('button', { name: '닫기' });
  expect(document.activeElement).toBe(closeButton);

  await user.click(closeButton);
  await waitFor(() => {
    expect(document.activeElement).toBe(directionsBtn);
  });
});

test('존재하지 않는 courseId는 Error State가 나타난다', () => {
  renderDetail('/courses/not-a-course');

  const errorState = screen.getByRole('alert');
  expect(errorState).toBeInTheDocument();
  expect(screen.getByText('코스 정보를 찾을 수 없습니다.')).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: '추천 코스로 돌아가기' }),
  ).toHaveAttribute('href', '/');
  expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument();
});

test('Error State의 CTA로 Home 이동이 가능하다', () => {
  renderDetail('/courses/not-a-course');

  const homeLink = screen.getByRole('link', { name: '추천 코스로 돌아가기' });
  expect(homeLink).toBeInTheDocument();
  expect(homeLink).toHaveAttribute('href', '/');
});

test('isLoading이 true면 Detail Skeleton이 표시되고 Error State는 나타나지 않는다', () => {
  renderDetail('/courses/buyongcheon', true);

  const page = document.querySelector('[aria-busy="true"]');
  expect(page).toBeInTheDocument();
  expect(screen.queryByText('부용천 산책로 코스')).not.toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: '길찾기' }),
  ).not.toBeInTheDocument();
});

test('isLoading이 true이고 존재하지 않는 courseId여도 로딩 중에는 Error State를 보여주지 않는다', () => {
  renderDetail('/courses/not-a-course', true);

  expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('직동근린공원 코스의 경사·계단 정보가 표시된다', () => {
  renderDetail('/courses/jikdong');
  const section = within(screen.getByRole('region', { name: '노면 상태' }));

  expect(section.getByText('일부 있음')).toBeInTheDocument();
  expect(section.getByText('짧은 오르막 반복')).toBeInTheDocument();
  expect(section.getByText('일부 존재')).toBeInTheDocument();
  expect(section.getByText('숲길 연결부 2구간')).toBeInTheDocument();
});

test('추동근린공원 코스의 보관함 정보가 표시된다', () => {
  renderDetail('/courses/chudong');
  const section = within(screen.getByRole('region', { name: '편의시설' }));

  expect(section.getByText('보관함')).toBeInTheDocument();
  expect(section.getByText('1곳')).toBeInTheDocument();
  expect(section.getByText('체육시설 인근')).toBeInTheDocument();
});

test('송산사지 코스의 없음·미설치 편의시설 상태가 표시된다', () => {
  renderDetail('/courses/songsansaji');
  const section = within(screen.getByRole('region', { name: '편의시설' }));

  expect(section.getAllByText('없음')).toHaveLength(2);
  expect(section.getAllByText('미설치')).toHaveLength(2);
});
