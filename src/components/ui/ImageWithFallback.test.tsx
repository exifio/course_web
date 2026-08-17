import { fireEvent, render, screen } from '@testing-library/react';
import ImageWithFallback from './ImageWithFallback';

test('이미지 실패 시 의도된 fallback을 표시한다', () => {
  render(<ImageWithFallback src="/broken.webp" alt="코스" />);
  fireEvent.error(screen.getByRole('img', { name: '코스' }));
  expect(screen.getByText('코스 이미지 준비 중')).toBeInTheDocument();
});

test('정상 이미지일 때는 img 태그를 렌더링한다', () => {
  render(<ImageWithFallback src="/valid.webp" alt="코스 이미지" />);
  const img = screen.getByRole('img', { name: '코스 이미지' });
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', '/valid.webp');
});
