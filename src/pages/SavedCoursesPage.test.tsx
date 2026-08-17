import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SavedCoursesPage from './SavedCoursesPage';
import { writeSavedCourseIds } from '../utils/savedCoursesStorage';

describe('SavedCoursesPage (src/pages)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장된 코스 목록과 개수를 렌더링한다', () => {
    writeSavedCourseIds(['buyongcheon']);
    render(
      <MemoryRouter>
        <SavedCoursesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('저장한 코스')).toBeInTheDocument();
    expect(
      screen.getByText('1개의 코스가 저장되어 있습니다'),
    ).toBeInTheDocument();
    expect(screen.getByText('부용천 산책로 코스')).toBeInTheDocument();
  });

  it('저장한 코스를 Home CourseCard와 동일한 카드 목록으로 표시한다', () => {
    writeSavedCourseIds(['buyongcheon', 'jungnangcheon']);
    render(
      <MemoryRouter>
        <SavedCoursesPage />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('더 보기 버튼이 존재하지 않는다', () => {
    writeSavedCourseIds(['buyongcheon']);
    render(
      <MemoryRouter>
        <SavedCoursesPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('button', { name: /더 보기/ }),
    ).not.toBeInTheDocument();
  });

  it('저장 해제 클릭 시 toast 표시 및 즉시 제거된다', async () => {
    writeSavedCourseIds(['buyongcheon']);
    render(
      <MemoryRouter>
        <SavedCoursesPage />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: '부용천 산책로 코스 저장 해제' }),
    );

    expect(screen.queryByText('부용천 산책로 코스')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('코스 저장이 해제되었습니다');
    expect(screen.getByText('아직 저장한 코스가 없습니다')).toBeInTheDocument();
  });
});
