import type { ReactNode } from 'react';
import { splitDisplayValue } from './splitDisplayValue';
import styles from './CourseInfoSection.module.css';

export interface CourseInfoItem {
  label: string;
  value: string | undefined | null;
  icon?: ReactNode;
}

export interface CourseInfoSectionProps {
  title: string;
  icon?: ReactNode;
  items?: (
    | [label: string, value: string | undefined | null]
    | [label: string, value: string | undefined | null, icon?: ReactNode]
    | CourseInfoItem
  )[];
  tags?: string[];
  description?: string;
  children?: ReactNode;
  className?: string;
}

export default function CourseInfoSection({
  title,
  icon,
  items,
  tags,
  description,
  children,
  className = '',
}: CourseInfoSectionProps) {
  return (
    <section className={`${styles.section} ${className}`.trim()} aria-label={title}>
      <h2 className={styles.title}>
        {icon && (
          <span className={styles.titleIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{title}</span>
      </h2>

      {items && items.length > 0 && (
        <dl className={styles.infoItemGrid}>
          {items.map((item) => {
            const [label, value, itemIcon] = Array.isArray(item)
              ? [item[0], item[1], item[2]]
              : [item.label, item.value, item.icon];

            const displayValue = value && value.trim() !== '' ? value : '정보 없음';
            const { value: primaryValue, helper } = splitDisplayValue(displayValue);

            return (
              <div key={label} className={styles.infoItem}>
                <dt className={styles.infoItemLabel}>
                  {itemIcon && (
                    <span className={styles.itemIcon} aria-hidden="true">
                      {itemIcon}
                    </span>
                  )}
                  <span className={styles.label}>{label}</span>
                </dt>
                <dd className={styles.infoItemBody}>
                  <span className={styles.infoItemValue}>{primaryValue}</span>
                  {helper ? (
                    <span className={styles.infoItemHelper}>{helper}</span>
                  ) : null}
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {description && <p className={styles.description}>{description}</p>}

      {children && <div className={styles.content}>{children}</div>}
    </section>
  );
}
