import { NavLink, useLocation } from 'react-router-dom';
import AuthMenu from '../auth/AuthMenu';
import styles from './GNB.module.css';

export default function GNB() {
  const location = useLocation();
  const isHomeActive = location.pathname === '/' || location.pathname.startsWith('/course');
  const isSavedActive = location.pathname === '/saved' || location.pathname.startsWith('/saved');

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.logo}>RunRoute</span>
          </NavLink>
        </div>
        <nav className={styles.nav} aria-label="주요 메뉴">
          <NavLink
            to="/"
            className={isHomeActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            홈
          </NavLink>
          <NavLink
            to="/saved"
            className={isSavedActive ? `${styles.link} ${styles.active}` : styles.link}
          >
            저장
          </NavLink>
        </nav>
        <div className={styles.right}>
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
