import React, { useState, useEffect, useCallback } from 'react';
import { generateNetwork } from './models/networkGenerator';
import { simulateDay } from './models/diseaseModel';
import NetworkGraph from './components/NetworkGraph';
import { MinimizablePanel } from './components/MinimizablePanel';
import SimulationControls from './components/SimulationControls';
import StatisticsPanel from './components/StatisticsPanel';
import IntroAnimation from './components/IntroAnimation';
import Tutorial from './components/Tutorial';
import { Network, SimulationParams, SimulationStats } from './types';

function App() {
  // Default simulation parameters
  const defaultParams: SimulationParams = {
    populationSize: 200,
    initialInfections: 5,
    transmissionRate: 0.05,
    exposedDays: 3,
    recoveryDays: 14,
    immunityDays: null,
    connectionsPerPerson: 5,
    communityCount: 5
  };

  // State
  const [showIntro, setShowIntro] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [network, setNetwork] = useState<Network>({ people: [], links: [] });
  const [stats, setStats] = useState<SimulationStats[]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Show tutorial after intro
  useEffect(() => {
    if (!showIntro) {
      setShowTutorial(true);
    }
  }, [showIntro]);

  // Initialize simulation
  useEffect(() => {
    initializeSimulation();
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulation runner
  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = window.setInterval(() => {
        stepSimulation();
      }, 1000 / speed);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, network, currentDay, speed]);

  const initializeSimulation = useCallback(() => {
    const newNetwork = generateNetwork(params);
    setNetwork(newNetwork);
    setCurrentDay(0);
    
    const initialStats: SimulationStats = {
      day: 0,
      susceptible: newNetwork.people.filter(p => p.status === 'SUSCEPTIBLE').length,
      exposed: newNetwork.people.filter(p => p.status === 'EXPOSED').length,
      infectious: newNetwork.people.filter(p => p.status === 'INFECTIOUS').length,
      recovered: newNetwork.people.filter(p => p.status === 'RECOVERED').length,
      newCases: params.initialInfections,
      totalCases: params.initialInfections
    };
    
    setStats([initialStats]);
    setIsRunning(false);
  }, [params]);

  const stepSimulation = useCallback(() => {
    const { updatedNetwork, stats: newStats } = simulateDay(network, params, currentDay + 1);
    setNetwork(updatedNetwork);
    setCurrentDay(prev => prev + 1);
    setStats(prev => [...prev, newStats]);
    
    if (newStats.infectious === 0 && newStats.exposed === 0) {
      setIsRunning(false);
    }
  }, [network, params, currentDay]);

  const togglePlayPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleParamChange = (newParams: Partial<SimulationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const graphWidth = Math.min(windowSize.width - 40, 800);
  const graphHeight = 500;

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <header className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            {/* Biohazard Logo */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-12 h-12"
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
            
            {/* DISTRES text with gradient effect */}
            <div 
              className="text-3xl font-bold tracking-wider bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(45deg, #3b82f6 0%, #10b981 50%, #ef4444 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))'
              }}
            >
              DISTRES
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NetworkGraph 
              network={network} 
              width={graphWidth} 
              height={graphHeight} 
            />
          </div>
          
          <div className="space-y-6">
            <MinimizablePanel 
              title="Simulation Controls" 
              autoMinimize={true}
              isRunning={isRunning}
            >
              <SimulationControls 
                isRunning={isRunning}
                params={params}
                onTogglePlay={togglePlayPause}
                onStepForward={stepSimulation}
                onReset={initializeSimulation}
                onChangeParams={handleParamChange}
                onSpeedChange={setSpeed}
                speed={speed}
              />
            </MinimizablePanel>
            
            <MinimizablePanel title="Statistics">
              <StatisticsPanel 
                stats={stats} 
                currentDay={currentDay} 
              />
            </MinimizablePanel>
          </div>
        </div>
        
        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>DISTRES - Using Barabási-Albert model and SEIR epidemic model</p>
        </footer>
      </div>
    </>
  );
}

export default App;