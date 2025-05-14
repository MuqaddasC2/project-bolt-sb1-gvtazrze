import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start fade-in animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 500); // Match the duration of fade-out animation
  };

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-40 transition-all duration-500 ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      } ${isClosing ? 'opacity-0' : 'opacity-100'}`}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full mx-4 relative transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${isClosing ? 'scale-95 opacity-0' : ''}`}
        style={{ 
          maxHeight: '80vh',
          overflowY: 'auto',
          scrollbarGutter: 'stable'
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Welcome to DISTRES
        </h2>

        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            DISTRES (Disease Tracking Evaluation System) simulates how diseases spread through social networks using advanced network modeling and epidemiological principles.
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Key Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interactive network visualization with zoom and drag capabilities</li>
              <li>Real-time statistics and trend analysis</li>
              <li>Customizable simulation parameters</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Controls:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Play/Pause: Start or pause the simulation</li>
              <li>Step Forward: Advance one day at a time</li>
              <li>Reset: Start a new simulation</li>
              <li>Speed: Adjust simulation speed (1-10x)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Parameters:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Population Size: Total number of individuals</li>
              <li>Initial Infections: Starting number of infected people</li>
              <li>Transmission Rate: Probability of disease spread per contact</li>
              <li>Exposure/Recovery Days: Disease progression timeline</li>
              <li>Connections: Social network structure settings</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Node Colors:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Green: Susceptible individuals</li>
              <li>Yellow: Exposed but not yet infectious</li>
              <li>Red: Currently infectious</li>
              <li>Blue: Recovered and immune</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;