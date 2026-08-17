import { useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastVariant = 'saved' | 'unsaved';

const TOAST_CONTENT: Record<ToastVariant, { title: string; description: string }> = {
  saved: {
    title: '코스가 저장되었습니다!',
    description: '저장한 코스 페이지에서 확인할 수 있어요',
  },
  unsaved: {
    title: '코스 저장이 해제되었습니다',
    description: '저장한 코스 목록에서 제거되었어요',
  },
};

export interface ToastProps {
  variant: ToastVariant | null;
  onClose: () => void;
  onViewSaved?: () => void;
  /** 자동 닫힘 시간 (ms). 기본 3500ms */
  duration?: number;
}

export function Toast({
  variant,
  onClose,
  onViewSaved,
  duration = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!variant) return undefined;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [variant, duration, onClose]);

  if (!variant) return null;

  const { title, description } = TOAST_CONTENT[variant];
  const showViewSaved = variant === 'saved' && Boolean(onViewSaved);

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <div className={styles.contentRow}>
        <span
          className={`${styles.icon} ${
            variant === 'saved' ? styles.iconSaved : styles.iconUnsaved
          }`}
          aria-hidden="true"
        >
          {variant === 'saved' ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </span>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      <div className={styles.actions}>
        {showViewSaved && (
          <button
            type="button"
            className={styles.viewSaved}
            onClick={() => {
              onClose();
              onViewSaved?.();
            }}
          >
            저장한 코스 보기
          </button>
        )}
        <button type="button" className={styles.close} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default Toast;
