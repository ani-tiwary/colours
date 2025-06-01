import React from 'react';

async function getArtistData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artist`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch artist data');
  return res.json();
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