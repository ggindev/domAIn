'use client';

import React, { useState } from 'react';
import Button from '../components/Button';
import { apiProviders } from '../api/domains/providers';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(apiProviders[0].url);

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/domains/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domains: [searchInput], provider: selectedProvider }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      setSearchResults(Object.keys(data).filter(domain => data[domain]));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Domain Discovery</h1>
      <p className="text-xl mb-4">
        Find available, lucrative, short, and catchy domain names based on specific patterns.
      </p>
      <div className="space-y-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter domain name"
          className="w-full px-3 py-2 border rounded"
        />
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          {apiProviders.map((provider, index) => (
            <option key={index} value={provider.url}>
              {provider.name}
            </option>
          ))}
        </select>
        <Button variant="primary" onClick={handleSearch}>Search Domains</Button>
      </div>
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <ul className="list-disc pl-5">
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
