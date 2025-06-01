export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

export function getSpotifyAuthUrl() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  
  // Use the deployed URL in production, localhost in development
  const redirectUri = process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    : 'https://127.0.0.1:3000/api/auth/callback';

  const params = new URLSearchParams({
    client_id: clientId!,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'playlist-read-private playlist-read-collaborative',
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
} 