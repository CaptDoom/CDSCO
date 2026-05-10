import React, { useState, useEffect } from "react";
import { 
  FileText, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Clock, 
  CloudLightning, 
  Zap,
  Target,
  RefreshCw,
  ClipboardCheck,
  BarChart3, 
  AlertCircle, 
  Lock, 
  Cpu, 
  Network,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  History as HistoryIcon,
  Server,
  Workflow,
  ShieldAlert,
  BrainCircuit,
  Binary,
  MonitorCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { realtimeService } from "../services/realtimeService";

const TimelineVisualization = React.memo(({ data }: { data: number[] }) => {
  return (
    <div className="glass-card rounded-2xl p-8 relative overflow-hidden bg-white shadow-sm group">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-display text-xl font-bold flex items-center gap-3 text-slate-900">
          <BarChart3 className="text-primary size-6" />
          Operational Performance Overview
        </h3>
        <span className="font-mono text-xs text-slate-600 font-bold opacity-80">Node Uptime: 99.98%</span>
      </div>
      
      <div className="relative h-48 flex items-end justify-between gap-2 px-2">
        {data.map((height, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
            className={`flex-1 rounded-t-sm border-t transition-all duration-300 ${
              i === 6 
                ? "bg-primary border-primary shadow-sm" 
                : i < 7 
                  ? "bg-primary/20 border-primary/40 hover:bg-primary/30" 
                  : "bg-slate-100 border-slate-200 hover:bg-slate-200"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-5 mt-8 pt-6 border-t border-slate-100">
        {[
          { label: "Data Intake", val: "100%", color: "text-primary" },
          { label: "Scrubbing", val: "94%", color: "text-primary" },
          { label: "Risk Scan", val: "62%", color: "text-secondary" },
          { label: "Tech Audit", val: "22%", color: "text-amber-600" },
          { label: "Final Release", val: "8%", color: "text-slate-400" },
        ].map((p, i) => (
          <div key={i} className="text-center group/p cursor-default">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-1 group-hover/p:text-slate-900 transition-colors uppercase font-bold">{p.label}</span>
            <span className={`${p.color} font-bold text-lg`}>{p.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

TimelineVisualization.displayName = "TimelineVisualization";

const FilingItem = React.memo(({ filing, isSelected, onClick }: { filing: any, isSelected: boolean, onClick: (id: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onClick(filing.id)}
      layout
      className={`p-4 rounded-r-xl transition-all hover:brightness-95 cursor-pointer group/card border border-transparent border-l-4 ${
        isSelected ? 'ring-2 ring-primary/20 scale-[0.98]' : ''
      } ${
        filing.priority === 'CRITICAL' ? 'bg-red-50 border-red-500 border-red-100' :
        filing.priority === 'REVIEW' ? 'bg-primary/5 border-primary border-primary/10' :
        'bg-slate-50 border-slate-300 border-slate-100'
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-bold text-slate-900 text-sm truncate pr-4">{filing.title}</span>
        <span className={`font-mono text-[9px] font-black border px-1.5 rounded bg-white shadow-sm ${
          filing.priority === 'CRITICAL' ? 'text-red-600 border-red-200' :
          filing.priority === 'REVIEW' ? 'text-primary border-primary/20' :
          'text-slate-700 border-slate-300'
        }`}>
          {filing.status}
        </span>
      </div>
      <div className="mt-3 bg-white/50 h-1 rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${filing.progress}%` }}
           className={`h-full ${filing.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-primary'}`}
         />
      </div>
      <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-tighter opacity-80 font-bold">Created: {new Date(filing.createdAt).toLocaleTimeString()}</p>
    </motion.div>
  );
});

FilingItem.displayName = "FilingItem";

export default function Dashboard() {
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [filings, setFilings] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>({ status: "CONNECTING...", node: "NODE-01" });
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(null);

  useEffect(() => {
    realtimeService.connect();
    
    const unsubEvents = realtimeService.subscribeEvents((event) => {
      setLiveEvents(prev => [event, ...prev].slice(0, 10));
    });

    const unsubFilings = realtimeService.subscribeFilings((update) => {
      if (update.type === 'INIT') {
        setFilings(update.data);
      } else if (update.type === 'CREATED') {
        setFilings(prev => [update.data, ...prev]);
      } else if (update.type === 'UPDATED') {
        setFilings(prev => prev.map(f => f.id === update.data.id ? update.data : f));
      }
    });

    const unsubStatus = realtimeService.subscribeStatus((status) => {
      setSystemStatus(status);
    });

    return () => {
      unsubEvents();
      unsubFilings();
      unsubStatus();
    };
  }, []);

  const selectedFiling = React.useMemo(() => filings.find(f => f.id === selectedFilingId), [filings, selectedFilingId]);

  const handleCreateFiling = React.useCallback(async () => {
    try {
      const resp = await fetch("/api/filings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `New Batch Ingestion #${Math.floor(Math.random() * 1000)}`,
          priority: Math.random() > 0.5 ? "CRITICAL" : "REVIEW",
          metadata: { type: "clinical_trial", trigger: "manual" }
        })
      });
      if (!resp.ok) throw new Error("Failed to create filing");
    } catch (err) {
      console.error(err);
    }
  }, []);

  const performanceData = React.useMemo(() => [25, 45, 60, 40, 85, 30, 100, 50, 40, 65], []);

  return (
    <div className="max-w-[1440px] mx-auto animate-in fade-in duration-700 pb-12">
      {/* Page Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">IndiaAI-CDSCO Regulatory Sentinel</h1>
          <p className="text-slate-600 font-bold mt-1 uppercase text-[10px] tracking-widest opacity-80">Health Innovation Acceleration Hackathon // NODE: {systemStatus.node}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-300 flex items-center gap-3 shadow-sm group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${systemStatus.status === 'STABLE' ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${systemStatus.status === 'STABLE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-mono text-[10px] text-slate-900 font-black tracking-widest uppercase">Status: {systemStatus.status}</span>
          </div>
          <button 
            onClick={handleCreateFiling}
            className="px-6 py-2 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 shadow-md transition-all flex items-center gap-2"
          >
            <CloudLightning className="size-3" />
            Ingest Data
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Main Stats Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <TimelineVisualization data={performanceData} />
        </div>

        {/* Priority Queue Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-8 flex flex-col hover:border-primary/20 transition-colors bg-white shadow-sm h-full max-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-red-600 size-6" />
                <h3 className="font-display text-xl font-bold text-slate-900">Priority Queue</h3>
              </div>
              <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600 font-bold">{filings.length} ACTIVE</span>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {filings.map((filing) => (
                  <FilingItem 
                    key={filing.id} 
                    filing={filing} 
                    isSelected={selectedFilingId === filing.id}
                    onClick={setSelectedFilingId}
                  />
                ))}
              </AnimatePresence>
              {filings.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Workflow className="size-12 mb-4" />
                  <p className="font-mono text-[10px] uppercase font-black uppercase">No active filings in queue</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Priority Insight Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selectedFiling ? (
              <motion.div 
                key={selectedFiling.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="glass-card rounded-2xl p-8 border-l-4 border-slate-900 bg-slate-900 text-white shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MonitorCheck className="size-24 rotate-12" />
                </div>
                
                <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-4 flex items-center gap-2">
                  <Activity className="size-3" />
                  Audit Insight Engine
                </h4>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight text-white">{selectedFiling.id} // REPORT</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase">Ref: {selectedFiling.title}</p>
                    </div>
                    {selectedFiling.aiAnalysis && (
                      <div className="text-right">
                        <div className="text-3xl font-display font-black text-primary">{selectedFiling.aiAnalysis.riskScore}</div>
                        <div className="text-[8px] font-mono uppercase text-slate-400 tracking-widest font-bold">Risk Index</div>
                      </div>
                    )}
                  </div>

                  {selectedFiling.aiAnalysis ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10">
                        <div className="text-center">
                          <div className="text-xs font-bold text-white">p={selectedFiling.aiAnalysis.vitals?.p_value}</div>
                          <div className="text-[7px] text-slate-300 uppercase font-black">Significance</div>
                        </div>
                        <div className="text-center border-x border-white/10">
                          <div className="text-xs font-bold text-white">N={selectedFiling.aiAnalysis.vitals?.sampleSize}</div>
                          <div className="text-[7px] text-slate-300 uppercase font-black">Sample Power</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-secondary">{selectedFiling.aiAnalysis.vitals?.dosageConsistency}</div>
                          <div className="text-[7px] text-slate-300 uppercase font-black">Consistency</div>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                        {selectedFiling.aiAnalysis.findings.map((f: any, i: number) => (
                          <div key={i} className="flex justify-between items-center py-2 px-3 bg-white/10 rounded-lg border border-white/10 group/finding hover:border-primary/40 transition-all">
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black tracking-widest text-primary uppercase mb-0.5">{f.type}</span>
                                <span className="text-[10px] font-bold text-white">{f.label}</span>
                             </div>
                             <div className="text-right">
                               <div className="text-[9px] font-mono text-slate-300 font-bold">{(f.confidence * 100).toFixed(0)}% CONF.</div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                      <RefreshCw className="size-8 animate-spin mb-4 text-primary" />
                      <p className="font-mono text-[9px] uppercase tracking-widest font-black">Awaiting Analysis Stream...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
               <div className="glass-card rounded-2xl p-8 border-l-4 border-slate-200 group overflow-hidden bg-white shadow-sm flex flex-col justify-center items-center h-[340px] text-slate-400">
                  <BrainCircuit className="size-16 mb-6 opacity-10 group-hover:opacity-30 transition-opacity" />
                  <p className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-center max-w-[200px] leading-relaxed">
                    Select a filing from the queue to initiate deep-node AI auditing.
                  </p>
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Live Activity Row */}
        <div className="col-span-12 glass-card rounded-2xl flex flex-col overflow-hidden bg-white shadow-sm border-slate-200 mb-8">
          <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 flex items-center gap-3">
              <Workflow className="size-4 text-primary" />
              Live Regulatory Event Stream
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[9px] text-emerald-600 uppercase font-black">Live-Sync</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <span className="font-mono text-[9px] text-slate-600 font-bold uppercase tracking-widest">Latency: 14ms</span>
            </div>
          </div>
          <div className="p-2 bg-slate-50/50">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 h-[160px] overflow-hidden">
                <AnimatePresence initial={false}>
                  {liveEvents.slice(0, 5).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between group hover:border-primary/40 transition-all cursor-default"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                            event.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                            event.severity === 'WARNING' ? 'bg-orange-100 text-orange-700' : 
                            'bg-primary/10 text-primary'
                          }`}>
                            {event.severity}
                          </span>
                          <span className="font-mono text-[7px] text-slate-600 font-bold">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{event.message}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center">
                         <span className="text-[7px] font-mono text-slate-600 font-bold uppercase">AUDIT_NODE_01</span>
                         <Zap className="size-2 text-primary opacity-30" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Secondary Metrics & AI Health */}
        <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-8 border-l-4 border-secondary group overflow-hidden bg-white shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Summarisation Load</span>
              <div className="text-5xl font-display font-bold mt-3 text-slate-900">14.8 <span className="text-sm font-normal opacity-70">req/s</span></div>
            </div>
            <Activity className="text-secondary size-10 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex gap-2 mt-8 h-10 items-end relative z-10">
            {[40, 30, 60, 100, 50].map((h, i) => (
              <div key={i} className={`flex-1 ${h === 100 ? 'bg-secondary' : 'bg-secondary/20'} rounded-sm transition-all hover:bg-secondary/40 h-full`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] text-slate-600 font-bold opacity-80 relative z-10">LLM processing at peak synchronization</p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-secondary/10" />
        </div>

        <div className="col-span-12 lg:col-span-5 glass-card rounded-2xl p-8 hover:border-primary/10 transition-colors bg-white shadow-sm border-slate-200">
          <h3 className="font-display text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3 text-slate-700">
            <BrainCircuit className="text-primary size-5" />
            AI Model Health Metrics
          </h3>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-2 text-slate-500">
                  <span className="font-mono text-[9px] uppercase tracking-widest font-bold">k-anonymity</span>
                  <span className="font-mono text-[9px] font-bold text-primary">k=24.1</span>
                </div>
                <div className="bg-slate-100 h-2 rounded-full overflow-hidden flex shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1.5 }} className="bg-primary h-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-slate-500">
                  <span className="font-mono text-[9px] uppercase tracking-widest font-bold">ROUGE-L</span>
                  <span className="font-mono text-[9px] font-bold text-secondary">0.78</span>
                </div>
                <div className="bg-slate-100 h-2 rounded-full overflow-hidden flex shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: "78%" }} transition={{ duration: 1.5 }} className="bg-secondary h-full" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                <Binary className="text-primary size-5 opacity-70" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Inference Latency</div>
                <div className="text-[10px] text-slate-600 font-mono font-black mt-0.5 opacity-80">240ms / doc-node</div>
              </div>
              <div className="text-primary text-[10px] font-mono font-black py-1 px-2 bg-primary/5 rounded border border-primary/10">
                -12.4%
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 glass-card rounded-2xl p-8 border-l-4 border-slate-200 group overflow-hidden bg-white shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Evaluators</span>
              <div className="text-4xl font-display font-bold mt-3 text-slate-900">42</div>
            </div>
            <Network className="text-slate-400 size-8 opacity-30 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-2 mt-8 relative z-10">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="User" />
                </div>
              ))}
            </div>
            <span className="text-[9px] text-slate-600 font-mono font-black">+39 observers</span>
          </div>
        </div>

        {/* Milestones Row */}
        <div className="col-span-12 lg:col-span-12">
          <div className="glass-card rounded-2xl p-8 hover:border-primary/10 transition-colors bg-white shadow-sm border-slate-200">
            <h3 className="font-display text-xl font-bold mb-8 flex items-center gap-3 text-slate-900">
              <Calendar className="text-secondary size-6" />
              Critical Compliance Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex gap-8 items-start group/m border-r border-slate-100 pr-12">
                <div className="bg-slate-50 p-4 rounded-xl font-mono text-center min-w-[80px] shadow-sm border border-slate-200 group-hover/m:border-primary/30 transition-all cursor-default">
                  <span className="block text-secondary font-black text-xl mb-1">SEP</span>
                  <span className="text-slate-600 font-black text-lg">22</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-base tracking-tight">Data Anonymisation Sign-off</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed opacity-80">Institutional ethics board approval required for automated de-identification.</p>
                  <div className="flex gap-4 mt-4">
                    <span className="text-[9px] font-black bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">Approved</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-8 items-start group/m">
                <div className="bg-slate-50 p-4 rounded-xl font-mono text-center min-w-[80px] shadow-sm border border-slate-200 group-hover/m:border-secondary/30 transition-all cursor-default">
                  <span className="block text-secondary font-black text-xl mb-1">OCT</span>
                  <span className="text-slate-600 font-black text-lg">05</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-base tracking-tight">AI Validation Drift Test</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed opacity-80">Cross-referencing human reviewer consensus with AI recommendation models.</p>
                  <div className="flex gap-4 mt-4">
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <footer className="mt-8 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 gap-8 overflow-hidden">
        <div className="flex items-center gap-10 flex-wrap justify-center">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/10" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">Gateway 01: NOMINAL</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/10" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">AI Core: OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse ring-4 ring-secondary/10" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">Sync Latency: 12ms</span>
          </div>
        </div>
        <div className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-slate-400 opacity-80 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
          CDSCO REGULATORY AI WORKFLOW v2.4.01-STABLE
        </div>
      </footer>
    </div>
  );
}
