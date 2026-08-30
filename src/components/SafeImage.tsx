import React, { useState, useEffect } from 'react';
import { Leaf, User, AlertCircle, Sparkles, Sprout, Bug } from 'lucide-react';

interface SafeImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  containerClassName?: string;
  fallbackType?: 'crop' | 'avatar' | 'leaf' | 'general';
  cropName?: string;
  expertName?: string;
  icon?: string;
  loading?: 'lazy' | 'eager';
  title?: string;
}

// Map crop names to specialized vibrant gradient backgrounds and emojis
const cropVisualMap: Record<string, { bg: string; icon: string; text: string }> = {
  tomato: { bg: 'from-rose-500/20 to-red-600/30 text-rose-700', icon: '🍅', text: 'Tomato Leaf' },
  cotton: { bg: 'from-sky-500/20 to-blue-600/30 text-sky-700', icon: '☁️', text: 'Cotton Boll' },
  rice: { bg: 'from-emerald-500/20 to-green-600/30 text-emerald-700', icon: '🌾', text: 'Rice Leaf' },
  paddy: { bg: 'from-emerald-500/20 to-green-600/30 text-emerald-700', icon: '🌾', text: 'Paddy Leaf' },
  wheat: { bg: 'from-amber-500/20 to-yellow-600/30 text-amber-700', icon: '🌾', text: 'Wheat Leaf' },
  chili: { bg: 'from-red-500/20 to-orange-600/30 text-red-700', icon: '🌶️', text: 'Chili Foliage' },
  corn: { bg: 'from-yellow-500/20 to-amber-600/30 text-amber-700', icon: '🌽', text: 'Corn Whorl' },
  maize: { bg: 'from-yellow-500/20 to-amber-600/30 text-amber-700', icon: '🌽', text: 'Maize Whorl' },
  potato: { bg: 'from-amber-600/20 to-orange-700/30 text-amber-800', icon: '🥔', text: 'Potato Foliage' },
  onion: { bg: 'from-purple-500/20 to-pink-600/30 text-purple-700', icon: '🧅', text: 'Onion Foliage' },
  soybean: { bg: 'from-lime-500/20 to-green-600/30 text-lime-800', icon: '🌱', text: 'Soybean Plant' },
  sugarcane: { bg: 'from-emerald-600/20 to-teal-700/30 text-teal-800', icon: '🎋', text: 'Sugarcane Cane' }
};

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Image',
  className = 'w-full h-full object-cover',
  containerClassName = '',
  fallbackType = 'crop',
  cropName,
  expertName,
  icon,
  loading = 'lazy',
  title
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const cleanCropKey = cropName ? cropName.toLowerCase().split(/[\s()]+/)[0] : '';
  const cropConfig = cleanCropKey ? cropVisualMap[cleanCropKey] : null;

  // Determine fallback render
  const renderFallback = () => {
    if (fallbackType === 'avatar') {
      const initials = expertName
        ? expertName
            .replace(/^Dr\.\s*|^Er\.\s*/i, '')
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'KV';

      return (
        <div
          className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black select-none ${className}`}
        >
          <span className="text-sm font-extrabold tracking-wider">{initials}</span>
        </div>
      );
    }

    // Default crop fallback with botanical icon & theme
    const bgClass = cropConfig ? cropConfig.bg : 'from-emerald-500/20 to-teal-600/30 text-emerald-800';
    const displayEmoji = icon || (cropConfig ? cropConfig.icon : '🌿');
    const label = cropName || alt || 'Crop Sample';

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-br ${bgClass} bg-slate-100 relative overflow-hidden select-none`}
      >
        {/* Subtle decorative leaf pattern in background */}
        <div className="absolute -right-2 -bottom-2 opacity-15 pointer-events-none">
          <Leaf className="w-16 h-16 text-current" />
        </div>

        <span className="text-2xl sm:text-3xl filter drop-shadow-sm mb-0.5">{displayEmoji}</span>
        <span className="text-[10px] font-black uppercase tracking-wider text-center line-clamp-1 opacity-90">
          {label}
        </span>
      </div>
    );
  };

  if (!src || hasError) {
    return <div className={`relative overflow-hidden ${containerClassName}`}>{renderFallback()}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        title={title || alt}
        loading={loading}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => {
          setHasError(true);
        }}
        onLoad={() => {
          setIsLoaded(true);
        }}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-80'}`}
      />
    </div>
  );
};
