import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthContext';
import LoginModal from './LoginModal';

function renderLoginModal(isOpen = true) {
  const onClose = vi.fn();
  const result = render(
    <MemoryRouter>
      <AuthProvider>
        <LoginModal isOpen={isOpen} onClose={onClose} />
      </AuthProvider>
    </MemoryRouter>,
  );
  return { ...result, onClose };
}

import { vi } from 'vitest';

beforeEach(() => localStorage.clear());

describe('LoginModal', () => {
  it('isOpen이 false이면 렌더링하지 않는다', () => {
    renderLoginModal(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('isOpen이 true이면 dialog를 렌더링한다', () => {
    renderLoginModal(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('데모 로그인 안내 문구를 표시한다', () => {
    renderLoginModal();
    expect(screen.getByText(/MVP 데모 로그인입니다/)).toBeInTheDocument();
  });

  it('이메일과 비밀번호 입력 필드와 로그인 버튼을 표시한다', () => {
    renderLoginModal();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose를 호출한다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderLoginModal();

    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ESC 키 입력 시 onClose를 호출한다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderLoginModal();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('빈 입력으로 제출하면 에러를 표시한다', async () => {
    const user = userEvent.setup();
    renderLoginModal();

    await user.click(screen.getByRole('button', { name: '로그인' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/모두 입력/);
  });

  it('유효한 입력으로 로그인하면 onClose를 호출하고 세션이 저장된다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderLoginModal();

    await user.type(screen.getByLabelText('이메일'), 'runner@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'demo');
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('runroute:auth-session')).not.toBeNull();
  });
});
