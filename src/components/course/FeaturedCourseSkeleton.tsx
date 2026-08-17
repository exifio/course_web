import Skeleton from '../ui/Skeleton';
import styles from './FeaturedCourseSkeleton.module.css';

export default function FeaturedCourseSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.content}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.line} width="90%" />
        <Skeleton className={styles.line} width="70%" />
        <div className={styles.tags}>
          <Skeleton className={styles.tag} />
          <Skeleton className={styles.tag} />
          <Skeleton className={styles.tag} />
        </div>
        <Skeleton className={styles.cta} width="140px" />
      </div>
    </div>
  );
}
