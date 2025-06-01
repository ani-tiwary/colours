import React from 'react';
import { getSpotifyAccessToken } from './utils/spotify';

async function getArtistData() {
  try {
    const accessToken = await getSpotifyAccessToken();
    
    const res = await fetch('https://api.spotify.com/v1/artists/2YZyLoL8N0Wb9xBt1NhZWg', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch artist data');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching artist data:', error);
    return { name: 'Error', followers: { total: 0 }, popularity: 0 };
  }
}

export default async function Home() {
  const artistData = await getArtistData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">{artistData.name}</h1>
      <p className="mb-4">Followers: {artistData.followers?.total.toLocaleString()}</p>
      <p>Popularity: {artistData.popularity}/100</p>
    </main>
  );
} 