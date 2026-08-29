import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeRedirect } from '@/utils/sanitizeRedirect';

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
