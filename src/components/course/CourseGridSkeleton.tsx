import Skeleton from '../ui/Skeleton';
import styles from './CourseGridSkeleton.module.css';

interface CourseGridSkeletonProps {
  count?: number;
}

function CourseCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.content}>
        <Skeleton className={styles.title} width="80%" />
        <Skeleton className={styles.meta} width="55%" />
        <div className={styles.tags}>
          <Skeleton className={styles.tag} />
          <Skeleton className={styles.tag} />
        </div>
      </div>
    </div>
  );
}

export default function CourseGridSkeleton({ count = 6 }: CourseGridSkeletonProps) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }, (_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
