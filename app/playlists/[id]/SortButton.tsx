'use client';

import { useState } from 'react';

interface SortButtonProps {
  playlistId: string;
}

export default function SortButton({ playlistId }: SortButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSort = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/playlists/${playlistId}/sort`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sort playlist');
      }

      // Refresh the page to show the new order
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sort playlist. Please try again.');
      console.error('Error sorting playlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSort}
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sorting...' : 'Sort by Artist'}
      </button>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
} 