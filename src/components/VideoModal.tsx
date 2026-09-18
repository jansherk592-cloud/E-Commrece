import React from 'react';
import { X, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const VideoModal: React.FC = () => {
  const { activeVideoUrl, setActiveVideoUrl } = useStore();

  if (!activeVideoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center space-x-2 text-stone-200">
            <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" />
            <span className="font-semibold text-sm tracking-wide">Product Video Demonstration</span>
          </div>
          <button
            id="close-video-modal-btn"
            onClick={() => setActiveVideoUrl(null)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            title="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            src={activeVideoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML video playback.
          </video>
        </div>

        <div className="px-6 py-3 bg-stone-950 flex items-center justify-between text-xs text-stone-400">
          <span>HD 1080p Product Showcase</span>
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="text-stone-300 hover:text-white underline underline-offset-4"
          >
            Done watching
          </button>
        </div>
      </div>
    </div>
  );
};
