
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CaptureIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CloseIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let streamInstance: MediaStream;

    const startCamera = async () => {
      try {
        streamInstance = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = streamInstance;
        }
        setStream(streamInstance);
      } catch (err) {
        console.warn("Could not get environment camera, trying default: ", err);
         try {
            streamInstance = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = streamInstance;
            }
            setStream(streamInstance);
            setError(null);
         } catch (finalErr) {
             console.error("Error accessing any camera: ", finalErr);
             setError("Could not access camera. Please check permissions and ensure it's not in use by another app.");
         }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]); // Re-run if stream changes, though it won't in this case. Used to satisfy linter for cleanup.

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(capturedFile);
          }
        }, 'image/jpeg');
      }
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="camera-modal-title">
      <h2 id="camera-modal-title" className="sr-only">Camera View</h2>
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" aria-label="Live camera feed"></video>
      <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas>

      {error && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/80 p-4 rounded-md text-white text-center shadow-lg">
             <p>{error}</p>
             <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition-colors">Close</button>
         </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center items-center">
         <button
          onClick={handleCapture}
          disabled={!!error}
          className="w-20 h-20 bg-white/30 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-50 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
          aria-label="Capture photo"
        >
            <CaptureIcon />
        </button>
      </div>

      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close camera"
      >
          <CloseIcon />
      </button>
    </div>
  );
};
