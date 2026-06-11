import React, { useMemo, useRef, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserRound, Building2, Maximize, Minimize } from 'lucide-react';
import { parseData } from '../data';
import { GraphData, GraphNode, GraphLink } from '../types';

const MINISTRY_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', 
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', 
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
];

function getHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInstitutionColor(id: string) {
  return MINISTRY_COLORS[getHash(id) % MINISTRY_COLORS.length];
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function NetworkMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const appointments = useMemo(() => parseData(), []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isFullscreen]);

  const data = useMemo(() => {
    const nodesMap: Record<string, GraphNode> = {};
    const links: GraphLink[] = [];

    appointments.forEach((app) => {
      const personId = app.person?.trim();
      const instId = app.institution?.trim();

      if (!personId || !instId) return;

      // Add Person Node
      if (!nodesMap[personId]) {
        nodesMap[personId] = { id: personId, group: 'person', val: 1 };
      } else {
        nodesMap[personId].val += 1;
      }

      // Add Institution Node
      if (!nodesMap[instId]) {
        nodesMap[instId] = { id: instId, group: 'institution', val: 4 };
      } else {
        nodesMap[instId].val += 1.5;
      }

      // Add Link
      links.push({ source: personId, target: instId });
    });

    return {
      nodes: Object.values(nodesMap),
      links: links,
    };
  }, [appointments]);

  const relatedAppointments = useMemo(() => {
    if (!selectedNode) return [];
    if (selectedNode.group === 'person') {
      return appointments.filter(a => a.person === selectedNode.id);
    }
    return appointments.filter(a => a.institution === selectedNode.id);
  }, [selectedNode, appointments]);

  const filteredData = useMemo(() => {
    if (!selectedNode) {
      return {
        nodes: data.nodes.map(n => ({ ...n })),
        links: data.links.map(l => ({ ...l }))
      };
    }

    const level0 = new Set([selectedNode.id]);
    const level1 = new Set<string>();
    const level2 = new Set<string>();

    data.links.forEach(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;

      if (level0.has(s)) level1.add(t);
      if (level0.has(t)) level1.add(s);
    });

    data.links.forEach(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;

      if (level1.has(s)) level2.add(t);
      if (level1.has(t)) level2.add(s);
    });

    const keepNodes = new Set([...level0, ...level1, ...level2]);

    const filteredNodes = data.nodes.filter(n => keepNodes.has(n.id)).map(n => ({ ...n }));
    const filteredLinks = data.links.filter(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return keepNodes.has(s) && keepNodes.has(t);
    }).map(l => ({ ...l }));

    return {
      nodes: filteredNodes,
      links: filteredLinks
    };
  }, [data, selectedNode]);

  return (
    <div 
      ref={containerRef} 
      className={isFullscreen 
        ? "fixed inset-0 w-full h-full z-[100] bg-zinc-950/95 backdrop-blur-xl flex flex-col"
        : "w-full h-full flex-1 relative"
      }
    >
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-4 left-4 z-40 bg-zinc-900/80 backdrop-blur border border-zinc-700/50 p-2 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors shadow-lg pointer-events-auto"
        title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>

      <ForceGraph3D
        width={dimensions.width}
        height={dimensions.height}
        graphData={filteredData}
        nodeLabel={(node: any) => {
          if (node.group === 'institution') {
            const numApps = appointments.filter(a => a.institution === node.id).length;
            const instColor = getInstitutionColor(node.id);
            return `<div style="background: rgba(24, 24, 27, 0.95); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(63, 63, 70, 0.8); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px); font-family: Inter, sans-serif; text-align: left;">
              <strong style="color: ${instColor}; font-size: 13px; display: block; margin-bottom: 2px;">${node.id}</strong>
              <span style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">${numApps} Connection${numApps !== 1 ? 's' : ''}</span>
            </div>`;
          } else {
            const apps = appointments.filter(a => a.person === node.id);
            const lastApp = apps[apps.length - 1]; // Assume the last in the array is the most recent
            const instColor = lastApp ? getInstitutionColor(lastApp.institution) : '#94a3b8';
            return `<div style="background: rgba(24, 24, 27, 0.95); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(63, 63, 70, 0.8); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px); font-family: Inter, sans-serif; text-align: left;">
              <strong style="color: #f4f4f5; font-size: 13px; display: block; margin-bottom: 4px;">${node.id}</strong>
              <div style="color: ${instColor}; font-size: 12px; margin-bottom: 2px; max-width: 250px; white-space: normal; line-height: 1.3;">${lastApp?.position || 'Unknown'}</div>
              <div style="color: #a1a1aa; font-size: 11px;">${lastApp?.institution || ''}</div>
            </div>`;
          }
        }}
        nodeAutoColorBy="group"
        nodeRelSize={2.5}
        nodeThreeObject={(node: any) => {
          const sprite = new SpriteText(node.id);
          sprite.color = node.group === 'institution' ? getInstitutionColor(node.id) : '#94a3b8'; // text-slate-400
          
          // Calculate font size based on val
          const fontSize = node.group === 'institution' 
            ? Math.max(6, Math.min(18, node.val))
            : Math.max(3, Math.min(8, node.val * 2));
            
          sprite.textHeight = fontSize;
          sprite.fontWeight = node.group === 'institution' ? '700' : '400';
          sprite.fontFace = 'Inter';
          
          // Offset text so it sits below the node sphere
          // The sphere size scales with val, so adjust Y offset based on radius
          const radius = 2.5 * Math.cbrt(node.val);
          sprite.position.y = -radius - (fontSize / 2) - 1;
          
          return sprite;
        }}
        nodeThreeObjectExtend={true}
        linkWidth={1}
        linkColor={(link: any) => {
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return hexToRgba(getInstitutionColor(targetId), 0.6);
        }}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={1.5}
        nodeColor={(node: any) => node.group === 'institution' ? getInstitutionColor(node.id) : '#475569'}
        enableNodeDrag={false}
        onNodeClick={(node) => setSelectedNode(node)}
        backgroundColor="rgba(0,0,0,0)" // Transparent to show fluid bg
      />

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${isFullscreen ? 'top-6 right-6' : 'top-6 right-6'} w-80 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-5 z-50 flex flex-col max-h-[80%] pointer-events-auto`}
          >
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-zinc-800 pb-4">
              <div className={`p-2 rounded-xl ${selectedNode.group === 'person' ? 'bg-cyan-900/30' : 'bg-violet-900/30'}`}>
                {selectedNode.group === 'person' ? (
                  <UserRound className="w-6 h-6 text-cyan-400" />
                ) : (
                  <Building2 className="w-6 h-6 text-violet-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-semibold text-zinc-100 truncate text-base">{selectedNode.id}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                  {selectedNode.group === 'person' ? 'Person' : 'Institution'} • {relatedAppointments.length} Record{relatedAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-auto overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {relatedAppointments.map((app, idx) => (
                <div key={idx} className="p-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl hover:bg-zinc-800/60 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="text-[10px] text-zinc-500 font-mono bg-zinc-900/50 px-1.5 py-0.5 rounded">{app.date}</div>
                  </div>
                  <div className="text-sm font-medium text-zinc-200 leading-tight mb-1">
                    {selectedNode.group === 'person' ? app.institution : app.person}
                  </div>
                  <div className="text-xs text-zinc-400 font-light">{app.position}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
