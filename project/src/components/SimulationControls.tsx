import React from 'react';
import { Play, Pause, SkipForward, RefreshCw } from 'lucide-react';
import { SimulationParams } from '../types';

interface SimulationControlsProps {
  isRunning: boolean;
  params: SimulationParams;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onChangeParams: (newParams: Partial<SimulationParams>) => void;
  onSpeedChange: (speed: number) => void;
  speed: number;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  params,
  onTogglePlay,
  onStepForward,
  onReset,
  onChangeParams,
  onSpeedChange,
  speed
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      {/* Playback controls */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={onTogglePlay}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
          aria-label={isRunning ? 'Pause' : 'Play'}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={onStepForward}
          className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-2 rounded-md transition-colors"
          aria-label="Step Forward"
          disabled={isRunning}
        >
          <SkipForward size={20} />
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
          aria-label="Reset Simulation"
        >
          <RefreshCw size={20} />
        </button>
        
        <div className="flex-1">
          <label className="block text-sm text-gray-600 dark:text-gray-400">
            Speed: {speed}x
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Parameters */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">
              Population Size
            </label>
            <input
              type="number"
              value={params.populationSize}
              onChange={(e) => onChangeParams({ populationSize: parseInt(e.target.value) })}
              min="100"
              max="5000"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">
              Initial Infections
            </label>
            <input
              type="number"
              value={params.initialInfections}
              onChange={(e) => onChangeParams({ initialInfections: parseInt(e.target.value) })}
              min="1"
              max={params.populationSize}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isRunning}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400">
            Transmission Rate: {params.transmissionRate}
          </label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={params.transmissionRate}
            onChange={(e) => onChangeParams({ transmissionRate: parseFloat(e.target.value) })}
            className="w-full"
            disabled={isRunning}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">
              Exposure Days
            </label>
            <input
              type="number"
              value={params.exposedDays}
              onChange={(e) => onChangeParams({ exposedDays: parseInt(e.target.value) })}
              min="1"
              max="14"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">
              Recovery Days
            </label>
            <input
              type="number"
              value={params.recoveryDays}
              onChange={(e) => onChangeParams({ recoveryDays: parseInt(e.target.value) })}
              min="1"
              max="30"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isRunning}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">
              Connections Per Person
            </label>
            <input
              type="number"
              value={params.connectionsPerPerson}
              onChange={(e) => onChangeParams({ connectionsPerPerson: parseInt(e.target.value) })}
              min="2"
              max="20"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400">
              Communities
            </label>
            <input
              type="number"
              value={params.communityCount}
              onChange={(e) => onChangeParams({ communityCount: parseInt(e.target.value) })}
              min="1"
              max="10"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;