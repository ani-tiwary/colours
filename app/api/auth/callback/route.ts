import { NextResponse } from 'next/server';

function ensureHttps(url: string) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

const BASE_URL = process.env.NODE_ENV === 'production'
  ? ensureHttps(process.env.NEXT_PUBLIC_BASE_URL || '')
  : 'https://127.0.0.1:3000';

const REDIRECT_URI = `${BASE_URL}/api/auth/callback`;

export async function GET(request: Request) {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return NextResponse.redirect(`${BASE_URL}/?error=missing_credentials`);
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${BASE_URL}/?error=no_code`);
    }

    const authHeader = `Basic ${Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64')}`;

    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private',
    }).toString();

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: requestBody,
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json().catch(() => ({}));
      return NextResponse.redirect(
        `${BASE_URL}/?error=token_failed&status=${tokenResponse.status}&message=${error.error_description || 'Unknown error'}`
      );
    }

    const tokens = await tokenResponse.json();

    const response = NextResponse.redirect(`${BASE_URL}/playlists`);
    response.cookies.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
    });
    response.cookies.set('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(`${BASE_URL}/?error=auth_failed`);
  }
} 