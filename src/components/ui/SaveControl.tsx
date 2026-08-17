import type { ButtonHTMLAttributes } from 'react';
import styles from './SaveControl.module.css';

export interface SaveControlProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  saved: boolean;
  onToggle: () => void;
  courseName?: string;
  className?: string;
}

export default function SaveControl({
  saved,
  onToggle,
  courseName,
  className = '',
  ...props
}: SaveControlProps) {
  const label = courseName
    ? (saved ? `${courseName} 저장 해제` : `${courseName} 저장`)
    : (saved ? '코스 저장 해제' : '코스 저장');

  return (
    <button
      type="button"
      className={`${styles.saveControl} ${saved ? styles.saved : ''} ${className}`.trim()}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={saved}
      {...props}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
