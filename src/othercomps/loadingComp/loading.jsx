import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

const LoadingPage = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-8">
        {/* Animated Wallbooks Logo */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin"></div>

          {/* Inner rotating ring - reverse direction */}
          <div
            className="absolute inset-3 border-4 border-gray-800 border-b-purple-400 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>

          {/* Center icon */}
          <div className="absolute inset-6 bg-gray-800 rounded-full flex items-center justify-center border-2 border-purple-500/30">
            <BookOpen className="w-12 h-12 text-purple-400 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Loading Wallbooks{dots}
          </h2>
          <p className="text-gray-400 text-sm">
            Please wait while we fetch your data
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full animate-loading-bar"></div>
          </div>
        </div>

        {/* Floating Dots */}
        <div className="flex justify-center gap-2">
          <div
            className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.15s' }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-purple-300 rounded-full animate-bounce"
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { 
            transform: translateX(-100%); 
            width: 40%;
          }
          50% {
            width: 70%;
          }
          100% { 
            transform: translateX(400%); 
            width: 40%;
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
