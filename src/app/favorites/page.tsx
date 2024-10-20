'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = () => {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
        setTotalFavorites(storedFavorites.length);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('An error occurred while fetching favorites. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [page, pageSize]);

  const handleRemoveFavorite = (domain: string) => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const updatedFavorites = storedFavorites.filter((fav: string) => fav !== domain);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setTotalFavorites(updatedFavorites.length);
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('An error occurred while removing favorite. Please try again.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      {favorites.length === 0 ? (
        <p>Your favorite domains will appear here.</p>
      ) : (
        <div>
          <ul className="list-disc pl-5 mb-4">
            {favorites.map((domain, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{domain}</span>
                <Button onClick={() => handleRemoveFavorite(domain)} className="ml-2">
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous Page
            </Button>
            <span>Page {page}</span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page * pageSize >= totalFavorites}
            >
              Next Page
            </Button>
          </div>
          <p className="mt-4">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalFavorites)} of {totalFavorites} favorites
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
