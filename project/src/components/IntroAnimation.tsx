import React, { useEffect, useState } from 'react';

const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
    const completeTimer = setTimeout(onComplete, 3000);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-8 relative">
        {/* Background shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-100px] left-[-100px] w-48 h-48 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-[-80px] right-[-80px] w-40 h-40 bg-green-500/20 rounded-full blur-xl"></div>
          <div className="absolute top-[50%] right-[-120px] w-36 h-36 bg-red-500/20 rounded-full blur-xl"></div>
        </div>

        <div className="relative">
          {/* Biohazard Logo */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-32 h-32 mx-auto animate-spin-slow"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))'
            }}
          >
            <path
              fill="url(#logoGradient)"
              d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 40c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z M50 35c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 20c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
            />
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 animate-ping-slow rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500 opacity-20"></div>
        </div>
        
        {/* DISTRES text with gradient effect */}
        <div 
          className="text-7xl font-bold tracking-wider bg-clip-text text-transparent"
          style={{
            background: 'linear-gradient(45deg, #3b82f6 0%, #10b981 50%, #ef4444 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))'
          }}
        >
          DISTRES
        </div>
        
        {/* Full form with gradient colors */}
        <div className="text-2xl tracking-wide space-x-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">Disease</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500">Tracking</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">Evaluation System</span>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;