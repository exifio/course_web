import type { ReactNode } from 'react';
import styles from './Metric.module.css';

export interface MetricProps {
  label: string;
  value: ReactNode;
  unit?: string;
  className?: string;
}

export default function Metric({
  label,
  value,
  unit,
  className = '',
}: MetricProps) {
  return (
    <div className={`${styles.metric} ${className}`.trim()}>
      <span className={styles.label}>{label}</span>
      <span className={styles.valueGroup}>
        <strong className={styles.value}>{value}</strong>
        {unit ? <span className={styles.unit}>{unit}</span> : null}
      </span>
    </div>
  );
}
