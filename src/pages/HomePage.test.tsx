import { describe, test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { courses } from '../data/courses';
import { getFeaturedCourse, getOtherCourses } from '../features/courses/courseSelectors';

function renderHomePage(isLoading = false) {
  return render(
    <MemoryRouter>
      <HomePage isLoading={isLoading} />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  test('위치 문맥과 Hero 제목, 추천 코스를 모두 렌더링한다', () => {
    renderHomePage();

    expect(screen.getByText(/의정부시/)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /오늘 어디서 뛰어볼까요\?/ }),
    ).toBeInTheDocument();

    for (const course of courses) {
      expect(
        screen.getAllByRole('link', { name: new RegExp(course.name) }).length,
      ).toBeGreaterThan(0);
    }
  });

  test('오늘의 추천 코스(Featured) 영역이 렌더링된다', () => {
    renderHomePage();

    const featured = getFeaturedCourse(courses)!;
    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    expect(
      within(featuredSection).getByText('오늘의 추천 코스'),
    ).toBeInTheDocument();
    expect(
      within(featuredSection).getByText(featured.name),
    ).toBeInTheDocument();
    expect(
      within(featuredSection).getByText(featured.summary),
    ).toBeInTheDocument();
    expect(
      within(featuredSection).getByText('상세 보기'),
    ).toBeInTheDocument();
  });

  test('다른 추천 코스 영역이 렌더링된다', () => {
    renderHomePage();

    const recommendSection = screen.getByLabelText('다른 추천 코스');
    expect(
      within(recommendSection).getByText('다른 추천 코스'),
    ).toBeInTheDocument();
    expect(
      within(recommendSection).getByRole('group', { name: '코스 필터' }),
    ).toBeInTheDocument();
  });

  test('오늘의 추천 코스가 다른 추천 코스 목록에 중복되지 않는다', () => {
    renderHomePage();

    const featured = getFeaturedCourse(courses)!;
    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    const otherSection = screen.getByLabelText('다른 추천 코스');

    expect(within(featuredSection).getByText(featured.name)).toBeInTheDocument();
    expect(within(otherSection).queryByText(featured.name)).not.toBeInTheDocument();
  });

  test('카테고리 Chip 필터가 정상 동작하며 필터 변경 후에도 Featured 코스가 중복되지 않는다', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const featured = getFeaturedCourse(courses)!;
    const otherCourses = getOtherCourses(courses, featured.id);

    const safetyChip = screen.getByRole('button', { name: '안전성' });
    await user.click(safetyChip);
    expect(safetyChip).toHaveAttribute('aria-pressed', 'true');

    const otherSection = screen.getByLabelText('다른 추천 코스');
    // Featured course should still not be in otherSection
    expect(within(otherSection).queryByText(featured.name)).not.toBeInTheDocument();

    const filtered = otherCourses.filter((c) => c.categories.includes('안전성'));
    for (const course of filtered) {
      expect(
        within(otherSection).getByRole('link', { name: new RegExp(course.name) }),
      ).toBeInTheDocument();
    }

    const excluded = otherCourses.filter((c) => !c.categories.includes('안전성'));
    for (const course of excluded) {
      expect(
        within(otherSection).queryByRole('link', { name: new RegExp(course.name) }),
      ).not.toBeInTheDocument();
    }

    const allChip = screen.getByRole('button', { name: '전체' });
    await user.click(allChip);
    expect(allChip).toHaveAttribute('aria-pressed', 'true');
    expect(within(otherSection).queryByText(featured.name)).not.toBeInTheDocument();
    for (const course of otherCourses) {
      expect(
        within(otherSection).getByRole('link', { name: new RegExp(course.name) }),
      ).toBeInTheDocument();
    }
  });

  test('홈 북마크 저장/해제가 동작한다', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const featured = getFeaturedCourse(courses)!;
    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    const saveButton = within(featuredSection).getByRole('button', {
      name: new RegExp(featured.name),
    });
    expect(saveButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(saveButton);
    expect(saveButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(saveButton);
    expect(saveButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('홈 북마크에 Toast가 나타나지 않는다', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const featured = getFeaturedCourse(courses)!;
    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    const saveButton = within(featuredSection).getByRole('button', {
      name: new RegExp(featured.name),
    });
    await user.click(saveButton);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('북마크 클릭 시 상세 페이지로 이동하지 않는다', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const featured = getFeaturedCourse(courses)!;
    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    const saveButton = within(featuredSection).getByRole('button', {
      name: new RegExp(featured.name),
    });
    await user.click(saveButton);

    expect(
      screen.getByRole('heading', { name: /오늘 어디서 뛰어볼까요\?/ }),
    ).toBeInTheDocument();
  });

  test('카드 본문 클릭 시 상세 페이지로 이동한다', () => {
    renderHomePage();

    const featured = getFeaturedCourse(courses)!;
    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    const detailLink = within(featuredSection).getByRole('link', {
      name: `${featured.name} 상세 보기`,
    });
    expect(detailLink).toHaveAttribute('href', `/courses/${featured.id}`);
  });

  test('RunRoute 코스 정보 가이드 섹션을 표시하지 않는다', () => {
    renderHomePage();

    expect(
      screen.queryByText('RunRoute 코스 정보 가이드'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('코스 선택 가이드'),
    ).not.toBeInTheDocument();
  });

  test('Mock Data 안내를 표시한다', () => {
    renderHomePage();
    expect(
      screen.getByText(/MVP 검증을 위한 샘플 데이터/),
    ).toBeInTheDocument();
  });

  test('각 카드에 거리와 예상 시간이 표시된다', () => {
    renderHomePage();
    expect(screen.getAllByText(/5\.2km/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/약 35분/).length).toBeGreaterThan(0);
  });

  test('isLoading이 true면 Featured/Grid Skeleton이 표시되고 코스 정보는 렌더링되지 않는다', () => {
    renderHomePage(true);

    const featuredSection = screen.getByLabelText('오늘의 추천 코스');
    const recommendSection = screen.getByLabelText('다른 추천 코스');

    expect(featuredSection).toHaveAttribute('aria-busy', 'true');
    expect(recommendSection).toHaveAttribute('aria-busy', 'true');

    for (const course of courses) {
      expect(screen.queryByText(course.name)).not.toBeInTheDocument();
    }

    expect(
      screen.queryByRole('group', { name: '코스 필터' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /상세 보기/ }),
    ).not.toBeInTheDocument();
  });

  test('isLoading이 true여도 인위적인 지연 없이 즉시 Skeleton이 마운트된다', () => {
    renderHomePage(true);

    expect(screen.getByLabelText('오늘의 추천 코스')).toBeInTheDocument();
    expect(screen.getByLabelText('다른 추천 코스')).toBeInTheDocument();
  });
});