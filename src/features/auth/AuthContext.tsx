import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
  type AuthSession,
} from './authSession';

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readAuthSession(),
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return false;

    const nextSession: AuthSession = {
      email: trimmedEmail,
      signedInAt: new Date().toISOString(),
    };
    writeAuthSession(nextSession);
    setSession(nextSession);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      login,
      logout,
    }),
    [session, isLoginModalOpen, openLoginModal, closeLoginModal, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
