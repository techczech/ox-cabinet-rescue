import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, MapPin, User, BookOpen, Image, ExternalLink } from 'lucide-react';
import { getExhibitionObjectBySlug, getExhibitionBySlug } from '../services/dataService';
import { useState } from 'react';

export default function ExhibitionObject() {
  const { exhibitionSlug, objectSlug } = useParams<{
    exhibitionSlug: string;
    objectSlug: string;
  }>();
  const navigate = useNavigate();
  const object = objectSlug ? getExhibitionObjectBySlug(objectSlug) : undefined;
  const exhibition = exhibitionSlug ? getExhibitionBySlug(exhibitionSlug) : undefined;
  const [selectedImage, setSelectedImage] = useState(0);

  if (!object || !exhibition) {
    return (
      <div className="min-h-screen bg-[var(--cabinet-warm)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--oxford-blue)] mb-4">
            Object not found
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
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-[var(--oxford-blue)]"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <span>/</span>
            <Link to="/exhibitions" className="hover:text-[var(--oxford-blue)]">
              Exhibitions
            </Link>
            <span>/</span>
            <Link
              to={`/exhibition/${exhibitionSlug}`}
              className="hover:text-[var(--oxford-blue)] truncate"
            >
              {exhibition.title}
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-100">
                {object.images[selectedImage] ? (
                  <img
                    src={object.images[selectedImage].url}
                    alt={object.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x800?text=Image+Not+Available';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Image size={64} />
                  </div>
                )}
              </div>
              {object.images[selectedImage] && (
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-sm text-gray-700">
                    {object.images[selectedImage].caption}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Credit: {object.images[selectedImage].credit}
                  </p>
                </div>
              )}
            </div>

            {object.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {object.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? 'border-[var(--oxford-gold)]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-sm text-gray-600 bg-[var(--oxford-blue)]/10 px-3 py-1 rounded-full">
                  <MapPin size={14} />
                  {object.country}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {object.objectType}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[var(--oxford-blue)]">
                {object.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Calendar size={16} />
                {object.date}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-[var(--oxford-blue)] mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{object.description}</p>
            </div>

            {/* Commentary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-[var(--oxford-blue)] mb-3">
                Commentary
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {object.commentary}
              </p>
            </div>

            {/* Author */}
            <div className="bg-[var(--oxford-blue)] text-white rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--oxford-gold)]">
                    {object.author.name}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">{object.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Provenance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-[var(--oxford-blue)] mb-3">
                Provenance
              </h2>
              <p className="text-gray-700">{object.provenance}</p>
            </div>

            {/* References */}
            {object.references.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-[var(--oxford-blue)] mb-3 flex items-center gap-2">
                  <BookOpen size={18} />
                  References
                </h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  {object.references.map((ref, idx) => (
                    <li key={idx} className="pl-4 border-l-2 border-[var(--oxford-gold)]">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--oxford-blue)] mb-3 flex items-center gap-2">
                <Tag size={18} />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {object.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[var(--oxford-blue)]/10 text-[var(--oxford-blue)] px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Original Cabinet URL */}
            {(object as any).cabinetUrl && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 font-medium mb-2">Original Source</p>
                <a
                  href={(object as any).cabinetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--oxford-blue)] hover:underline text-sm break-all"
                >
                  <ExternalLink size={16} className="flex-shrink-0" />
                  {(object as any).cabinetUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
