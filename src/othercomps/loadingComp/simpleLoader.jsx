import React, { useState, useEffect } from 'react';

const SimpleLoader = ({ message = 'Loading...' }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        <h3 className="text-xl font-light text-white">
          {message}
          {dots}
        </h3>
      </div>
    </div>
  );
};

export default SimpleLoader;
