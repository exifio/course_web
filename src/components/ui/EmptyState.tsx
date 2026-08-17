import { Link } from 'react-router-dom';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}

export default function EmptyState({
  title,
  description,
  href,
  actionLabel,
}: EmptyStateProps) {
  return (
    <section className={styles.wrapper} aria-label={title}>
      <div className={styles.icon} aria-hidden="true">
        <svg
          className={styles.iconGlyph}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Link to={href} className={styles.action}>
        {actionLabel}
      </Link>
    </section>
  );
}
