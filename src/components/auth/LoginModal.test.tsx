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

  it('이메일과 비밀번호 입력 필드와 로그인 버튼을 표시한다', () => {
    renderLoginModal();
    expect(screen.getByText('나만의 러닝 코스를 저장하고 관리해보세요')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일을 입력해주세요')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호를 입력해주세요')).toBeInTheDocument();
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

  it('회원가입 모드로 전환 시 제목, 비밀번호 확인 필드, 회원가입 버튼이 표시된다', async () => {
    const user = userEvent.setup();
    renderLoginModal();

    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(screen.getByRole('heading', { name: 'RunRoute 회원가입' })).toBeInTheDocument();
    expect(screen.getByText('간편하게 가입하고 나만의 러닝 코스를 관리해보세요')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호를 한 번 더 입력해주세요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByText('이미 계정이 있으신가요?')).toBeInTheDocument();
  });

  it('회원가입 시 비밀번호가 일치하지 않으면 에러를 표시한다', async () => {
    const user = userEvent.setup();
    renderLoginModal();

    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await user.type(screen.getByLabelText('이메일'), 'newrunner@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password456');
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(screen.getByRole('alert')).toHaveTextContent('비밀번호가 일치하지 않습니다.');
    expect(localStorage.getItem('runroute:auth-session')).toBeNull();
  });

  it('유효한 회원가입 입력 시 세션이 생성되고 onClose가 호출된다', async () => {
    const user = userEvent.setup();
    const { onClose } = renderLoginModal();

    await user.click(screen.getByRole('button', { name: '회원가입' }));

    await user.type(screen.getByLabelText('이메일'), 'newrunner@example.com');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123');
    await user.click(screen.getByRole('button', { name: '회원가입' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    const session = JSON.parse(localStorage.getItem('runroute:auth-session') ?? '{}');
    expect(session.email).toBe('newrunner@example.com');
  });
});
