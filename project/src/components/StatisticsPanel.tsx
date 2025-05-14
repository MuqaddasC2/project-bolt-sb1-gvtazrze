import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationStats } from '../types';

interface StatisticsPanelProps {
  stats: SimulationStats[];
  currentDay: number;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats, currentDay }) => {
  // Get current statistics
  const currentStats = stats.length > 0 ? stats[stats.length - 1] : {
    day: 0,
    susceptible: 0,
    exposed: 0,
    infectious: 0,
    recovered: 0,
    newCases: 0,
    totalCases: 0
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      {/* Summary tiles */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
          <h3 className="text-sm text-green-800 dark:text-green-200">Susceptible</h3>
          <p className="text-xl font-semibold text-green-700 dark:text-green-100">{currentStats.susceptible}</p>
        </div>
        
        <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
          <h3 className="text-sm text-yellow-800 dark:text-yellow-200">Exposed</h3>
          <p className="text-xl font-semibold text-yellow-700 dark:text-yellow-100">{currentStats.exposed}</p>
        </div>
        
        <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
          <h3 className="text-sm text-red-800 dark:text-red-200">Infectious</h3>
          <p className="text-xl font-semibold text-red-700 dark:text-red-100">{currentStats.infectious}</p>
        </div>
        
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
          <h3 className="text-sm text-blue-800 dark:text-blue-200">Recovered</h3>
          <p className="text-xl font-semibold text-blue-700 dark:text-blue-100">{currentStats.recovered}</p>
        </div>
      </div>
      
      {/* Additional statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-sm text-gray-600 dark:text-gray-300">Current Day</h3>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{currentDay}</p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-sm text-gray-600 dark:text-gray-300">New Cases</h3>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{currentStats.newCases}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="text-sm text-gray-600 dark:text-gray-300">Total Cases</h3>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{currentStats.totalCases}</p>
        </div>
      </div>
      
      {/* Chart */}
      {stats.length > 1 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }} 
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="susceptible" stroke="#4ade80" name="Susceptible" />
              <Line type="monotone" dataKey="exposed" stroke="#facc15" name="Exposed" />
              <Line type="monotone" dataKey="infectious" stroke="#ef4444" name="Infectious" />
              <Line type="monotone" dataKey="recovered" stroke="#3b82f6" name="Recovered" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;