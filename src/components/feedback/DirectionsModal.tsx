import { useEffect, useRef } from 'react';
import styles from './DirectionsModal.module.css';

export interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DirectionsModal({ isOpen, onClose }: DirectionsModalProps) {
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

  if (!isOpen) return null;

  return (
    <div
      className={`modal-backdrop ${styles.backdrop}`}
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className={`directions-modal ${styles.modal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="directions-title"
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
        <div className={styles.icon} aria-hidden="true">
          ↗
        </div>
        <h2 id="directions-title" className={styles.title}>
          길찾기 기능을 준비하고 있습니다.
        </h2>
        <p className={styles.description}>
          현재 MVP에서는 코스 정보 확인과 길찾기 이용 의향을 우선 검증하고 있습니다.
        </p>
        <button
          type="button"
          className={`button button-primary ${styles.actionButton}`}
          onClick={onClose}
        >
          코스 상세로 돌아가기
        </button>
      </section>
    </div>
  );
}

export default DirectionsModal;
