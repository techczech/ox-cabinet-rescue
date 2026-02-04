import { Link } from 'react-router-dom';
import type { Source } from '../types';

interface SourceCardProps {
  source: Source;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <Link
      to={`/source/${source.slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {source.images[0] ? (
          <img
            src={source.images[0].url}
            alt={source.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--oxford-blue)] group-hover:text-[var(--oxford-gold)] transition-colors line-clamp-2">
          {source.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{source.sourceType}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {source.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[var(--oxford-blue)]/10 text-[var(--oxford-blue)] px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
