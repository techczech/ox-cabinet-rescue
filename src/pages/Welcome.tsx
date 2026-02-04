import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Compass, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getSiteData, getAllSources } from '../services/dataService';
import SourceCard from '../components/SourceCard';

export default function Welcome() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const siteData = getSiteData();
  const featuredSources = getAllSources().slice(0, 4);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* MOCK WEBSITE WARNING BANNER */}
      <div className="bg-amber-500 text-black py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-center">
            <strong className="text-lg">PROTOTYPE DEMONSTRATION ONLY</strong>
            <p className="text-sm mt-1">
              This is a mock website for testing purposes. Content may include placeholder images and demo data.
              Visit the original <a href="https://www.cabinet.ox.ac.uk/" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-900">Cabinet website</a> for authentic content.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-[var(--oxford-blue)] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--oxford-gold)] to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to <span className="text-[var(--oxford-gold)]">{siteData.name}</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {siteData.tagline}
            </p>
            <p className="text-gray-300 mb-10">
              {siteData.description}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the collection..."
                  className="w-full px-6 py-4 pr-24 rounded-full bg-white text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-[var(--oxford-gold)]/50"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono bg-gray-200 text-gray-600 rounded">/</kbd>
                  <button
                    type="submit"
                    className="bg-[var(--oxford-blue)] text-white p-3 rounded-full hover:bg-[var(--oxford-gold)] hover:text-[var(--oxford-blue)] transition-colors"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--oxford-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="text-[var(--oxford-blue)]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--oxford-blue)] mb-2">Explore</h3>
              <p className="text-gray-600">
                Browse over 2,000 high-resolution images and 3D models from Oxford's collections.
              </p>
              <Link
                to="/explore"
                className="inline-block mt-4 text-[var(--oxford-gold)] hover:underline font-medium"
              >
                Start exploring
              </Link>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--oxford-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-[var(--oxford-blue)]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--oxford-blue)] mb-2">Discover</h3>
              <p className="text-gray-600">
                Access curated papers and teaching units on material culture.
              </p>
              <Link
                to="/discover"
                className="inline-block mt-4 text-[var(--oxford-gold)] hover:underline font-medium"
              >
                View papers
              </Link>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[var(--oxford-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-[var(--oxford-blue)]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--oxford-blue)] mb-2">Learn</h3>
              <p className="text-gray-600">
                Interactive tools for digital object handling, annotation, and discussion.
              </p>
              <Link
                to="/about"
                className="inline-block mt-4 text-[var(--oxford-gold)] hover:underline font-medium"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sources */}
      <section className="py-16 bg-[var(--cabinet-warm)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--oxford-blue)]">
              Featured Sources
            </h2>
            <Link
              to="/explore"
              className="text-[var(--oxford-gold)] hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--oxford-blue)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[var(--oxford-gold)]">2,247+</div>
              <div className="text-gray-300 mt-2">Sources</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--oxford-gold)]">7</div>
              <div className="text-gray-300 mt-2">Papers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--oxford-gold)]">IIIF</div>
              <div className="text-gray-300 mt-2">Compliant</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--oxford-gold)]">3D</div>
              <div className="text-gray-300 mt-2">Models</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
