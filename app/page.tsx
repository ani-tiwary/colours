import React from 'react';
import { getSpotifyAuthUrl } from './utils/auth';

export default function Home() {
  const authUrl = getSpotifyAuthUrl();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Spotify Playlist Color Sorter</h1>
      <p className="mb-8 text-lg text-gray-600">Sort your playlists by album cover colors</p>
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">Debug Info:</p>
        <p className="text-sm text-gray-600">Base URL: {baseUrl}</p>
        <p className="text-sm text-gray-600">Redirect URI: {baseUrl}/api/auth/callback</p>
      </div>
      <a
        href={authUrl}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
      >
        Login with Spotify
      </a>
    </main>
  );
} 