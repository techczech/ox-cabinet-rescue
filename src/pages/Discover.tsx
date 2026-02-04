import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { getPapers, getSourcesByPaper } from '../services/dataService';

export default function Discover() {
  const papers = getPapers();

  return (
    <div className="min-h-screen bg-[var(--cabinet-warm)]">
      {/* Header */}
      <div className="bg-[var(--oxford-blue)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Discover</h1>
          <p className="text-gray-300 max-w-2xl">
            Explore curated papers and teaching units that bring together sources,
            commentary, and scholarly analysis on material culture topics.
          </p>
        </div>
      </div>

      {/* Papers List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-8">
          Public Papers
        </h2>

        <div className="grid gap-6">
          {papers.map((paper) => {
            const sources = getSourcesByPaper(paper.title);
            return (
              <div
                key={paper.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--oxford-blue)]/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-[var(--oxford-blue)]" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[var(--oxford-blue)] mb-2">
                        {paper.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.units.map((unit) => (
                          <span
                            key={unit}
                            className="text-sm bg-[var(--oxford-gold)]/20 text-[var(--oxford-blue)] px-3 py-1 rounded-full"
                          >
                            {unit}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {sources.length} source{sources.length !== 1 ? 's' : ''} in this paper
                      </p>
                    </div>
                    <Link
                      to={`/explore?q=${encodeURIComponent(paper.title)}`}
                      className="flex items-center gap-1 text-[var(--oxford-gold)] hover:underline font-medium"
                    >
                      View
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>

                {/* Preview of sources */}
                {sources.length > 0 && (
                  <div className="border-t bg-gray-50 px-6 py-4">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {sources.slice(0, 4).map((source) => (
                        <Link
                          key={source.id}
                          to={`/source/${source.slug}`}
                          className="flex-shrink-0 w-32"
                        >
                          <div className="aspect-square bg-gray-200 rounded overflow-hidden">
                            {source.images[0] && (
                              <img
                                src={source.images[0].url}
                                alt={source.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {source.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
