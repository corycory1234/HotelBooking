/**
 * Only allow same-origin relative paths as a post-login redirect target,
 * closing the open-redirect gap a raw `redirect` query param would otherwise
 * open (e.g. `?redirect=https://evil.example.com`). Shared by every place
 * that turns a `redirect` search param back into a navigation target -
 * currently the Google OAuth callback route (server-side, `origin` from
 * `request.nextUrl.origin`) and the traditional email/password login form
 * (client-side, `origin` from `window.location.origin`).
 */

// 防止 ReDirect漏洞, 並且驗證 ?redirect=, 參數只能走同源路徑
export function sanitizeRedirect(raw: string | null | undefined, origin: string): string {
  if (!raw) return '/';

  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return '/';
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//')) return '/';

  try {
    const resolved = new URL(decoded, origin);
    if (resolved.origin !== origin) return '/';
    return resolved.pathname + resolved.search;
  } catch {
    return '/';
  }
}
