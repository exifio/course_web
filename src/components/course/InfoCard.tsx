import type { ReactNode } from 'react';
import styles from './InfoCard.module.css';

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
