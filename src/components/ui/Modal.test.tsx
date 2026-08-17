import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import Button from './Button';
import Modal from './Modal';

function ModalTestWrapper({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        모달 열기
      </button>
      {open && (
        <Modal
          title="길찾기 기능 안내"
          onClose={() => {
            setOpen(false);
            onClose();
          }}
        >
          <p>현재 MVP에서는 실제 지도 앱 연동을 제공하지 않습니다.</p>
          <p>추후 업데이트에서 외부 지도 길찾기를 지원할 예정입니다.</p>
          <Button
            variant="primary"
            onClick={() => {
              setOpen(false);
              onClose();
            }}
          >
            확인
          </Button>
        </Modal>
      )}
    </div>
  );
}

describe('Modal', () => {
  test('open=false일 때 렌더링되지 않는다', () => {
    render(<ModalTestWrapper />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('open=true일 때 role="dialog", aria-modal="true"가 적용되고 첫 번째 포커스 가능 요소에 포커스된다', async () => {
    const user = userEvent.setup();
    render(<ModalTestWrapper />);

    await user.click(screen.getByRole('button', { name: '모달 열기' }));

    const dialog = screen.getByRole('dialog', { name: '길찾기 기능 안내' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const confirmBtn = screen.getByRole('button', { name: '확인' });
    expect(confirmBtn).toHaveFocus();
  });

  test('확인 버튼 클릭 시 onClose가 호출되고 모달이 닫히며 이전 트리거로 포커스가 복원된다', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ModalTestWrapper onClose={handleClose} />);

    const triggerBtn = screen.getByRole('button', { name: '모달 열기' });
    await user.click(triggerBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(triggerBtn).toHaveFocus();
  });

  test('Escape 키 입력 시 모달이 닫힌다', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ModalTestWrapper onClose={handleClose} />);

    await user.click(screen.getByRole('button', { name: '모달 열기' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('배경(Overlay) 클릭 시 모달이 닫힌다', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ModalTestWrapper onClose={handleClose} />);

    await user.click(screen.getByRole('button', { name: '모달 열기' }));
    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement!;

    await user.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
