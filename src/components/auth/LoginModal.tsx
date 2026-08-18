import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import Button from '../ui/Button';
import styles from './LoginModal.module.css';

export interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LoginModal(props: LoginModalProps) {
  const auth = useAuth();
  const isOpen = props.isOpen ?? auth.isLoginModalOpen;
  const onClose = props.onClose ?? auth.closeLoginModal;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setMode('login');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (mode === 'signup') {
      if (!trimmedEmail || !password || !passwordConfirm) {
        setError('모든 항목을 입력해주세요.');
        return;
      }
      if (password !== passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
    } else {
      if (!trimmedEmail || !password) {
        setError('이메일과 비밀번호를 모두 입력해주세요.');
        return;
      }
    }

    const success = auth.login(trimmedEmail, password);
    if (!success) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    onClose();
  }

  const isLoginMode = mode === 'login';

  return (
    <div
      className={`modal-backdrop ${styles.backdrop}`}
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        <h2 id="login-modal-title" className={styles.title}>
          {isLoginMode ? 'RunRoute 로그인' : 'RunRoute 회원가입'}
        </h2>
        <p className={styles.subtitle}>
          {isLoginMode
            ? '나만의 러닝 코스를 저장하고 관리해보세요'
            : '간편하게 가입하고 나만의 러닝 코스를 관리해보세요'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-modal-email">
              이메일
            </label>
            <input
              id="login-modal-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-modal-password">
              비밀번호
            </label>
            <input
              id="login-modal-password"
              className={styles.input}
              type="password"
              autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLoginMode && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-modal-password-confirm">
                비밀번호 확인
              </label>
              <input
                id="login-modal-password-confirm"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                placeholder="비밀번호를 한 번 더 입력해주세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          )}

          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <Button type="submit" size="cta" className={styles.submit}>
            {isLoginMode ? '로그인' : '회원가입'}
          </Button>
        </form>

        <div className={styles.switchBox}>
          <span className={styles.switchPrompt}>
            {isLoginMode ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          </span>
          <button
            type="button"
            className={styles.switchButton}
            onClick={() => {
              setMode(isLoginMode ? 'signup' : 'login');
              setError(null);
            }}
          >
            {isLoginMode ? '회원가입' : '로그인'}
          </button>
        </div>
      </section>
    </div>
  );
}
