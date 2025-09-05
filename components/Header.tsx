
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 text-center bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Vision AI
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Image Recognition & Analysis</p>
    </header>
  );
};
