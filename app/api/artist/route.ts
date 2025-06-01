import { NextResponse } from 'next/server';

const KENDRICK_ID = '2YZyLoL8N0Wb9xBt1NhZWg';

export async function GET() {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${KENDRICK_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch artist data' },
      { status: 500 }
    );
  }
} 