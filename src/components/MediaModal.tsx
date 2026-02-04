import { useEffect } from 'react';
import MediaViewer from './MediaViewer';

interface MediaItem {
  url: string;
  caption?: string;
  credit?: string;
  type?: 'image' | '3d';
  modelUrl?: string;
}

interface MediaModalProps {
  items: MediaItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaModal({
  items,
  initialIndex = 0,
  isOpen,
  onClose,
}: MediaModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh]">
        <MediaViewer
          items={items}
          initialIndex={initialIndex}
          onClose={onClose}
          isFullscreen={false}
        />
      </div>
    </div>
  );
}
