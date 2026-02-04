import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen, Globe, Award } from 'lucide-react';
import { getExhibitionBySlug, getExhibitionObjects } from '../services/dataService';

export default function ExhibitionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const exhibition = slug ? getExhibitionBySlug(slug) : undefined;
  const objects = exhibition ? getExhibitionObjects(exhibition.id) : [];

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-[var(--cabinet-warm)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--oxford-blue)] mb-4">
            Exhibition not found
          </h1>
          <Link
            to="/exhibitions"
            className="inline-flex items-center gap-2 text-[var(--oxford-gold)] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Exhibitions
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
            to="/exhibitions"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4"
          >
            <ArrowLeft size={18} />
            All Exhibitions
          </Link>
          <h1 className="text-3xl font-bold mb-4">{exhibition.title}</h1>
          <p className="text-gray-300 max-w-3xl">{exhibition.description}</p>
          {exhibition.descriptionRussian && (
            <p className="text-gray-400 mt-4 max-w-3xl italic">
              {exhibition.descriptionRussian}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <BookOpen size={16} />
              {objects.length} of {exhibition.targetCount} objects
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Globe size={16} />
              {exhibition.languages.join(', ')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Exhibition Parts / Entry Points */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-6">
            Enter the Exhibition
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exhibition.parts.map((part) => (
              <Link
                key={part.id}
                to={`/exhibition/${slug}/part/${part.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Globe size={20} className="text-[var(--oxford-gold)]" />
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {part.language}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--oxford-blue)] group-hover:text-[var(--oxford-gold)] transition-colors">
                  {part.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {part.objectIds.length > 0
                    ? `${part.objectIds.length} objects`
                    : 'Coming soon'}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Objects Preview */}
        {objects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-6">
              Featured Objects
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {objects.map((obj) => (
                <Link
                  key={obj.id}
                  to={`/exhibition/${slug}/object/${obj.slug}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--oxford-blue)] group-hover:text-[var(--oxford-gold)] transition-colors line-clamp-2">
                      {obj.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{obj.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-6 flex items-center gap-3">
            <Users className="text-[var(--oxford-gold)]" />
            Organizers
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {exhibition.organizers.map((org) => (
              <div key={org.name} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-[var(--oxford-blue)]">
                  {org.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{org.affiliation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Board */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-6 flex items-center gap-3">
            <Award className="text-[var(--oxford-gold)]" />
            Editorial Board
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-4">
              {exhibition.editorialBoard.map((member) => (
                <div
                  key={member.name}
                  className="bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <span className="font-medium text-gray-700">{member.name}</span>
                  <span className="text-gray-500 text-sm block">
                    {member.affiliation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-6">
            Support & Acknowledgments
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-[var(--oxford-blue)] mb-3">
                Translators
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {exhibition.support.translators.map((t) => (
                  <li key={t.name}>
                    {t.name} ({t.role})
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-[var(--oxford-blue)] mb-3">
                Data Input
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {exhibition.support.dataInput.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-[var(--oxford-blue)] mb-3">
                Supported By
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {exhibition.support.sponsors.map((sponsor) => (
                  <li key={sponsor}>{sponsor}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
