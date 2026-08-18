import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
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
        <Route path="/courses/:courseId" element={<div data-testid="detail">Detail Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CourseCard', () => {
  test('코스명, 거리, 예상 시간, 태그를 렌더링한다', () => {
    renderCard();

    expect(screen.getByText(sampleCourse.name)).toBeInTheDocument();
    expect(screen.getByText(/5\.2km/)).toBeInTheDocument();
    expect(screen.getByText(/약 35분/)).toBeInTheDocument();
    expect(screen.getByText('야간안심')).toBeInTheDocument();
  });

  test('카드 링크 클릭 시 /courses/:courseId로 이동한다', async () => {
    const user = userEvent.setup();
    renderCard();

    const link = screen.getByRole('link', { name: new RegExp(sampleCourse.name) });
    expect(link).toHaveAttribute('href', `/courses/${sampleCourse.id}`);

    await user.click(link);
    expect(screen.getByTestId('detail')).toBeInTheDocument();
  });

  test('저장 버튼 클릭 시 onToggleSaved 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    renderCard({ onToggleSaved: handleToggle });
    const saveBtn = screen.getByRole('button', { name: new RegExp(sampleCourse.name) });
    await user.click(saveBtn);

    expect(handleToggle).toHaveBeenCalledWith(sampleCourse.id);
  });

  test('저장 상태에 따라 버튼 라벨과 aria-pressed 속성이 반영된다', () => {
    const { rerender } = renderCard({ isSaved: false, onToggleSaved: vi.fn() });
    const saveBtn = screen.getByRole('button', {
      name: `${sampleCourse.name} 저장`,
    });
    expect(saveBtn).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <MemoryRouter initialEntries={['/']}>
        <CourseCard course={sampleCourse} isSaved={true} onToggleSaved={vi.fn()} />
      </MemoryRouter>,
    );
    const savedBtn = screen.getByRole('button', {
      name: `${sampleCourse.name} 저장 해제`,
    });
    expect(savedBtn).toHaveAttribute('aria-pressed', 'true');
  });
});
