export async function getSpotifyAccessToken() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    console.log('Checking credentials...');
    if (!clientId || !clientSecret) {
      console.error('Missing credentials:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret
      });
      throw new Error('Missing Spotify credentials');
    }

    console.log('Making token request...');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Spotify token error:', {
        status: response.status,
        statusText: response.statusText,
        error
      });
      throw new Error('Failed to get Spotify token');
    }

    const data = await response.json();
    console.log('Successfully got token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
} 