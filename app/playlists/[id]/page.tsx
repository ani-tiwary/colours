import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getPlaylistDetails(playlistId: string, accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch playlist details');
  }

  return response.json();
}

export default async function PlaylistPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token');

  if (!accessToken) {
    redirect('/');
  }

  const playlist = await getPlaylistDetails(params.id, accessToken.value);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-8 mb-8">
          {playlist.images[0] && (
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
            <p className="text-gray-600 mb-2">{playlist.description}</p>
            <p className="text-gray-600">{playlist.tracks.total} tracks</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold">Tracks</h2>
          </div>
          <div className="divide-y">
            {playlist.tracks.items.map((item: any, index: number) => (
              <div key={item.track.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <span className="text-gray-500 w-8">{index + 1}</span>
                {item.track.album.images[0] && (
                  <img
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.track.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.track.artists.map((artist: any) => artist.name).join(', ')}
                  </p>
                </div>
                <div className="text-gray-500 text-sm">
                  {item.track.album.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 