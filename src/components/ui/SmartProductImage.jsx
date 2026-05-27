import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SmartProductImage
 *
 * Tries a list of candidate image URLs in order, falling back to the next
 * on each load error, and finally to `fallbackSrc`.
 *
 * Props
 * ─────
 * candidates   string[]   Ordered list of image paths to attempt
 * fallbackSrc  string     Ultimate fallback (e.g. /favicon.jpeg)
 * alt          string
 * loading      'lazy'|'eager'
 * className    string     Classes applied to the <img>
 * objectFit    'contain'|'cover'
 * onClick      fn
 */
const SmartProductImage = ({
  candidates = [],
  fallbackSrc = '/favicon.jpeg',
  alt = '',
  loading = 'lazy',
  className = '',
  objectFit = 'contain',
  onClick,
}) => {
  const allSrcs = [...candidates.filter(Boolean), fallbackSrc];
  const [index, setIndex]       = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const prevCandidates          = useRef(candidates);

  // Reset when the candidate list changes (e.g. shade selected)
  useEffect(() => {
    const prev = prevCandidates.current;
    const changed =
      prev.length !== candidates.length ||
      prev.some((c, i) => c !== candidates[i]);
    if (changed) {
      prevCandidates.current = candidates;
      setIndex(0);
      setIsLoaded(false);
    }
  }, [candidates]);

  const currentSrc = allSrcs[index] || fallbackSrc;

  const handleError = () => {
    if (index < allSrcs.length - 1) {
      setIndex((i) => i + 1);
    }
    // If we've exhausted all candidates, stay on the last (fallback)
  };

  const handleLoad = () => setIsLoaded(true);

  return (
    <div className="relative w-full h-full" onClick={onClick}>
      {/* Skeleton while loading */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center rounded-inherit"
          >
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual image */}
      <motion.img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`w-full h-full ${
          objectFit === 'cover' ? 'object-cover' : 'object-contain'
        } ${className}`}
      />
    </div>
  );
};

export default SmartProductImage;
