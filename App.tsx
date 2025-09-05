
import React, { useState, useCallback } from 'react';
import { analyzeImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptControls } from './components/PromptControls';
import { ResponseDisplay } from './components/ResponseDisplay';
import { Footer } from './components/Footer';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Loader } from './components/Loader';
import { CameraCapture } from './components/CameraCapture';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResponse('');
    setError('');
  }, []);

  const handleCapture = useCallback((file: File) => {
    handleImageUpload(file);
    setIsCameraOpen(false);
  }, [handleImageUpload]);

  const handleClearImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setResponse('');
    setError('');
    setPrompt('');
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const handleSubmit = useCallback(async () => {
    if (!imageFile || !prompt.trim()) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setResponse('');
    setError('');

    try {
      const base64Image = await fileToBase64(imageFile);
      const apiResponse = await analyzeImage(base64Image, imageFile.type, prompt);
      setResponse(apiResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to analyze image: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
          <ImageUploader
            imagePreview={imagePreview}
            onImageUpload={handleImageUpload}
            onClearImage={handleClearImage}
            onOpenCamera={() => setIsCameraOpen(true)}
          />

          {imagePreview && (
            <PromptControls
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}

          {error && <ErrorDisplay message={error} />}
          
          {isLoading && <Loader />}
          
          {response && <ResponseDisplay response={response} />}
        </div>
      </main>
      <Footer />
      {isCameraOpen && (
        <CameraCapture
            onCapture={handleCapture}
            onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};

export default App;