import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side proxy to the external REST backend.
 *
 * Traditional (email/password) logins still hold a real backend token
 * client-side in Redux and pass it in the Authorization header - that's
 * forwarded as-is. Google OAuth logins no longer expose a raw token to the
 * client at all (the session lives in an httpOnly cookie), so for those
 * requests this route reads the Supabase session server-side and attaches
 * it instead.
 */
async function forward(request: NextRequest, path: string[]) {
  const targetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path.join('/')}${request.nextUrl.search}`;

  const headers: Record<string, string> = {};
  // Forward the original content-type verbatim (including multipart
  // boundary) instead of defaulting to application/json - a hardcoded
  // default would break multipart/form-data image uploads.
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const clientAuthHeader = request.headers.get('authorization');
  if (clientAuthHeader) {
    headers['Authorization'] = clientAuthHeader;
  } else {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `bearer ${session.access_token}`;
    }
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      // arrayBuffer (not text) so binary bodies like multipart image
      // uploads survive the round-trip intact.
      body: hasBody ? await request.arrayBuffer() : undefined,
      credentials: 'include',
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json({ success: false, message: 'Proxy request failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(request, params.path);
}
