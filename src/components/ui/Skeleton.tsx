import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export default function Skeleton({ className = '', width, height }: SkeletonProps) {
  const style = width || height ? { width, height } : undefined;

  return (
    <span
      aria-hidden="true"
      className={className ? `${styles.skeleton} ${className}` : styles.skeleton}
      style={style}
    />
  );
}
