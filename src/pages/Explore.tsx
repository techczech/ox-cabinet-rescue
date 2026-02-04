import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { searchSources, getSourceTypes, getTags } from '../services/dataService';
import SourceCard from '../components/SourceCard';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [showFilters, setShowFilters] = useState(false);

  const sourceTypes = getSourceTypes();
  const tags = getTags();

  const filteredSources = useMemo(() => {
    return searchSources(searchQuery, selectedType, selectedTag);
  }, [searchQuery, selectedType, selectedTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedType !== 'All') params.set('type', selectedType);
    if (selectedTag) params.set('tag', selectedTag);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedTag('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedType !== 'All' || selectedTag;

  return (
    <div className="min-h-screen bg-[var(--cabinet-warm)]">
      {/* Header */}
      <div className="bg-[var(--oxford-blue)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Explore the Collection</h1>
          <p className="text-gray-300 max-w-2xl">
            Browse and search through our curated collection of historical sources,
            artifacts, and scholarly materials from Oxford's collections.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sources..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--oxford-blue)] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-[var(--oxford-gold)] rounded-full" />
                )}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--oxford-blue)] text-white rounded-lg hover:bg-[var(--oxford-blue)]/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--oxford-blue)]"
                  >
                    {sourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tag
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--oxford-blue)]"
                  >
                    <option value="">All tags</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 flex items-center gap-1 text-sm text-gray-600 hover:text-[var(--oxford-blue)]"
                >
                  <X size={16} />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Displaying <span className="font-semibold">{filteredSources.length}</span> sources
          </p>
        </div>

        {filteredSources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No sources found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[var(--oxford-gold)] hover:underline"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
