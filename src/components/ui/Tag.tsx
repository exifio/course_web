import type { ReactNode } from 'react';
import styles from './Tag.module.css';

type TagVariant = 'default' | 'accent' | 'brand';

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
}

export default function Tag({ children, variant = 'default' }: TagProps) {
  const variantClass = styles[variant];
  return <span className={`${styles.tag} ${variantClass}`.trim()}>{children}</span>;
}
