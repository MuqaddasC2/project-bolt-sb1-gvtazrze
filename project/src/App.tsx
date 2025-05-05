import React, { useState, useEffect, useCallback } from 'react';
import { generateNetwork } from './models/networkGenerator';
import { simulateDay } from './models/diseaseModel';
import NetworkGraph from './components/NetworkGraph';
import SimulationControls from './components/SimulationControls';
import StatisticsPanel from './components/StatisticsPanel';
import { Network, SimulationParams, SimulationStats } from './types';

function App() {
  // Default simulation parameters
  const defaultParams: SimulationParams = {
    populationSize: 200, // Smaller for performance in browser
    initialInfections: 5,
    transmissionRate: 0.05,
    exposedDays: 3,
    recoveryDays: 14,
    immunityDays: null, // No waning immunity
    connectionsPerPerson: 5,
    communityCount: 5
  };

  // State
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
      }, 1000 / speed); // Adjust speed based on slider
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, network, currentDay, speed]);

  // Reset simulation with current parameters
  const initializeSimulation = useCallback(() => {
    const newNetwork = generateNetwork(params);
    setNetwork(newNetwork);
    setCurrentDay(0);
    
    // Calculate initial statistics
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

  // Advance simulation by one day
  const stepSimulation = useCallback(() => {
    const { updatedNetwork, stats: newStats } = simulateDay(network, params, currentDay + 1);
    setNetwork(updatedNetwork);
    setCurrentDay(prev => prev + 1);
    setStats(prev => [...prev, newStats]);
    
    // Auto-stop if disease dies out
    if (newStats.infectious === 0 && newStats.exposed === 0) {
      setIsRunning(false);
    }
  }, [network, params, currentDay]);

  // Toggle simulation running state
  const togglePlayPause = () => {
    setIsRunning(prev => !prev);
  };

  // Update simulation parameters
  const handleParamChange = (newParams: Partial<SimulationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // Calculate graph size based on container
  const graphWidth = Math.min(windowSize.width - 40, 800);
  const graphHeight = 500;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Infectious Disease Spread Simulation
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Modeling disease spread through a social network using SEIR model
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main visualization area */}
        <div className="lg:col-span-2">
          <NetworkGraph 
            network={network} 
            width={graphWidth} 
            height={graphHeight} 
          />
        </div>
        
        {/* Controls and stats */}
        <div className="space-y-6">
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
          
          <StatisticsPanel 
            stats={stats} 
            currentDay={currentDay} 
          />
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Disease Simulation Project - Using Barabási-Albert model and SEIR epidemic model</p>
      </footer>
    </div>
  );
}

export default App;