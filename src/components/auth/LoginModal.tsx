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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const success = auth.login(email, password);
    if (!success) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    onClose();
  }

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
          RunRoute 로그인
        </h2>
        <p className={styles.notice}>
          MVP 데모 로그인입니다. 입력한 정보는 서버로 전송되지 않습니다.
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <Button type="submit" size="cta" className={styles.submit}>
            로그인
          </Button>
        </form>
      </section>
    </div>
  );
}
