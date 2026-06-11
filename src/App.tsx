/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Network, Table2 } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import NetworkMap from './components/NetworkMap';
import DataTable from './components/DataTable';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'table'>('map');

  return (
    <div className="relative w-full h-screen text-zinc-100 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      <FluidBackground />

      {/* Header */}
      <header className="z-10 p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-zinc-950/50 backdrop-blur-md border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-zinc-400">DEVLET ATAMA <span className="text-zinc-100 font-semibold">AĞI</span></h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Kurumsal Atamalar ve Bağlantı Analizi</p>
        </div>
        
        <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'map' 
                ? 'bg-zinc-800 text-cyan-400 shadow-md' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Network className="w-4 h-4" />
            Ağ Haritası
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'table' 
                ? 'bg-zinc-800 text-cyan-400 shadow-md' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Table2 className="w-4 h-4" />
            Liste
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-hidden">
        {activeTab === 'map' ? (
          <div className="absolute inset-0 p-4 md:p-6 pb-6">
            <div className="w-full h-full bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto">
              <NetworkMap />
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 md:p-6 flex justify-center items-start pb-6">
            <DataTable />
          </div>
        )}
      </main>
    </div>
  );
}
