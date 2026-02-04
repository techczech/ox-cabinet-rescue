import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Grid } from 'lucide-react';
import { getExhibitionBySlug, getExhibitionObjectsByPart, getExhibitionObjects } from '../services/dataService';

export default function ExhibitionPart() {
  const { exhibitionSlug, partId } = useParams<{
    exhibitionSlug: string;
    partId: string;
  }>();
  const exhibition = exhibitionSlug ? getExhibitionBySlug(exhibitionSlug) : undefined;
  const part = exhibition?.parts.find((p) => p.id === partId);

  // Get objects for this part, or all objects if part has no specific objects
  let objects = partId && exhibition
    ? getExhibitionObjectsByPart(exhibition.id, partId)
    : [];

  // If no specific objects for this part, show all exhibition objects
  if (objects.length === 0 && exhibition) {
    objects = getExhibitionObjects(exhibition.id);
  }

  if (!exhibition || !part) {
    return (
      <div className="min-h-screen bg-[var(--cabinet-warm)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--oxford-blue)] mb-4">
            Exhibition part not found
          </h1>
          <Link
            to={`/exhibition/${exhibitionSlug}`}
            className="inline-flex items-center gap-2 text-[var(--oxford-gold)] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Exhibition
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cabinet-warm)]">
      {/* Header */}
      <div className="bg-[var(--oxford-blue)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/exhibition/${exhibitionSlug}`}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4"
          >
            <ArrowLeft size={18} />
            {exhibition.title}
          </Link>
          <h1 className="text-3xl font-bold">{part.title}</h1>
          <p className="text-gray-300 mt-2">
            {objects.length} object{objects.length !== 1 ? 's' : ''} in this section
          </p>
        </div>
      </div>

      {/* Objects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {objects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {objects.map((obj) => (
              <Link
                key={obj.id}
                to={`/exhibition/${exhibitionSlug}/object/${obj.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {obj.images[0] ? (
                    <img
                      src={obj.images[0].url}
                      alt={obj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Grid size={32} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--oxford-blue)] group-hover:text-[var(--oxford-gold)] transition-colors line-clamp-2">
                    {obj.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{obj.country}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {obj.tags.slice(0, 2).map((tag) => (
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
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Grid size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Objects for this section are coming soon.
            </p>
            <Link
              to={`/exhibition/${exhibitionSlug}`}
              className="mt-4 inline-block text-[var(--oxford-gold)] hover:underline"
            >
              Return to exhibition overview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
