import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Chip.module.css';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: ReactNode;
}

export default function Chip({
  selected = false,
  className = '',
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ''} ${className}`.trim()}
      aria-pressed={selected}
      {...props}
    >
      {children}
    </button>
  );
}
