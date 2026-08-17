import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeaturedCourseSkeleton from './FeaturedCourseSkeleton';
import CourseGridSkeleton from './CourseGridSkeleton';
import CourseDetailSkeleton from './CourseDetailSkeleton';

describe('Course Skeletons', () => {
  test('FeaturedCourseSkeleton은 스크린리더에서 숨겨지고 텍스트를 포함하지 않는다', () => {
    const { container } = render(<FeaturedCourseSkeleton />);

    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton.textContent).toBe('');
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(
      0,
    );
  });

  test('CourseGridSkeleton은 count만큼 카드 스켈레톤을 렌더링한다', () => {
    const { container } = render(<CourseGridSkeleton count={4} />);

    const grid = container.firstElementChild as HTMLElement;
    expect(grid.children).toHaveLength(4);
    for (const card of Array.from(grid.children)) {
      expect(card).toHaveAttribute('aria-hidden', 'true');
      expect(card.textContent).toBe('');
    }
  });

  test('CourseDetailSkeleton은 스크린리더에서 숨겨지고 텍스트를 포함하지 않는다', () => {
    const { container } = render(<CourseDetailSkeleton />);

    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton.textContent).toBe('');
  });
});
