import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CourseCard from './CourseCard';
import { courses } from '../../data/courses';

const sampleCourse = courses[0];

function renderCard(
  props: { isSaved?: boolean; onToggleSaved?: (courseId: string) => void } = {},
) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<CourseCard course={sampleCourse} {...props} />} />
        <Route path="/courses/:courseId" element={<div data-testid="detail">Detail</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CourseCard', () => {
  test('코스명과 거리·시간·태그를 표시한다', () => {
    renderCard();
    expect(screen.getByText(sampleCourse.name)).toBeInTheDocument();
    expect(screen.getByText(/5\.2km/)).toBeInTheDocument();
    expect(screen.getByText(/야간안심/)).toBeInTheDocument();
  });

  test('카드 클릭 시 코스 상세 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole('link', { name: /부용천 산책로 코스 상세 보기/ }));
    expect(screen.getByTestId('detail')).toBeInTheDocument();
  });

  test('저장 버튼이 제공되면 클릭 시 토글 콜백을 호출한다', async () => {
    const user = userEvent.setup();
    const onToggleSaved = vi.fn();
    renderCard({ onToggleSaved });

    await user.click(screen.getByRole('button', { name: /부용천 산책로 코스 저장/ }));
    expect(onToggleSaved).toHaveBeenCalledWith(sampleCourse.id);
  });

  test('저장 상태에 따라 aria-pressed와 라벨이 변경된다', () => {
    renderCard({ isSaved: true, onToggleSaved: vi.fn() });
    const button = screen.getByRole('button', { name: /부용천 산책로 코스 저장 해제/ });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
