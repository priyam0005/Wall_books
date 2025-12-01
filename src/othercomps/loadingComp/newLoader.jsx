import React, { useState, useEffect } from 'react';

export default function PremiumLoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0a0a0a] to-[#000000] overflow-hidden flex items-center justify-center">
      {/* Ambient Glow Effects */}
      <div
        className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-30 blur-3xl bg-gradient-radial from-gray-400/10 to-transparent animate-pulse"
        style={{ animationDuration: '4s' }}
      ></div>
      <div
        className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-30 blur-3xl bg-gradient-radial from-gray-400/10 to-transparent animate-pulse"
        style={{ animationDuration: '4s', animationDelay: '2s' }}
      ></div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gray-400/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        ></div>
      ))}

      {/* Main Loading Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Monogram */}
        <div className="relative w-32 h-32 mb-12">
          {/* Outer Rotating Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-gray-400/40 animate-spin-slow shadow-[0_0_30px_rgba(192,192,192,0.3)]"
            style={{
              borderImage:
                'linear-gradient(45deg, #c0c0c0, #808080, #c0c0c0, #808080) 1',
              animationDuration: '4s',
            }}
          ></div>

          {/* Inner Circle with Neumorphic Effect */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_2px_8px_rgba(192,192,192,0.1)] flex items-center justify-center">
            {/* Monogram */}
            <div className="relative">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="drop-shadow-[0_0_10px_rgba(192,192,192,0.5)]"
              >
                <defs>
                  <linearGradient
                    id="silverGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: '#ffffff', stopOpacity: 1 }}
                    />
                    <stop
                      offset="50%"
                      style={{ stopColor: '#c0c0c0', stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: '#a0a0a0', stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M12 8 L24 2 L36 8 L36 28 L24 38 L12 28 Z"
                  fill="none"
                  stroke="url(#silverGradient)"
                  strokeWidth="2"
                  className="animate-pulse"
                  style={{ animationDuration: '3s' }}
                />
                <circle
                  cx="24"
                  cy="20"
                  r="4"
                  fill="url(#silverGradient)"
                  className="animate-pulse"
                  style={{ animationDuration: '2s' }}
                />
              </svg>
            </div>
          </div>

          {/* Glow Effect */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400/20 to-transparent blur-xl animate-pulse"
            style={{ animationDuration: '3s' }}
          ></div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-[#1a1a1a] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] mb-6">
          <div
            className="h-full bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-full shadow-[0_0_10px_rgba(192,192,192,0.5)] transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="text-gray-400 text-sm font-light tracking-[0.3em] mb-2">
          {progress}%
        </div>

        {/* Loading Text */}
        <div className="text-gray-300 text-xs font-extralight tracking-[0.4em] uppercase flex items-center gap-1">
          <span>Initializing</span>
          <span className="flex gap-0.5">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>
              .
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              .
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
              .
            </span>
          </span>
        </div>

        {/* Status Text */}
        <div className="mt-8 text-gray-500 text-xs font-thin tracking-widest">
          SYSTEM READY
        </div>
      </div>

      {/* Bottom Corner Accent */}
      <div className="absolute bottom-8 right-8 text-gray-600 text-[10px] font-thin tracking-[0.3em] uppercase">
        v4.5.0
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
