import { cookies } from 'next/headers';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123jesus';
const AUTH_COOKIE_NAME = 'hyuns_auth_session';

export function verifyCredentials(user: string, pass: string): boolean {
  return user.trim() === ADMIN_USER && pass.trim() === ADMIN_PASSWORD;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);
  return session?.value === 'authenticated_admin_hyuns';
}

export { AUTH_COOKIE_NAME };
