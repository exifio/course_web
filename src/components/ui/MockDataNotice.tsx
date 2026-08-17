import styles from './MockDataNotice.module.css';

export default function MockDataNotice() {
  return (
    <aside className={styles.notice} aria-label="샘플 데이터 안내">
      <strong className={styles.title}>샘플 데이터 안내</strong>
      <p className={styles.description}>
        코스 정보는 MVP 검증을 위한 샘플 데이터입니다. 실제 거리·경로·시설 및
        안전 상태와 다를 수 있습니다.
      </p>
    </aside>
  );
}
