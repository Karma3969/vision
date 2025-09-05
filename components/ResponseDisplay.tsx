
import React from 'react';

interface ResponseDisplayProps {
  response: string;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  return (
    <div className="mt-6 w-full">
        <h2 className="text-2xl font-semibold text-gray-200 border-b-2 border-cyan-500/50 pb-2 mb-4">
            Analysis Result
        </h2>
        <div className="bg-gray-700/30 p-4 rounded-md space-y-4 text-gray-300 whitespace-pre-wrap">
            <p>{response}</p>
        </div>
    </div>
  );
};
