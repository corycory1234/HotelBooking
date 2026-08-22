import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Only allow same-origin relative paths as the post-login redirect target,
 * to close the open-redirect gap the old client-side callback had.
 */
function sanitizeRedirect(raw: string | null, origin: string): string {
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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const redirectTarget = sanitizeRedirect(searchParams.get('redirect'), origin);

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=missing_code`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/auth?error=oauth_failed`);
  }

  return NextResponse.redirect(`${origin}${redirectTarget}`);
}
