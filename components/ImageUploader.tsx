
import React, { useRef } from 'react';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageUpload: (file: File) => void;
  onClearImage: () => void;
  onOpenCamera: () => void;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClearIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
)

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageUpload, onClearImage, onOpenCamera }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {imagePreview ? (
        <div className="relative group">
          <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md" />
          <button
            onClick={onClearImage}
            className="absolute top-3 right-3 bg-gray-900/70 text-white px-3 py-1.5 rounded-full flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
          >
            <ClearIcon />
            Clear Image
          </button>
        </div>
      ) : (
        <div
          className="w-full border-2 border-dashed border-gray-600 rounded-lg p-8 text-center transition-colors duration-300"
        >
          <div className="flex flex-col items-center">
            <UploadIcon />
            <p className="mt-4 text-lg font-semibold text-gray-400">Add an image</p>
            <p className="text-sm text-gray-500 mb-6">Upload a file or use your device's camera.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <button
                    onClick={handleClick}
                    className="flex-1 justify-center items-center py-2 px-4 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
                    aria-label="Upload an image file"
                >
                    Upload File
                </button>
                <button
                    onClick={onOpenCamera}
                    className="flex-1 justify-center items-center py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
                    aria-label="Use device camera"
                >
                    Use Camera
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};