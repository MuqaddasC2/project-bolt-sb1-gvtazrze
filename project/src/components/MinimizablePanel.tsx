import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MinimizablePanelProps {
  title: string;
  children: React.ReactNode;
  isRunning?: boolean;
  autoMinimize?: boolean;
}

export const MinimizablePanel: React.FC<MinimizablePanelProps> = ({ 
  title, 
  children, 
  isRunning = false,
  autoMinimize = false 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoMinimize && isRunning) {
      setIsMinimized(true);
    }
  }, [isRunning, autoMinimize]);

  const toggleMinimize = () => {
    if (contentRef.current) {
      contentRef.current.style.setProperty('--expanded-height', `${contentRef.current.scrollHeight}px`);
    }
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={toggleMinimize}
      >
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">{title}</h2>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? (
            <ChevronDown className="w-5 h-5 transform transition-transform hover:scale-110" />
          ) : (
            <ChevronUp className="w-5 h-5 transform transition-transform hover:scale-110" />
          )}
        </button>
      </div>
      
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isMinimized ? 'max-h-0' : 'max-h-[var(--expanded-height)]'
        }`}
        style={{
          '--expanded-height': contentRef.current ? `${contentRef.current.scrollHeight}px` : 'auto'
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
};