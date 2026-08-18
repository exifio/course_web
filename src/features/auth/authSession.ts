export interface AuthSession {
  email: string;
  signedInAt: string;
}

export const AUTH_SESSION_KEY = 'runroute:auth-session';

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.email === 'string' &&
    typeof candidate.signedInAt === 'string'
  );
}

export function readAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isAuthSession(parsed)) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function writeAuthSession(session: AuthSession): void {
  const { email, signedInAt } = session;
  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({ email, signedInAt }),
  );
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
}
