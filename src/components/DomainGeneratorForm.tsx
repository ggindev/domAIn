import React, { useState } from 'react';
import Button from './Button';

interface FormData {
  prefixLength: number;
  suffixLength: number;
  includeNumbers: boolean;
  includeHyphens: boolean;
  filterMeaningful: boolean;
  page: number;
  pageSize: number;
  prefixes: string[];
  tlds: string[];
}

interface DomainInfo {
  domain: string;
  isMeaningful: boolean;
}

interface DomainResponse {
  domains: DomainInfo[];
  page: number;
  pageSize: number;
  totalCombinations: number;
}

interface DomainAvailability {
  [domain: string]: boolean | null;
}

const DomainGeneratorForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    prefixLength: 3,
    suffixLength: 3,
    includeNumbers: true,
    includeHyphens: false,
    filterMeaningful: false,
    page: 1,
    pageSize: 100,
    prefixes: [],
    tlds: [],
  });
  const [results, setResults] = useState<DomainResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<DomainAvailability>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value),
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'prefixes' | 'tlds') => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()),
    }));
  };

  const checkAvailability = async (domains: string[]) => {
    try {
      const response = await fetch('/api/domains/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domains }),
      });
      if (!response.ok) {
        throw new Error('Failed to check domain availability');
      }
      const data: DomainAvailability = await response.json();
      setAvailability(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error checking domain availability:', error);
      setError('An error occurred while checking domain availability. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAvailability({});
    try {
      const response = await fetch('/api/domains/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to generate domains');
      }
      const data: DomainResponse = await response.json();
      setResults(data);
      // Initialize availability state with null values
      const initialAvailability = data.domains.reduce((acc, domainInfo) => {
        acc[domainInfo.domain] = null;
        return acc;
      }, {} as DomainAvailability);
      setAvailability(initialAvailability);
      // Check availability for generated domains
      await checkAvailability(data.domains.map(d => d.domain));
    } catch (error) {
      console.error('Error generating domains:', error);
      setError('An error occurred while generating domains. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFormData(prev => ({ ...prev, page: newPage }));
    handleSubmit(new Event('submit') as any);
  };

  const handleFavorite = async (domain: string) => {
    try {
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });
      if (!response.ok) {
        throw new Error('Failed to add domain to favorites');
      }
      setFavorites(prev => [...prev, domain]);
    } catch (error) {
      console.error('Error adding domain to favorites:', error);
      setError('An error occurred while adding domain to favorites. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="prefixLength" className="block mb-1">Prefix Length:</label>
          <input
            type="number"
            id="prefixLength"
            name="prefixLength"
            value={formData.prefixLength}
            onChange={handleInputChange}
            min="1"
            max="10"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="suffixLength" className="block mb-1">Suffix Length:</label>
          <input
            type="number"
            id="suffixLength"
            name="suffixLength"
            value={formData.suffixLength}
            onChange={handleInputChange}
            min="1"
            max="10"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="includeNumbers"
              checked={formData.includeNumbers}
              onChange={handleInputChange}
              className="mr-2"
            />
            Include Numbers
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="includeHyphens"
              checked={formData.includeHyphens}
              onChange={handleInputChange}
              className="mr-2"
            />
            Include Hyphens
          </label>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="filterMeaningful"
              checked={formData.filterMeaningful}
              onChange={handleInputChange}
              className="mr-2"
            />
            Filter Meaningful Words
          </label>
        </div>
        <div>
          <label htmlFor="prefixes" className="block mb-1">Desired Prefixes (comma-separated):</label>
          <input
            type="text"
            id="prefixes"
            name="prefixes"
            value={formData.prefixes.join(', ')}
            onChange={(e) => handleArrayInputChange(e, 'prefixes')}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="tlds" className="block mb-1">Desired TLDs (comma-separated):</label>
          <input
            type="text"
            id="tlds"
            name="tlds"
            value={formData.tlds.join(', ')}
            onChange={(e) => handleArrayInputChange(e, 'tlds')}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Domains'}
        </Button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {results && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Generated Domains</h2>
          <ul className="list-disc pl-5 mb-4">
            {results.domains.map((domainInfo, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{domainInfo.domain}</span>
                <div>
                  {availability[domainInfo.domain] === null ? (
                    <span className="text-gray-500">Checking...</span>
                  ) : availability[domainInfo.domain] ? (
                    <span className="text-green-500">Available</span>
                  ) : (
                    <span className="text-red-500">Unavailable</span>
                  )}
                  {domainInfo.isMeaningful && (
                    <span className="ml-2 text-blue-500">Meaningful</span>
                  )}
                  <Button
                    onClick={() => handleFavorite(domainInfo.domain)}
                    className="ml-2"
                  >
                    Favorite
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <Button
              onClick={() => handlePageChange(results.page - 1)}
              disabled={results.page === 1}
            >
              Previous Page
            </Button>
            <span>Page {results.page}</span>
            <Button
              onClick={() => handlePageChange(results.page + 1)}
              disabled={results.page * results.pageSize >= results.totalCombinations}
            >
              Next Page
            </Button>
          </div>
          <p className="mt-4">
            Showing {(results.page - 1) * results.pageSize + 1} - {Math.min(results.page * results.pageSize, results.totalCombinations)} of {results.totalCombinations} combinations
          </p>
        </div>
      )}
    </div>
  );
};

export default DomainGeneratorForm;
