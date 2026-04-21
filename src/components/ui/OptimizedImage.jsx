import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Skeleton loader while loading
 * - Smooth fade-in transition
 * - Lazy loading by default
 * - Error fallback handling
 * - Aspect ratio support
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '',
  loading = 'lazy',
  fallbackSrc = 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=300',
  aspectRatio = 'aspect-square',
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Update currentSrc if src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setCurrentSrc(fallbackSrc);
  };

  return (
    <div 
      className={`relative overflow-hidden ${aspectRatio} ${containerClassName}`}
      onClick={onClick}
    >
      {/* Skeleton Loader */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          >
            <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`w-full h-full object-cover ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Error Fallback Overlay (Optional hint) */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/10 backdrop-blur-[2px] py-1 px-2 text-[8px] text-white font-medium text-center uppercase tracking-tighter">
          Image Optimized
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
