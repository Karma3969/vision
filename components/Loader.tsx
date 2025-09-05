
import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium';
}

export const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  const sizeClasses = size === 'small' ? 'h-5 w-5' : 'h-8 w-8';
  
  if (size === 'medium') {
    return (
      <div className="flex justify-center items-center py-6">
        <div
          className={`${sizeClasses} animate-pulse-fast border-4 border-purple-400 border-t-transparent rounded-full`}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
  
  return (
    <div
      className={`${sizeClasses} animate-spin border-2 border-white border-t-transparent rounded-full`}
      role="status"
    >
        <span className="sr-only">Loading...</span>
    </div>
  );
};
