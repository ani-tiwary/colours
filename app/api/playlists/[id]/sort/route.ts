import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getPlaylistTracks(playlistId: string, accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to fetch playlist tracks: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

async function reorderPlaylistTracks(playlistId: string, accessToken: string, rangeStart: number, insertBefore: number) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range_start: rangeStart,
      insert_before: insertBefore,
      range_length: 1,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to reorder playlist tracks: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all tracks in the playlist
    const { items } = await getPlaylistTracks(params.id, accessToken.value);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Playlist is empty' }, { status: 400 });
    }

    // Sort tracks by artist name
    const sortedTracks = [...items].sort((a, b) => {
      const artistA = a.track.artists[0].name.toLowerCase();
      const artistB = b.track.artists[0].name.toLowerCase();
      return artistA.localeCompare(artistB);
    });

    // Reorder tracks in Spotify
    for (let i = 0; i < sortedTracks.length; i++) {
      const currentTrack = sortedTracks[i];
      const originalIndex = items.findIndex(item => item.track.id === currentTrack.track.id);
      
      if (originalIndex !== i) {
        try {
          await reorderPlaylistTracks(params.id, accessToken.value, originalIndex, i);
          // Update the items array to reflect the new order
          const [movedItem] = items.splice(originalIndex, 1);
          items.splice(i, 0, movedItem);
        } catch (error) {
          console.error(`Failed to move track ${currentTrack.track.name}:`, error);
          return NextResponse.json(
            { error: `Failed to sort playlist: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sorting playlist:', error);
    return NextResponse.json(
      { error: `Failed to sort playlist: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 