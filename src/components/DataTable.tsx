import React, { useState, useMemo } from 'react';
import { parseData } from '../data';
import { Search, ArrowUpDown } from 'lucide-react';
import { cn } from '../utils';

type SortConfig = { key: 'date' | 'person' | 'position' | 'institution'; direction: 'asc' | 'desc' } | null;

export default function DataTable() {
  const data = useMemo(() => parseData(), []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const stats = useMemo(() => {
    const uniquePersons = new Set(data.map(d => d.person));
    const mudurCount = data.filter(d => d.position.toLowerCase().includes('müdür')).length;
    const mustesarCount = data.filter(d => d.position.toLowerCase().includes('müsteşar')).length;
    
    const yearly = data.reduce((acc, curr) => {
      const year = curr.date.split('.')[2] || 'Bilinmiyor';
      if (!acc[year]) acc[year] = 0;
      acc[year]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPersons: uniquePersons.size,
      mudur: mudurCount,
      mustesar: mustesarCount,
      yearly
    };
  }, [data]);

  const handleSort = (key: 'date' | 'person' | 'position' | 'institution') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let processable = [...data];

    // Filter
    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      processable = processable.filter(item => 
        item.person.toLowerCase().includes(lowerQuery) ||
        item.institution.toLowerCase().includes(lowerQuery) ||
        item.position.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    if (sortConfig) {
      processable.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        
        // Basic date string sorting assuming DD.MM.YYYY
        if (sortConfig.key === 'date') {
            const [dA, mA, yA] = valA.split('.');
            const [dB, mB, yB] = valB.split('.');
            valA = `${yA}${mA}${dA}`;
            valB = `${yB}${mB}${dB}`;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processable;
  }, [data, searchTerm, sortConfig]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Search Header */}
      <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/80 backdrop-blur">
        <h2 className="text-2xl font-light tracking-tight text-zinc-400">
          DOCUMENT <span className="text-zinc-100 font-semibold">REGISTRY</span>
        </h2>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search individuals, roles, ministries..."
            className="w-full md:w-96 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary First row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 lg:p-6 bg-zinc-950/30 border-b border-zinc-800">
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Toplam Atanan Kişi</div>
          <div className="text-3xl font-light text-cyan-400">{stats.totalPersons}</div>
        </div>
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Müdür Ataması</div>
          <div className="text-3xl font-light text-violet-400">{stats.mudur}</div>
        </div>
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Müsteşar Ataması</div>
          <div className="text-3xl font-light text-emerald-400">{stats.mustesar}</div>
        </div>
      </div>

      {/* Yearly breakfown */}
      <div className="px-4 lg:px-6 pt-4 pb-2 border-b border-zinc-800 bg-zinc-900/20">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {Object.entries(stats.yearly).sort(([a], [b]) => a.localeCompare(b)).map(([year, count]) => (
            <div key={year} className="flex-shrink-0 flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-zinc-800/80">
              <span className="text-xs font-mono text-zinc-400">{year}</span>
              <span className="text-xs font-semibold text-zinc-200">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto pointer-events-auto p-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-zinc-900 text-[10px] uppercase tracking-wider font-bold text-zinc-500 border-b border-zinc-800 z-10">
            <tr>
              {[
                {label: 'Date', key: 'date'}, 
                {label: 'Person', key: 'person'}, 
                {label: 'Position', key: 'position'}, 
                {label: 'Institution', key: 'institution'}
              ].map(({label, key}) => (
                <th key={key} className="px-3 py-2 cursor-pointer hover:text-zinc-300 transition-colors group" onClick={() => handleSort(key as any)}>
                  <div className="flex items-center gap-2">
                    {label}
                    <ArrowUpDown className={cn("w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity", sortConfig?.key === key && "opacity-100 text-cyan-500")} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs text-zinc-400">
            {filteredAndSortedData.map((row, i) => (
              <tr key={i} className="hover:bg-zinc-800 rounded transition-colors cursor-pointer border-b border-zinc-800/30 group">
                <td className="px-3 py-2 whitespace-nowrap text-zinc-500 font-mono">{row.date}</td>
                <td className="px-3 py-2 font-medium text-zinc-100 group-hover:text-cyan-200 transition-colors">{row.person}</td>
                <td className="px-3 py-2 text-zinc-400">{row.position}</td>
                <td className="px-3 py-2 text-zinc-500 group-hover:text-violet-300 transition-colors">{row.institution}</td>
              </tr>
            ))}
            {filteredAndSortedData.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-zinc-500">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
