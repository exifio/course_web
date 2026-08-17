import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SavedPage from './SavedPage';

beforeEach(() => localStorage.clear());

test('저장 항목이 없으면 Empty State를 표시한다', () => {
  render(
    <MemoryRouter>
      <SavedPage />
    </MemoryRouter>,
  );
  expect(screen.getByText('아직 저장한 코스가 없습니다')).toBeInTheDocument();
  expect(
    screen.getByText('마음에 드는 코스를 저장해보세요'),
  ).toBeInTheDocument();
  const cta = screen.getByRole('link', { name: '추천 코스 보러가기' });
  expect(cta).toBeInTheDocument();
  expect(cta).toHaveAttribute('href', '/');
});

test('저장한 코스 목록을 표시하고 개수, 상세 링크, 해제 동작을 검증한다', async () => {
  localStorage.setItem(
    'runroute:saved-course-ids',
    JSON.stringify(['buyongcheon', 'jungnangcheon']),
  );
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SavedPage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '저장한 코스' })).toBeInTheDocument();
  expect(
    screen.getByText('2개의 코스가 저장되어 있습니다'),
  ).toBeInTheDocument();
  expect(screen.getByText('부용천 산책로 코스')).toBeInTheDocument();
  expect(screen.getByText('중랑천 하천길 코스')).toBeInTheDocument();

  const detailLink = screen.getByRole('link', {
    name: /부용천 산책로 코스 상세 보기/,
  });
  expect(detailLink).toHaveAttribute('href', '/courses/buyongcheon');

  const removeButtons = screen.getAllByRole('button', { name: /저장 해제/ });
  await user.click(removeButtons[0]);

  expect(
    screen.getByText('1개의 코스가 저장되어 있습니다'),
  ).toBeInTheDocument();
  expect(screen.queryByText('부용천 산책로 코스')).not.toBeInTheDocument();
  expect(screen.getByText('중랑천 하천길 코스')).toBeInTheDocument();

  const lastRemoveButton = screen.getByRole('button', { name: /저장 해제/ });
  await user.click(lastRemoveButton);

  expect(screen.getByText('아직 저장한 코스가 없습니다')).toBeInTheDocument();
});

test('잘못된 저장 ID가 있어도 유효한 코스만 렌더링한다', () => {
  localStorage.setItem(
    'runroute:saved-course-ids',
    JSON.stringify(['non-existent-course-id', 'buyongcheon']),
  );
  render(
    <MemoryRouter>
      <SavedPage />
    </MemoryRouter>,
  );

  expect(
    screen.getByText('1개의 코스가 저장되어 있습니다'),
  ).toBeInTheDocument();
  expect(screen.getByText('부용천 산책로 코스')).toBeInTheDocument();
});
