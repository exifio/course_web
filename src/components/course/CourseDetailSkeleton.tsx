import Skeleton from '../ui/Skeleton';
import styles from './CourseDetailSkeleton.module.css';

function InfoCardSkeleton() {
  return (
    <div className={styles.infoCard} aria-hidden="true">
      <Skeleton className={styles.infoCardTitle} width="45%" />
      <Skeleton className={styles.infoLine} />
      <Skeleton className={styles.infoLine} width="85%" />
      <Skeleton className={styles.infoLine} width="70%" />
      <Skeleton className={styles.infoLine} width="78%" />
    </div>
  );
}

export default function CourseDetailSkeleton() {
  return (
    <div aria-hidden="true">
      <section className={styles.hero}>
        <div className={styles.summary}>
          <Skeleton className={styles.title} width="70%" />
          <Skeleton className={styles.line} width="95%" />
          <Skeleton className={styles.line} width="75%" />
          <div className={styles.tagRow}>
            <Skeleton className={styles.tag} />
            <Skeleton className={styles.tag} />
            <Skeleton className={styles.tag} />
          </div>
          <div className={styles.metricsRow}>
            <Skeleton className={styles.metric} />
            <Skeleton className={styles.metric} />
            <Skeleton className={styles.metric} />
          </div>
        </div>
        <div className={styles.routeColumn}>
          <div className={styles.routeImage} />
          <div className={styles.actions}>
            <Skeleton className={styles.actionButton} />
            <Skeleton className={styles.actionButton} />
          </div>
        </div>
      </section>

      <section className={styles.infoGrid}>
        <InfoCardSkeleton />
        <InfoCardSkeleton />
        <InfoCardSkeleton />
      </section>
    </div>
  );
}
