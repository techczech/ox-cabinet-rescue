import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Move,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MediaItem {
  url: string;
  caption?: string | null;
  credit?: string;
  type?: 'image' | '3d';
  modelUrl?: string;
}

interface MediaViewerProps {
  items: MediaItem[];
  initialIndex?: number;
  onClose?: () => void;
  isFullscreen?: boolean;
}

export default function MediaViewer({
  items,
  initialIndex = 0,
  onClose,
  isFullscreen = false,
}: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreenMode, setIsFullscreenMode] = useState(isFullscreen);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentItem = items[currentIndex];
  const is3D = currentItem?.type === '3d' || currentItem?.modelUrl;

  const resetView = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.5, 0.5));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.5), 10));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const goToNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetView();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetView();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreenMode(true);
    } else {
      document.exitFullscreen();
      setIsFullscreenMode(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenMode(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          if (isFullscreenMode) {
            document.exitFullscreen();
          } else if (onClose) {
            onClose();
          }
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          resetView();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFullscreenMode, onClose, resetView]);

  if (!currentItem) return null;

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-900 ${
        isFullscreenMode ? 'fixed inset-0 z-50' : 'rounded-lg overflow-hidden'
      }`}
    >
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!is3D && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={20} />
                </button>
                <span className="text-white text-sm min-w-[4rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="Zoom In (+)"
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="Reset View (0)"
                >
                  <RotateCcw size={20} />
                </button>
              </>
            )}
            {is3D && (
              <div className="flex items-center gap-2 text-white text-sm">
                <Move size={16} />
                <span>Drag to rotate, scroll to zoom</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`relative ${isFullscreenMode ? 'h-screen' : 'aspect-[4/3]'} overflow-hidden`}
        onWheel={!is3D ? handleWheel : undefined}
        onMouseDown={!is3D ? handleMouseDown : undefined}
        onMouseMove={!is3D ? handleMouseMove : undefined}
        onMouseUp={!is3D ? handleMouseUp : undefined}
        onMouseLeave={!is3D ? handleMouseUp : undefined}
        onTouchStart={!is3D ? handleTouchStart : undefined}
        onTouchMove={!is3D ? handleTouchMove : undefined}
        onTouchEnd={!is3D ? handleTouchEnd : undefined}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {is3D ? (
          // @ts-ignore - model-viewer is a web component
          <model-viewer
            src={currentItem.modelUrl || currentItem.url}
            alt={currentItem.caption || 'Interactive 3D model'}
            auto-rotate
            camera-controls
            shadow-intensity="1"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <img
              ref={imageRef}
              src={currentItem.url}
              alt={currentItem.caption || 'Media item'}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/800x600?text=Image+Not+Available';
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex === items.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors ${
              currentIndex === items.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Caption and Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4">
        {currentItem.caption && (
          <p className="text-white text-sm mb-2">{currentItem.caption}</p>
        )}
        {currentItem.credit && (
          <p className="text-gray-300 text-xs mb-3">Credit: {currentItem.credit}</p>
        )}

        {/* Thumbnails */}
        {items.length > 1 && (
          <div className="flex gap-2 justify-center overflow-x-auto py-2">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  resetView();
                }}
                className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-[var(--oxford-gold)] scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {item.type === '3d' || item.modelUrl ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-xs">
                    3D
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        {items.length > 1 && (
          <p className="text-gray-400 text-xs text-center mt-2">
            {currentIndex + 1} / {items.length}
          </p>
        )}
      </div>
    </div>
  );
}

// Declare model-viewer custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          'shadow-intensity'?: string;
          poster?: string;
        },
        HTMLElement
      >;
    }
  }
}
