import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CourseDetailPage from '../../pages/CourseDetailPage';

function renderDetail(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/courses/:courseId"
          element={<CourseDetailPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

test('상세 페이지 미디어 영역은 경로 이미지가 첫 슬라이드로 표시된다', () => {
  renderDetail('/courses/buyongcheon');

  const media = screen.getByTestId('course-detail-media');
  expect(media).toBeInTheDocument();

  const carousel = media.querySelector('[aria-roledescription="carousel"]');
  expect(carousel).toBeTruthy();

  const slides = media.querySelectorAll('[aria-roledescription="slide"]');
  expect(slides).toHaveLength(2);

  const firstSlide = slides[0];
  expect(firstSlide).toHaveTextContent('경로');

  const routeImg = screen.getByAltText('부용천 산책로 코스 경로 이미지');
  expect(routeImg).toHaveAttribute(
    'src',
    '/course-images/buyongcheon-route.png',
  );
});

test('캐러셀은 경로 이미지와 대표 이미지 두 슬라이드를 제공한다', () => {
  renderDetail('/courses/buyongcheon');

  expect(screen.getByAltText('부용천 산책로 코스 경로 이미지')).toBeInTheDocument();
  expect(screen.getByAltText('부용천 산책로 코스 대표 이미지')).toBeInTheDocument();
});

test('인디케이터는 첫 슬라이드에서 첫 번째가 활성 상태이다', () => {
  renderDetail('/courses/buyongcheon');

  const dots = screen.getAllByRole('tab');
  expect(dots).toHaveLength(2);
  expect(dots[0]).toHaveAttribute('aria-selected', 'true');
  expect(dots[1]).toHaveAttribute('aria-selected', 'false');
});

test('다음 이미지 버튼 클릭 시 두 번째 슬라이드가 활성화된다', () => {
  renderDetail('/courses/buyongcheon');

  const nextButton = screen.getByRole('button', { name: '다음 이미지' });
  expect(nextButton).not.toBeDisabled();

  fireEvent.click(nextButton);

  const dots = screen.getAllByRole('tab');
  expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  expect(dots[0]).toHaveAttribute('aria-selected', 'false');
});

test('첫 슬라이드에서 이전 이미지 버튼은 비활성화된다', () => {
  renderDetail('/courses/buyongcheon');

  const prevButton = screen.getByRole('button', { name: '이전 이미지' });
  expect(prevButton).toBeDisabled();
});
