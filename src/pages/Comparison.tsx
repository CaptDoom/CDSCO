import React, { useState } from "react";
import { 
  FileDiff, 
  ArrowLeftRight, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  FileText,
  FileCheck2,
  Trash2,
  Plus,
  ClipboardCheck,
  Database,
  ChevronDown,
  Layers,
  History,
  ShieldCheck,
  ArrowRightLeft,
  Workflow,
  Cpu,
  MonitorCheck,
  Binary,
  GanttChart,
  GitCompare,
  FileCode,
  Lock,
  Download,
  Copy
} from "lucide-react";
import { compareDocuments, summarizeDocument } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_SOURCE_SAMPLES } from "../data/samples";

export default function Comparison() {
  const [mode, setMode] = useState<'comparison' | 'completeness'>('comparison');
  const [docA, setDocA] = useState("");
  const [docB, setDocB] = useState("");
  const [docCheck, setDocCheck] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleAction = async () => {
    if (mode === 'comparison') {
      if (!docA.trim() || !docB.trim()) return;
      setIsProcessing(true);
      try {
        const data = await compareDocuments(docA, docB);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    } else {
      if (!docCheck.trim()) return;
      setIsProcessing(true);
      try {
        const data = await summarizeDocument(docCheck, 'SUGAM');
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700 min-h-full flex flex-col pb-12">
      {/* Page Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
            <History className="text-secondary size-9" />
            Completeness & Comparison Engine
          </h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <Workflow className="size-3 text-primary opacity-50" />
            Administrative Completeness & Version Delta Audit v4.2
          </p>
        </div>
        <div className="flex gap-4 items-center">
           <div className="relative">
             <button 
               onClick={() => setShowSamples(!showSamples)}
               className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-secondary text-[10px] font-black rounded-xl border border-slate-200 flex items-center gap-3 uppercase tracking-widest transition-all shadow-sm group"
             >
               <Database className="size-3.5 group-hover:text-primary" />
               Dataset Samples
               <ChevronDown className={`size-3 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
             </button>
             <AnimatePresence>
               {showSamples && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 10 }}
                   className="absolute top-full right-0 mt-2 w-72 glass-card rounded-xl shadow-2xl z-50 overflow-hidden border-slate-200"
                 >
                   <div className="p-3 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-40 border-b border-slate-100">
                     {mode === 'comparison' ? 'Comparison Pairs' : 'Completeness Cases'}
                   </div>
                   {(mode === 'comparison' ? OPEN_SOURCE_SAMPLES.comparison : OPEN_SOURCE_SAMPLES.completeness).map((s: any, i: number) => (
                     <button
                       key={i}
                       onClick={() => {
                         if (mode === 'comparison') {
                           setDocA(s.textA);
                           setDocB(s.textB);
                         } else {
                           setDocCheck(s.text);
                         }
                         setShowSamples(false);
                       }}
                       className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                     >
                       <p className="text-[10px] font-black text-secondary uppercase tracking-tight">{s.name}</p>
                       <p className="text-[8px] text-slate-400 font-black uppercase mt-1 opacity-50">Source: {s.source}</p>
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1.5 shadow-sm">
             <button 
               onClick={() => { setMode('comparison'); setResult(null); setShowSamples(false); }}
               className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                 mode === 'comparison' ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-slate-900"
               }`}
             >
               Delta Comparison
             </button>
             <button 
               onClick={() => { setMode('completeness'); setResult(null); setShowSamples(false); }}
               className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                 mode === 'completeness' ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-slate-900"
               }`}
             >
               Audit Protocol
             </button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Side: Input Flow */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          <div className="flex-1 flex flex-col space-y-6">
            {mode === 'comparison' ? (
              <>
                <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200 relative group">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60 flex items-center gap-2">
                       <FileText className="size-3" />
                       Version Alpha: Baseline
                    </span>
                    <div className="w-2 h-2 rounded-full bg-secondary shadow-sm" />
                  </div>
                  <textarea
                    value={docA}
                    onChange={(e) => setDocA(e.target.value)}
                    placeholder="Paste baseline documentation or previous filing version..."
                    className="flex-1 p-6 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-slate-900 placeholder:text-slate-400/50"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200 relative group">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60 flex items-center gap-2">
                       <FileCheck2 className="size-3" />
                       Version Beta: Comparison
                    </span>
                    <div className="w-2 h-2 rounded-full bg-primary shadow-sm" />
                  </div>
                  <textarea
                    value={docB}
                    onChange={(e) => setDocB(e.target.value)}
                    placeholder="Paste updated documentation or new iteration..."
                    className="flex-1 p-6 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-slate-900 placeholder:text-slate-400/50"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </>
            ) : (
                <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200 relative group">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                       <ClipboardCheck className="size-3 text-secondary" />
                       Administrative Completeness Audit
                    </span>
                    <Layers className="size-4 text-primary opacity-40" />
                  </div>
                  <textarea
                    value={docCheck}
                    onChange={(e) => setDocCheck(e.target.value)}
                    placeholder="Paste mandatory forms or regulatory checklists (SUGAM Portals / SAE reports) for consistency verification..."
                    className="flex-1 p-6 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-slate-900 placeholder:text-slate-400"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
            )}
          </div>

          <button 
            onClick={handleAction}
            disabled={isProcessing || (mode === 'comparison' ? (!docA || !docB) : !docCheck)}
            className="w-full py-5 rounded-2xl flex items-center justify-center gap-4 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 relative overflow-hidden group"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                System Processing...
              </>
            ) : (
              <>
                <GitCompare className="size-5 fill-current/20" />
                {mode === 'comparison' ? 'Execute Delta Analysis' : 'Verify Document Completeness'}
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </>
            )}
          </button>
        </div>

        {/* Middle Col: Result Dashboard */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <Binary className="size-4 text-primary" />
                 <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">Analysis Engine Output</span>
               </div>
               {result && (
                 <div className="flex items-center gap-4">
                   <div className="h-6 w-px bg-slate-200" />
                   <div className={`px-4 py-1 rounded shadow-sm border font-mono text-[10px] font-black uppercase tracking-widest ${
                     mode === 'comparison' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-primary/10 border-primary/20 text-primary'
                   }`}>
                     {mode === 'comparison' ? `Delta Mag: ${result.changeMagnitude}%` : `Audit Score: ${Math.round((result.completeness || 0) * 100)}%`}
                   </div>
                 </div>
               )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white/30">
              <AnimatePresence mode="wait">
                {!result && !isProcessing && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-8"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-primary/40 relative">
                      <FileDiff className="size-12" />
                      <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Analysis Engine Idle</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 opacity-50">Ingest source data to initiate regulatory comparison</p>
                    </div>
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center">
                    <div className="relative mb-10">
                      <Cpu className="size-20 text-primary animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-primary border-transparent animate-spin" />
                    </div>
                    <div className="flex gap-1.5 justify-center">
                       {[0, 1, 2].map(i => (
                         <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                       ))}
                    </div>
                    <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cross-referencing CDSCO v4.2 ontologies...</p>
                  </motion.div>
                )}

                {result && mode === 'comparison' && (
                  <motion.div key="comp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <div className="relative group/summary">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-secondary/30" />
                      <div className="p-8 rounded-2xl bg-slate-50/50 border border-slate-200 shadow-sm">
                        <p className="mb-4 font-black text-secondary uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
                          <GanttChart className="size-3.5" />
                          Executive Analysis Summary
                        </p>
                        <p className="text-slate-900 text-sm leading-relaxed font-medium italic opacity-90">
                          "{result.summary}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Identified Substantive Diffs</h4>
                      <div className="grid gap-4">
                        {result.diffs.map((diff: any, i: number) => (
                          <div key={i} className={`p-6 rounded-2xl border bg-slate-50/30 group transition-all hover:-translate-y-1 shadow-sm ${
                            diff.type === 'ADDITION' ? 'border-primary/20' :
                            diff.type === 'DELETION' ? 'border-red-200' :
                            'border-secondary/20'
                          }`}>
                            <div className="flex justify-between items-center mb-4">
                              <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-sm ${
                                diff.type === 'ADDITION' ? 'bg-primary/5 border-primary/20 text-primary' :
                                diff.type === 'DELETION' ? 'bg-red-50 border-red-200 text-red-600' :
                                'bg-secondary/5 border-secondary/20 text-secondary'
                              }`}>
                                {diff.type}
                              </span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button className="p-1.5 hover:text-primary transition-colors text-slate-400"><Copy className="size-3" /></button>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-slate-900 opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                              {diff.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {result && mode === 'completeness' && (
                  <motion.div key="complete" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col items-center justify-center text-center shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 opacity-60">Audit Fidelity</p>
                        <div className="text-5xl font-black text-primary tracking-tighter">
                          {Math.round((result.completeness || 0) * 100)}%
                        </div>
                      </div>
                      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 opacity-60">Variance Points</p>
                        <div className="text-5xl font-black text-red-600 tracking-tighter">
                          {result.audit_flags?.length || 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Verification Checkpoint Status</h4>
                      <div className="grid gap-3">
                        {(result.key_points || []).map((point: string, i: number) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/30 border border-slate-100 rounded-xl transition-all hover:border-primary/20 hover:translate-x-2 group shadow-sm">
                            <div className="size-6 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                              <CheckCircle2 className="size-3" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.audit_flags?.length > 0 && (
                      <div className="space-y-6">
                        <h4 className="font-mono text-[10px] font-black text-red-600 uppercase tracking-[0.2em] border-b border-red-100 pb-4">Missing Compliance System Connectors</h4>
                        <div className="grid gap-4">
                          {result.audit_flags.map((item: any, i: number) => (
                            <div key={i} className="flex gap-5 p-5 bg-red-50 border border-red-100 rounded-2xl group hover:bg-red-100 transition-all shadow-sm">
                              <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{item.flag} — {item.severity}</p>
                                <p className="text-[11px] font-bold text-red-800 opacity-70 leading-relaxed font-mono">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Col: System Status & Controls */}
        <div className="col-span-12 lg:col-span-3 flex flex-col space-y-8">
           <div className="glass-card rounded-2xl p-8 border-slate-200 bg-slate-50/30">
              <h3 className="font-display text-lg font-bold mb-8 flex items-center gap-3 text-slate-900">
                <Workflow className="text-primary size-5" />
                Deduction Flow
              </h3>
              <div className="space-y-8 relative">
                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-200" />
                {[
                  { icon: FileText, label: "Data Ingestion", status: "Nominal" },
                  { icon: Cpu, label: "Delta Scan", status: "Active" },
                  { icon: ShieldCheck, label: "Compliance Hub", status: "Pending" },
                  { icon: History, label: "Version Signing", status: "Queued" }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-6 relative group">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10 group-hover:border-primary transition-colors shadow-sm">
                       <step.icon className="size-3 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{step.label}</p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-40">{step.status}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="glass-card rounded-2xl p-8 border-slate-200 flex flex-col gap-6 bg-white">
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-sm">
                 <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-40">System Security</p>
                   <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Verified Hub</p>
                 </div>
                 <Lock className="size-4 text-secondary opacity-50" />
              </div>
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-sm">
                 <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-40">Pipeline Status</p>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Encrypted-09</p>
                 </div>
                 <MonitorCheck className="size-4 text-primary opacity-50" />
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                 <button className="w-full py-4 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                   <Download className="size-3.5 opacity-50" />
                   Download Audit Map
                 </button>
                 <button className="w-full py-4 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                   <ChevronRight className="size-3.5 opacity-50" />
                   View System Logs
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
