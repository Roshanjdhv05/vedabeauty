import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="w-full bg-white rounded-2xl overflow-hidden animate-pulse">
        <div className="aspect-[4/5] bg-gray-200 w-full" />
        <div className="p-4 space-y-3">
          <div className="h-2 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 w-1/4 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="w-full h-[60vh] md:h-[80vh] bg-gray-200 animate-pulse flex flex-col items-center justify-center space-y-6">
        <div className="h-12 w-2/3 bg-gray-300 rounded-lg" />
        <div className="h-6 w-1/2 bg-gray-300 rounded-lg" />
        <div className="h-12 w-32 bg-gray-300 rounded-full" />
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
