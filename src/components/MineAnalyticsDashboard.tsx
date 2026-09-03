import React, { useState, useMemo } from 'react';
import { MOCK_MINES, realMinesMetadata } from '../data/mockData';
import { StateWiseFilter } from './StateWiseFilter';
import { MineSite } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, AlertCircle } from 'lucide-react';

/**
 * Example Component: MineAnalyticsDashboard
 * 
 * This component demonstrates how to integrate the real coal mines dataset
 * with state-wise filtering and analytics.
 */
export const MineAnalyticsDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filteredMines, setFilteredMines] = useState<MineSite[]>(MOCK_MINES);

  // Calculate statistics for selected mines
  const statistics = useMemo(() => {
    const mines = filteredMines;
    const totalProduction = mines.reduce((sum, m) => sum + m.currentProductionMT, 0);
    const avgProduction = mines.length > 0 ? totalProduction / mines.length : 0;
    const avgWorkforce = Math.floor(
      mines.reduce((sum, m) => sum + (m.activeWorkforce || 0), 0) / mines.length
    );

    return {
      totalMines: mines.length,
      totalProduction: totalProduction.toFixed(2),
      avgProduction: avgProduction.toFixed(2),
      avgWorkforce,
      highCompliance: mines.filter(m => (m.complianceScore || 0) >= 90).length,
      lowCompliance: mines.filter(m => (m.complianceScore || 0) < 75).length
    };
  }, [filteredMines]);

  // Compliance distribution
  const complianceData = useMemo(() => {
    return [
      { range: '90+', count: filteredMines.filter(m => (m.complianceScore || 0) >= 90).length },
      { range: '75-89', count: filteredMines.filter(m => (m.complianceScore || 0) >= 75 && (m.complianceScore || 0) < 90).length },
      { range: '<75', count: filteredMines.filter(m => (m.complianceScore || 0) < 75).length }
    ];
  }, [filteredMines]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-slate-700 pb-6">
        <h1 className="text-4xl font-bold mb-2">Coal Mines Analytics Dashboard</h1>
        <p className="text-slate-400">
          Real-time monitoring of {realMinesMetadata.totalMines} coal mines across India
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-blue-200 mb-1">Total Mines</div>
          <div className="text-3xl font-bold">{statistics.totalMines}</div>
          <div className="text-xs text-blue-300 mt-2">
            {selectedState && `in ${selectedState}`}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-green-200 mb-1">Total Production</div>
          <div className="text-3xl font-bold">{statistics.totalProduction} MT</div>
          <div className="text-xs text-green-300 mt-2">2019-2020</div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-purple-200 mb-1">Avg Production</div>
          <div className="text-3xl font-bold">{statistics.avgProduction} MT</div>
          <div className="text-xs text-purple-300 mt-2">per mine</div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-orange-200 mb-1">Avg Workforce</div>
          <div className="text-3xl font-bold">{statistics.avgWorkforce}</div>
          <div className="text-xs text-orange-300 mt-2">employees</div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High Compliance */}
        <div className="bg-gradient-to-br from-green-900 to-emerald-900 p-6 rounded-lg shadow-lg border border-green-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">High Compliance (90+)</h3>
            <span className="text-2xl font-bold text-green-400">{statistics.highCompliance}</span>
          </div>
          <p className="text-sm text-green-300">
            {((statistics.highCompliance / statistics.totalMines) * 100).toFixed(1)}% of mines meet compliance standards
          </p>
        </div>

        {/* Low Compliance */}
        <div className="bg-gradient-to-br from-red-900 to-rose-900 p-6 rounded-lg shadow-lg border border-red-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold">Needs Attention (&lt;75)</h3>
            </div>
            <span className="text-2xl font-bold text-red-400">{statistics.lowCompliance}</span>
          </div>
          <p className="text-sm text-red-300">
            {((statistics.lowCompliance / statistics.totalMines) * 100).toFixed(1)}% require compliance improvement
          </p>
        </div>
      </div>

      {/* Compliance Distribution Chart */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5" />
          Compliance Score Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={complianceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="range" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* State-Wise Filter Component */}
      <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
        <StateWiseFilter
          mines={MOCK_MINES}
          onStateSelect={setSelectedState}
          onMinesFiltered={setFilteredMines}
        />
      </div>

      {/* Mine Details Table - Top 10 */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 overflow-x-auto">
        <h3 className="text-lg font-bold mb-4">Top Producing Mines (by Selection)</h3>
        <table className="w-full text-sm">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Mine Name</th>
              <th className="px-4 py-3 text-left">State</th>
              <th className="px-4 py-3 text-center">District</th>
              <th className="px-4 py-3 text-right">Production (MT)</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-center">Compliance</th>
            </tr>
          </thead>
          <tbody>
            {filteredMines
              .sort((a, b) => b.currentProductionMT - a.currentProductionMT)
              .slice(0, 10)
              .map((mine, idx) => (
                <tr
                  key={mine.id}
                  className={`border-t border-slate-700 ${
                    idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'
                  } hover:bg-slate-700 transition-colors`}
                >
                  <td className="px-4 py-3 font-semibold">{mine.name}</td>
                  <td className="px-4 py-3">{mine.state}</td>
                  <td className="px-4 py-3 text-center text-sm text-slate-400">{mine.district}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-400">
                    {mine.currentProductionMT.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      mine.type === 'OPENCAST' ? 'bg-blue-600' :
                      mine.type === 'UNDERGROUND' ? 'bg-purple-600' :
                      'bg-orange-600'
                    }`}>
                      {mine.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      (mine.complianceScore || 0) >= 90 ? 'bg-green-600' :
                      (mine.complianceScore || 0) >= 75 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}>
                      {mine.complianceScore || 0}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filteredMines.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No mines found for the selected criteria.
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-700">
        <p>Data Source: Indian Coal Mines Dataset (January 2021) | Last Updated: August 30, 2026</p>
        <p>Total Records: {realMinesMetadata.totalMines} | States: {Object.keys(realMinesMetadata.minesByState).length}</p>
      </div>
    </div>
  );
};

export default MineAnalyticsDashboard;
