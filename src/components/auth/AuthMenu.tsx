import { useAuth } from '../../features/auth/AuthContext';
import styles from './AuthMenu.module.css';

export default function AuthMenu() {
  const { session, isAuthenticated, logout, openLoginModal } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={openLoginModal}
        className={styles.loginButton}
      >
        로그인
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <span className={styles.email} title={session?.email ?? ''}>
        {session?.email}
      </span>
      <button type="button" className={styles.logoutButton} onClick={logout}>
        로그아웃
      </button>
    </div>
  );
}

