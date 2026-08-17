import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionsModal } from './DirectionsModal';

describe('DirectionsModal', () => {
  it('isOpen이 false면 렌더링되지 않는다', () => {
    const { container } = render(<DirectionsModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('isOpen이 true면 role="dialog", aria-modal="true"로 렌더링된다', () => {
    render(<DirectionsModal isOpen={true} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('길찾기 기능을 준비하고 있습니다.')).toBeInTheDocument();
    expect(screen.getByText('코스 상세로 돌아가기')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<DirectionsModal isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: '닫기' });
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('코스 상세로 돌아가기 버튼 클릭 시 onClose가 호출된다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<DirectionsModal isOpen={true} onClose={onClose} />);

    const backButton = screen.getByRole('button', { name: '코스 상세로 돌아가기' });
    await user.click(backButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Escape 키 입력 시 onClose가 호출된다', () => {
    const onClose = vi.fn();
    render(<DirectionsModal isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('배경 backdrop 클릭 시 onClose가 호출된다', () => {
    const onClose = vi.fn();
    render(<DirectionsModal isOpen={true} onClose={onClose} />);

    const backdrop = screen.getByRole('presentation');
    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Modal 오픈 시 닫기 버튼에 focus가 이동하고, 닫힐 때 이전 focus로 복귀한다', () => {
    const button = document.createElement('button');
    button.textContent = '길찾기 버튼';
    document.body.appendChild(button);
    button.focus();
    expect(document.activeElement).toBe(button);

    const { unmount } = render(<DirectionsModal isOpen={true} onClose={() => {}} />);
    const closeBtn = screen.getByRole('button', { name: '닫기' });
    expect(document.activeElement).toBe(closeBtn);

    unmount();
    expect(document.activeElement).toBe(button);
    document.body.removeChild(button);
  });
});
