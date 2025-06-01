import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getPlaylists(accessToken: string) {
  const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch playlists');
  }

  return response.json();
}

export default async function PlaylistsPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token');

  if (!accessToken) {
    redirect('/');
  }

  const { items: playlists } = await getPlaylists(accessToken.value);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Your Playlists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist: any) => (
          <div
            key={playlist.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {playlist.images[0] && (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
              <p className="text-gray-600">{playlist.tracks.total} tracks</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 