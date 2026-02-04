import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, BookOpen, ExternalLink, Image, ZoomIn, Box } from 'lucide-react';
import { getSourceBySlug } from '../services/dataService';
import { useState } from 'react';
import MediaViewer from '../components/MediaViewer';
import MediaModal from '../components/MediaModal';

export default function SourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const source = slug ? getSourceBySlug(slug) : undefined;
  const [selectedImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'images' | '3d'>('images');

  if (!source) {
    return (
      <div className="min-h-screen bg-[var(--cabinet-warm)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--oxford-blue)] mb-4">
            Source not found
          </h1>
          <p className="text-gray-600 mb-6">
            The source you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-[var(--oxford-gold)] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const has3DModel = !!source.model3d;

  const mediaItems = source.images.map((img) => ({
    url: img.url,
    caption: img.caption,
    credit: img.credit,
    type: 'image' as const,
  }));

  // Add 3D model to media items if available
  if (source.model3d) {
    mediaItems.push({
      url: source.model3d.url,
      caption: source.model3d.caption,
      credit: source.model3d.credit,
      type: '3d' as const,
      modelUrl: source.model3d.url,
    } as any);
  }

  return (
    <div className="min-h-screen bg-[var(--cabinet-warm)]">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-[var(--oxford-blue)]"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <span>/</span>
            <Link to="/discover" className="hover:text-[var(--oxford-blue)]">
              Discover
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate">{source.paper}</span>
            <span>/</span>
            <span className="text-gray-400 truncate">{source.unit}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Media Section */}
          <div className="space-y-4">
            {/* View Mode Toggle */}
            {has3DModel && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode('images')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'images'
                      ? 'bg-[var(--oxford-blue)] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Image size={18} />
                  Images
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === '3d'
                      ? 'bg-[var(--oxford-blue)] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Box size={18} />
                  3D Model
                </button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {viewMode === '3d' && source.model3d ? (
                <div className="aspect-square bg-gray-900">
                  {/* @ts-ignore */}
                  <model-viewer
                    src={source.model3d.url}
                    alt={source.title}
                    auto-rotate
                    camera-controls
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              ) : source.images.length > 0 ? (
                <div className="relative group">
                  <MediaViewer
                    items={mediaItems.filter(m => m.type === 'image')}
                    initialIndex={selectedImage}
                  />
                  <button
                    onClick={() => setIsViewerOpen(true)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    title="Open fullscreen viewer"
                  >
                    <ZoomIn size={20} />
                  </button>
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
                  <Image size={64} />
                </div>
              )}
            </div>

            {/* Caption for 3D model */}
            {viewMode === '3d' && source.model3d && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-sm text-gray-700">{source.model3d.caption}</p>
                <p className="text-xs text-gray-500 mt-1">Credit: {source.model3d.credit}</p>
              </div>
            )}

            {/* Quick Info Card */}
            <div className="bg-[var(--oxford-blue)] text-white rounded-lg p-4">
              {viewMode === '3d' ? (
                <>
                  <p className="text-sm text-gray-300 mb-1">Interact with the 3D model:</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Click and drag to rotate</li>
                    <li>• Scroll to zoom in/out</li>
                    <li>• Two-finger drag to pan</li>
                    <li>• Model auto-rotates when idle</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-300 mb-1">Interact with the image:</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Scroll or use +/- to zoom</li>
                    <li>• Drag to pan when zoomed in</li>
                    <li>• Click fullscreen for larger view</li>
                    <li>• Use arrow keys to navigate</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--oxford-blue)] mb-2">
                {source.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {source.date}
                </span>
                <span className="bg-[var(--oxford-blue)]/10 px-3 py-1 rounded-full text-[var(--oxford-blue)]">
                  {source.sourceType}
                </span>
                {has3DModel && (
                  <span className="bg-[var(--oxford-gold)]/20 px-3 py-1 rounded-full text-[var(--oxford-blue)] flex items-center gap-1">
                    <Box size={14} />
                    3D Available
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <h2 className="text-lg font-semibold text-[var(--oxford-blue)]">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{source.description}</p>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[var(--oxford-blue)]">
                Details
              </h2>

              <div className="grid gap-3 text-sm">
                <div className="flex">
                  <span className="w-32 text-gray-500 flex-shrink-0">Primary Source</span>
                  <span className="text-gray-700">{source.primarySource}</span>
                </div>

                {source.medium && (
                  <div className="flex">
                    <span className="w-32 text-gray-500 flex-shrink-0">Medium</span>
                    <span className="text-gray-700">{source.medium}</span>
                  </div>
                )}

                {source.dimensions && (
                  <div className="flex">
                    <span className="w-32 text-gray-500 flex-shrink-0">Dimensions</span>
                    <span className="text-gray-700">{source.dimensions}</span>
                  </div>
                )}

                {source.accessionId && (
                  <div className="flex">
                    <span className="w-32 text-gray-500 flex-shrink-0">Accession ID</span>
                    <span className="text-gray-700">{source.accessionId}</span>
                  </div>
                )}

                <div className="flex">
                  <span className="w-32 text-gray-500 flex-shrink-0">Paper</span>
                  <span className="text-gray-700 flex items-center gap-1">
                    <BookOpen size={14} />
                    {source.paper}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-32 text-gray-500 flex-shrink-0">Unit</span>
                  <span className="text-gray-700">{source.unit}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--oxford-blue)] mb-3 flex items-center gap-2">
                <Tag size={18} />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {source.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="bg-[var(--oxford-blue)]/10 hover:bg-[var(--oxford-gold)]/20 text-[var(--oxford-blue)] px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Original Cabinet URL */}
            {(source as any).cabinetUrl && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 font-medium mb-2">Original Source</p>
                <a
                  href={(source as any).cabinetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--oxford-blue)] hover:underline text-sm break-all"
                >
                  <ExternalLink size={16} className="flex-shrink-0" />
                  {(source as any).cabinetUrl}
                </a>
              </div>
            )}

            {/* External Link Placeholder */}
            <div className="pt-4 border-t">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[var(--oxford-gold)] hover:underline"
              >
                <ExternalLink size={16} />
                View in IIIF Viewer (Coming Soon)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Media Modal */}
      <MediaModal
        items={mediaItems}
        initialIndex={selectedImage}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
}
