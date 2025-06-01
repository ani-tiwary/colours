import { NextResponse } from 'next/server';
import { getSpotifyAccessToken } from '../../utils/spotify';

const KENDRICK_ID = '2YZyLoL8N0Wb9xBt1NhZWg';

export async function GET() {
  try {
    const accessToken = await getSpotifyAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${KENDRICK_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist data' },
      { status: 500 }
    );
  }
} 