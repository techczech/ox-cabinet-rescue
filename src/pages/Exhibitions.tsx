import { Link } from 'react-router-dom';
import { Archive, ChevronRight, Globe } from 'lucide-react';
import { getAllExhibitions } from '../services/dataService';

export default function Exhibitions() {
  const exhibitions = getAllExhibitions();

  return (
    <div className="min-h-screen bg-[var(--cabinet-warm)]">
      {/* Header */}
      <div className="bg-[var(--oxford-blue)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">Exhibitions</h1>
          <p className="text-gray-300 max-w-2xl">
            Curated collections that explore specific themes, regions, or time periods
            through carefully selected objects and scholarly commentary.
          </p>
        </div>
      </div>

      {/* Exhibitions List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8">
          {exhibitions.map((exhibition) => (
            <Link
              key={exhibition.id}
              to={`/exhibition/${exhibition.slug}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="md:flex">
                <div className="md:w-1/3 bg-[var(--oxford-blue)] p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Archive size={48} className="mx-auto mb-4 opacity-80" />
                    <div className="text-4xl font-bold text-[var(--oxford-gold)]">
                      {exhibition.objectCount}
                    </div>
                    <div className="text-sm text-gray-300">objects</div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                        exhibition.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {exhibition.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                      </span>
                      <h2 className="text-2xl font-bold text-[var(--oxford-blue)] group-hover:text-[var(--oxford-gold)] transition-colors">
                        {exhibition.title}
                      </h2>
                      <p className="text-gray-600 mt-3">
                        {exhibition.shortDescription}
                      </p>
                    </div>
                    <ChevronRight
                      size={24}
                      className="text-gray-400 group-hover:text-[var(--oxford-gold)] transition-colors flex-shrink-0 ml-4"
                    />
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                    <Globe size={16} />
                    <span>Multiple languages available</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {exhibitions.length === 0 && (
          <div className="text-center py-16">
            <Archive size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No exhibitions available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
