import React, { useState, useMemo } from 'react';
import { MineSite } from '../types';
import { 
  getUniqueStates, 
  getMinesCountByState, 
  getProductionByState,
  getMinesByState 
} from '../lib/mineFilters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, TrendingUp } from 'lucide-react';

interface StateWiseFilterProps {
  mines: MineSite[];
  onStateSelect?: (state: string | null) => void;
  onMinesFiltered?: (filteredMines: MineSite[]) => void;
}

export const StateWiseFilter: React.FC<StateWiseFilterProps> = ({
  mines,
  onStateSelect,
  onMinesFiltered
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'chart' | 'list' | 'table'>('chart');

  const states = useMemo(() => getUniqueStates(mines), [mines]);
  const countByState = useMemo(() => getMinesCountByState(mines), [mines]);
  const productionByState = useMemo(() => getProductionByState(mines), [mines]);

  const chartData = useMemo(() => {
    return states.map(state => ({
      name: state,
      mines: countByState[state] || 0,
      production: Math.round(productionByState[state] || 0)
    }));
  }, [states, countByState, productionByState]);

  const filteredMines = useMemo(() => {
    const result = selectedState ? getMinesByState(mines, selectedState) : mines;
    onMinesFiltered?.(result);
    return result;
  }, [mines, selectedState, onMinesFiltered]);

  const handleStateSelect = (state: string | null) => {
    setSelectedState(state);
    onStateSelect?.(state);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-blue-600" />
          State-Wise Coal Mines Distribution
        </h2>
        <p className="text-slate-600">
          Total Mines: <span className="font-bold text-lg">{mines.length}</span> across{' '}
          <span className="font-bold text-lg">{states.length}</span> states
        </p>
      </div>

      {/* View Type Selector */}
      <div className="flex gap-2">
        {(['chart', 'list', 'table'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setViewType(view)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              viewType === view
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart View */}
      {viewType === 'chart' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Mines Count by State</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="mines" 
                  fill="#0088FE"
                  onClick={(data) => handleStateSelect(data.name)}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Total Production by State (MT)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="production" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* List View */}
      {viewType === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => handleStateSelect(selectedState === state ? null : state)}
              className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                selectedState === state
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-800 hover:shadow-lg'
              }`}
            >
              <div className="font-bold text-lg">{state}</div>
              <div className="text-sm mt-2">
                <div>{countByState[state]} mines</div>
                <div>{(productionByState[state] || 0).toFixed(1)} MT/year</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewType === 'table' && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">State</th>
                <th className="px-4 py-3 text-center">Number of Mines</th>
                <th className="px-4 py-3 text-center">Total Production (MT)</th>
                <th className="px-4 py-3 text-center">Avg Production/Mine</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state, idx) => (
                <tr
                  key={state}
                  className={`border-b ${
                    idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-800">{state}</td>
                  <td className="px-4 py-3 text-center text-blue-600 font-bold">
                    {countByState[state]}
                  </td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">
                    {(productionByState[state] || 0).toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {((productionByState[state] || 0) / (countByState[state] || 1)).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleStateSelect(selectedState === state ? null : state)}
                      className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                        selectedState === state
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {selectedState === state ? 'Deselect' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filtered Results */}
      {selectedState && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Mines in {selectedState} ({filteredMines.length} total)
          </h3>
          <button
            onClick={() => handleStateSelect(null)}
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Clear Filter
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredMines.slice(0, 10).map((mine) => (
              <div key={mine.id} className="p-4 bg-slate-50 rounded border border-slate-200">
                <div className="font-semibold text-slate-800">{mine.name}</div>
                <div className="text-sm text-slate-600 mt-1">
                  <div>{mine.district}</div>
                  <div className="text-blue-600 font-semibold mt-1">
                    {mine.currentProductionMT.toFixed(2)} MT/year
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredMines.length > 10 && (
            <p className="text-sm text-slate-600 mt-4">
              ...and {filteredMines.length - 10} more mines
            </p>
          )}
        </div>
      )}
    </div>
  );
};
