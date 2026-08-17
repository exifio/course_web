import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast (자동 닫힘 타이머)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('기본 3500ms 후에 onClose가 호출된다', () => {
    const onClose = vi.fn();
    render(<Toast variant="saved" onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(3499);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Toast', () => {
  it('variant가 "saved"면 저장 성공 Toast를 role="status", aria-live="polite"로 렌더링한다', () => {
    render(<Toast variant="saved" onClose={() => {}} onViewSaved={() => {}} />);
    const toast = screen.getByRole('status');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('코스가 저장되었습니다!')).toBeInTheDocument();
    expect(
      screen.getByText('저장한 코스 페이지에서 확인할 수 있어요'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '저장한 코스 보기' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
  });

  it('variant가 "unsaved"면 해제 Toast를 렌더링하며 Undo와 저장한 코스 보기가 없다', () => {
    render(<Toast variant="unsaved" onClose={() => {}} />);
    expect(screen.getByText('코스 저장이 해제되었습니다')).toBeInTheDocument();
    expect(
      screen.getByText('저장한 코스 목록에서 제거되었어요'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '저장한 코스 보기' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /되돌리기|undo/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
  });

  it('variant가 null이면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<Toast variant={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('닫기 버튼으로 즉시 닫을 수 있다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Toast variant="unsaved" onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('저장한 코스 보기 클릭 시 onClose와 onViewSaved가 함께 호출된다', async () => {
    const onClose = vi.fn();
    const onViewSaved = vi.fn();
    const user = userEvent.setup();
    render(
      <Toast variant="saved" onClose={onClose} onViewSaved={onViewSaved} />,
    );

    await user.click(
      screen.getByRole('button', { name: '저장한 코스 보기' }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onViewSaved).toHaveBeenCalledTimes(1);
  });
});
