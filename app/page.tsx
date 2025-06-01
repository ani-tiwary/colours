import React from 'react';
import { getSpotifyAccessToken } from './utils/spotify';

async function getArtistData() {
  try {
    console.log('Getting access token...');
    const accessToken = await getSpotifyAccessToken();
    console.log('Got access token, fetching artist data...');
    
    const res = await fetch('https://api.spotify.com/v1/artists/2YZyLoL8N0Wb9xBt1NhZWg', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Artist fetch error:', {
        status: res.status,
        statusText: res.statusText,
        error: errorText
      });
      throw new Error('Failed to fetch artist data');
    }
    
    const data = await res.json();
    console.log('Successfully got artist data');
    return data;
  } catch (error) {
    console.error('Error in getArtistData:', error);
    return { name: 'Error', followers: { total: 0 }, popularity: 0 };
  }
}

export default async function Home() {
  try {
    console.log('Starting to fetch artist data...');
    const artistData = await getArtistData();
    console.log('Got artist data:', artistData);

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">{artistData.name}</h1>
        <p className="mb-4">Followers: {artistData.followers?.total.toLocaleString()}</p>
        <p>Popularity: {artistData.popularity}/100</p>
      </main>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4 text-red-500">Error</h1>
        <p>Something went wrong. Check the server logs for details.</p>
      </main>
    );
  }
} 