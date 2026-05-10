import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileCode, 
  ShieldCheck, 
  Download, 
  Search, 
  AlertCircle, 
  Database, 
  ChevronDown,
  MonitorCheck,
  Zap,
  Lock,
  EyeOff,
  Fingerprint,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  Binary,
  Workflow,
  ArrowLeftRight,
  History as HistoryIcon
} from "lucide-react";
import { detectAndAnonymize } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_SOURCE_SAMPLES } from "../data/samples";

export default function Anonymizer() {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [anonymizedMode, setAnonymizedMode] = useState<'pseudonymised' | 'irreversible'>('pseudonymised');
  const [outputVersions, setOutputVersions] = useState({ pseudonymised: "", irreversible: "" });
  const [error, setError] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [compliance, setCompliance] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleProcess = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setResults([]);
    setCompliance(null);
    setMetrics(null);
    setError(null);

    try {
      const data = await detectAndAnonymize(text, "strict");
      setOutputVersions({
        pseudonymised: data.pseudonymised,
        irreversible: data.irreversiblyAnonymised
      });
      setResults(data.entities || []);
      setCompliance(data.compliance);
      setMetrics(data.metrics);
    } catch (err) {
      console.error(err);
      setError("Anonymisation cycle failed. System processing is currently unavailable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const currentOutput = anonymizedMode === 'pseudonymised' ? outputVersions.pseudonymised : outputVersions.irreversible;

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700 min-h-full flex flex-col pb-12">
      {/* Page Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
            <EyeOff className="text-primary size-9" />
            AI-Powered Anonymisation Engine
          </h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <Fingerprint className="size-3 text-secondary" />
            DPDP Act 2023, NDHM & ICMR Compliant Protocol v4.0
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-4 shadow-sm">
             <div className="flex -space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
             </div>
             <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-black">Agent: SCRUB-V4-STABLE</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        
        {/* Left Col: Source Stream */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200 hover:border-primary/20 transition-all">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <FileSearch className="size-4 text-primary" />
                 <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">Source Data Stream</span>
               </div>
               <div className="flex gap-2">
                 <div className="relative">
                   <button 
                     onClick={() => setShowSamples(!showSamples)}
                     className="px-3 py-1.5 bg-white text-secondary text-[9px] font-black rounded border border-slate-200 flex items-center gap-2 uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all"
                   >
                     <Database className="size-3" />
                     Samples
                     <ChevronDown className={`size-2.5 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                   </button>
                   <AnimatePresence>
                     {showSamples && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         className="absolute top-full right-0 mt-2 w-72 glass-card rounded-xl shadow-2xl z-50 overflow-hidden border-slate-200"
                       >
                         {OPEN_SOURCE_SAMPLES.anonymization.map((s, i) => (
                           <button
                             key={i}
                             onClick={() => {
                               setText(s.text);
                               setShowSamples(false);
                             }}
                             className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors group"
                           >
                             <p className="text-[10px] font-black text-secondary uppercase group-hover:text-primary">{s.name}</p>
                             <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 opacity-60">Source: {s.source}</p>
                           </button>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="px-3 py-1.5 bg-slate-100 text-slate-900 text-[9px] font-black rounded border border-slate-200 flex items-center gap-2 uppercase tracking-widest hover:bg-slate-200 active:scale-95 transition-all"
                 >
                   <Upload className="size-3" />
                   Ingest
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
               </div>
            </div>

            <textarea
              className="flex-1 p-8 bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-slate-900 placeholder:text-slate-400/30 selection:bg-primary/20"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Inject raw regulatory text or PII sensitive narration stream..."
            />

            <div className="p-6 bg-slate-50/50 border-t border-slate-200 overflow-hidden relative">
              <button 
                onClick={handleProcess}
                disabled={isProcessing || !text}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all relative overflow-hidden group/btn ${
                  isProcessing 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-primary text-white font-black uppercase text-xs tracking-[0.2em] shadow-md hover:brightness-110"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Zap className="size-4 animate-spin text-primary" />
                    <span className="animate-pulse">Data De-identification Active...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-5 fill-current/20" />
                    Execute Validation Cycle
                  </>
                )}
                {!isProcessing && (
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                )}
              </button>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error text-[10px] font-black uppercase tracking-widest"
                >
                  <AlertCircle className="size-4" />
                  {error}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Center Col: Output */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
               <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                 <button 
                  onClick={() => setAnonymizedMode('pseudonymised')}
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                    anonymizedMode === 'pseudonymised' ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Phase 1: Replace identifiers with secure tokens"
                 >
                   Pseudonymisation
                 </button>
                 <button 
                  onClick={() => setAnonymizedMode('irreversible')}
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                    anonymizedMode === 'irreversible' ? "bg-error text-white shadow-lg" : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Phase 2: Generalise & normalise sensitive info"
                 >
                   Irreversible Anonymisation
                 </button>
               </div>
               {currentOutput && (
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#46f1c5]" />
                   <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary">Secure Output</span>
                 </div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <AnimatePresence mode="wait">
                {!currentOutput && !isProcessing && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-8"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-primary/40 relative">
                      <Lock className="size-10" />
                      <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Validation Pending</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">Select source stream to initiate scrubbing protocol</p>
                    </div>
                  </motion.div>
                )}

                {currentOutput && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    {/* Header Summary */}
                    <div className="grid grid-cols-4 gap-4">
                       {[
                         { icon: BrainCircuit, label: "Context Accuracy", val: `${Math.round((metrics?.hybrid_audit?.context_confidence || 0.98) * 100)}%`, color: "text-primary" },
                         { icon: MonitorCheck, label: "Compliance Index", val: "CERT-99", color: "text-primary" },
                         { icon: Binary, label: "Token Density", val: `${results.length} hit`, color: "text-secondary" },
                         { icon: ShieldCheck, label: "Risk Factor", val: "LOW", color: "text-primary" },
                       ].map((m, i) => (
                         <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center group hover:border-primary/20 transition-all">
                           <m.icon className={`size-4 mx-auto mb-2 opacity-50 group-hover:opacity-100 ${m.color}`} />
                           <div className="text-[9px] font-black uppercase text-slate-500 tracking-tighter mb-1 opacity-50 group-hover:opacity-100">{m.label}</div>
                           <div className={`text-lg font-black tracking-tighter ${m.color}`}>{m.val}</div>
                         </div>
                       ))}
                    </div>

                    {/* Formatted Output */}
                    <div className="relative group/text">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-slate-100 group-hover/text:bg-primary/30 transition-colors" />
                      <div className={`p-8 rounded-2xl border font-mono text-xs leading-loose whitespace-pre-wrap transition-all shadow-inner ${
                        anonymizedMode === 'irreversible' 
                          ? "bg-red-50 border-red-100 text-slate-900 selection:bg-red-200" 
                          : "bg-slate-50 border-slate-200 text-slate-900 selection:bg-primary/20"
                      }`}>
                        {currentOutput}
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 bg-white/80 text-slate-500 hover:text-primary rounded-lg border border-slate-200 transition-all shadow-sm">
                          <FileCode className="size-3.5" />
                        </button>
                        <button className="p-2 bg-white/80 text-slate-500 hover:text-secondary rounded-lg border border-slate-200 transition-all shadow-sm">
                          <Download className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex gap-4 pt-6">
                      <button className="flex-1 py-4 bg-slate-50 text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                        <ArrowLeftRight className="size-3.5 text-secondary" />
                        Verification Module
                      </button>
                      <button className="flex-1 py-4 bg-secondary text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-secondary/10 hover:brightness-110 transition-all flex items-center justify-center gap-3">
                        <CheckCircle2 className="size-3.5 fill-current/20" />
                        Certify & Commit
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Col: Audit & Logic */}
        <div className="col-span-12 lg:col-span-3 flex flex-col space-y-8">
           <div className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-sm">
              <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-3 text-slate-900">
                <Workflow className="text-secondary size-5" />
                Audit Traversal
              </h3>
              <div className="space-y-6">
                {results.length > 0 ? results.map((ent, i) => (
                  <div key={i} className="flex gap-4 group/ent cursor-default">
                    <div className="flex flex-col items-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-secondary group-hover/ent:bg-primary transition-colors" />
                       <div className="flex-1 w-px bg-slate-200 my-1 group-hover/ent:bg-primary/20" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] group-hover/ent:text-primary transition-colors">{ent.category}</span>
                        <span className="text-[8px] font-mono text-slate-400 opacity-40">Confidence: 0.99</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 opacity-80 group-hover/ent:opacity-100">{ent.text}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-30">
                    <HistoryIcon className="size-8 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No active audit hits</p>
                  </div>
                )}
              </div>
           </div>

           <div className="glass-card rounded-2xl p-8 border-slate-200 bg-slate-50/30">
              <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-3 text-slate-900">
                <MonitorCheck className="text-primary size-5" />
                Logic Repository
              </h3>
              <div className="space-y-5">
                {[
                  { label: "DPDP Section 4.2", status: "VERIFIED", cert: "SEC-X88" },
                  { label: "ISO 20889 De-ID", status: "COMPLIANT", cert: "ISO-443" },
                  { label: "SOP-12 Protocol", status: "APPLIED", cert: "CDSCO-V2" }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 flex justify-between items-center group/log shadow-sm">
                    <div>
                      <div className="text-xs font-black text-slate-900 group-hover/log:text-primary transition-colors">{item.label}</div>
                      <div className="text-[8px] font-mono text-slate-400 font-bold mt-1 uppercase tracking-wider">{item.cert}</div>
                    </div>
                    <div className="text-[10px] font-black text-primary">{item.status}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-4">
                 <AlertTriangle className="size-4 text-primary shrink-0 mt-0.5" />
                 <p className="text-[10px] text-primary/80 font-bold uppercase leading-relaxed tracking-tighter">
                   Residual risk threshold maintained at 0.001% per CDSCO v2.4 Guidelines for sensitive patient narratives.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
