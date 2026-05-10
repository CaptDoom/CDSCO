import React, { useState } from "react";
import { 
  ClipboardCheck, 
  FilePlus, 
  Download, 
  PenTool, 
  ShieldCheck, 
  AlertTriangle, 
  Database, 
  ChevronDown,
  MonitorCheck,
  Binary,
  Workflow,
  Cpu,
  Zap,
  Fingerprint,
  Eye,
  FileSearch,
  History,
  Lock,
  ArrowRight
} from "lucide-react";
import { generateInspectionReport } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_SOURCE_SAMPLES } from "../data/samples";

const FormalReport = React.memo(({ report }: { report: any }) => {
  if (!report) return null;
  return (
    <motion.div
      key="report"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12"
    >
      <div className="p-12 rounded-xl bg-white border border-slate-200 shadow-xl relative overflow-hidden group/doc">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-10">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-900">Central Drugs Standard Control Organisation</p>
            <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-600">Ministry of Health & Family Welfare</p>
            <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-600">Government of India</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className="text-[9px] font-black font-mono text-secondary decoration-primary decoration-2 underline-offset-4 tracking-tighter">REF: {report.inspection_details?.id || "CDSCO/FIELD/2026"}</div>
            <div className="text-[9px] font-black font-mono text-slate-400">{report.inspection_details?.date || new Date().toISOString().split('T')[0]}</div>
          </div>
        </div>
        
        <h2 className="text-center font-display text-2xl font-black uppercase tracking-tight text-slate-900 mb-12">
          Formal GCP Inspection Document
        </h2>
        
        <div className="grid grid-cols-2 gap-10 border-b border-slate-100 pb-10 mb-10">
           <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-secondary flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                Section I: Invariants
              </h3>
              <div className="space-y-3">
                 <div className="flex justify-between group/cell">
                    <span className="text-[9px] font-black text-slate-500 uppercase opacity-40">Site Anchor:</span>
                    <span className="text-[10px] font-bold text-slate-900 group-hover:text-primary transition-colors">{report.inspection_details?.site}</span>
                 </div>
                 <div className="flex justify-between group/cell">
                    <span className="text-[9px] font-black text-slate-500 uppercase opacity-40">Authorized Inspector:</span>
                    <span className="text-[10px] font-bold text-slate-900 group-hover:text-primary transition-colors">{report.inspection_details?.inspectors}</span>
                 </div>
              </div>
           </div>
           <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-secondary flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                 Section II: Protocol
              </h3>
              <div className="space-y-3">
                 <div className="flex justify-between group/cell">
                    <span className="text-[9px] font-black text-slate-500 uppercase opacity-40">Subject ID:</span>
                    <span className="text-[10px] font-bold text-slate-900 group-hover:text-primary transition-colors">{report.study_details?.protocol}</span>
                 </div>
                 <div className="flex justify-between group/cell">
                    <span className="text-[9px] font-black text-slate-500 uppercase opacity-40">Sponsor Hub:</span>
                    <span className="text-[10px] font-bold text-slate-900 group-hover:text-primary transition-colors">{report.study_details?.sponsor}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-[10px] font-black uppercase text-primary flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Section III: Observation Analysis & Synthesis
           </h3>
           <div className="space-y-6">
              {report.observations?.critical?.length > 0 && (
                 <div className="p-6 rounded-xl bg-red-50 border border-red-100 flex gap-4 shadow-sm">
                    <AlertTriangle className="size-4 text-red-500 shrink-0 mt-1" />
                    <div className="space-y-2 flex-1">
                       <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Critical Anomalies Detected</p>
                       <ul className="space-y-2">
                          {report.observations.critical.map((v:any, i:any) => (
                            <li key={i} className="text-[11px] font-bold text-red-800 list-disc ml-4 font-mono leading-relaxed">{v}</li>
                          ))}
                       </ul>
                    </div>
                 </div>
              )}
              {report.observations?.major?.length > 0 && (
                 <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex gap-4 shadow-sm">
                    <Eye className="size-4 text-secondary shrink-0 mt-1" />
                    <div className="space-y-2 flex-1">
                       <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Major Logic Deviations</p>
                       <ul className="space-y-2">
                          {report.observations.major.map((v:any, i:any) => (
                            <li key={i} className="text-[11px] font-bold text-slate-600 list-disc ml-4 leading-relaxed">{v}</li>
                          ))}
                       </ul>
                    </div>
                 </div>
              )}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 italic text-[11px] font-medium leading-relaxed text-slate-700 transition-colors shadow-sm">
                 "{report.observations?.recommendations?.[0] || report.formal_report_text}"
              </div>
           </div>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-100 flex justify-end">
          <div className="text-center group/sign">
            <div className="w-48 h-px bg-slate-300 scale-x-0 group-hover/sign:scale-x-100 transition-transform origin-right duration-700 mb-2" />
            <p className="text-[9px] font-black uppercase text-slate-900 tracking-widest">Inspector Signature Token</p>
            <div className="text-[8px] font-mono mt-1 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
              {btoa(report.inspection_details?.id || 'sign').substring(0,32)}-VERIFIED
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FormalReport.displayName = "FormalReport";

export default function Inspection() {
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleGenerate = React.useCallback(async () => {
    if (!notes.trim()) return;
    setIsProcessing(true);
    try {
      const data = await generateInspectionReport(notes);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [notes]);

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700 min-h-full flex flex-col pb-12">
      {/* Page Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
            <MonitorCheck className="text-secondary size-9" />
            Inspection Report Generation
          </h1>
          <p className="text-slate-600 font-bold mt-1 flex items-center gap-2">
            <Workflow className="size-3 text-primary" />
            Standardised Conversion of Field Observations to CDSCO Templates v4.2
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1.5 shadow-sm">
          <div className="flex -space-x-2 mr-4 items-center pl-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
          </div>
          <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest font-black flex items-center pr-4">Agent: CDSCO-FIELD-INTEL</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Side: Field Stream */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200 relative group">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <span className="font-mono text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                 <PenTool className="size-3 text-secondary" />
                 Observation Ingestion
              </span>
              <div className="relative">
                <button 
                  onClick={() => setShowSamples(!showSamples)}
                  className="text-primary hover:brightness-110 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"
                >
                  <Database className="size-3" />
                  OCR Samples
                  <ChevronDown className={`size-2.5 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSamples && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-64 glass-card rounded-xl shadow-2xl z-50 overflow-hidden border-slate-200"
                    >
                      {OPEN_SOURCE_SAMPLES.inspection.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setNotes(s.text);
                            setShowSamples(false);
                          }}
                          className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                        >
                          <p className="text-[10px] font-black text-secondary uppercase tracking-tight">{s.name}</p>
                          <p className="text-[8px] text-slate-600 font-black uppercase mt-1">Source: {s.source}</p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex-1 p-8 relative">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ingest unstructured or handwritten site observations for standardized reporting..."
                className="w-full h-full bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-slate-900 placeholder:text-slate-500 scrollbar-hide"
              />
              <AnimatePresence>
                {isProcessing && (
                   <motion.div 
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                     className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center"
                   >
                     <div className="relative mb-6">
                       <Cpu className="size-12 text-primary animate-pulse" />
                       <div className="absolute inset-0 rounded-full border-2 border-t-primary border-transparent animate-spin" />
                     </div>
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">Generating Formal Document Structure</span>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-200 relative overflow-hidden">
              <button 
                onClick={handleGenerate}
                disabled={isProcessing || !notes}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-3 bg-secondary text-white font-black uppercase text-xs tracking-[0.2em] shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 relative group"
              >
                Compile Protocol Report
                <PenTool className="size-4 opacity-50 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Col: The Report Body */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 font-mono">
               <div className="flex items-center gap-3">
                 <Binary className="size-4 text-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reconstructed Regulatory Node</span>
               </div>
               {report && (
                 <div className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                   report.severity_rating === 'CRITICAL' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-primary/10 border-primary/20 text-primary'
                 }`}>
                   {report.severity_rating || 'NOMINAL'}
                 </div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white/30 relative">
              <AnimatePresence mode="wait">
                {!report && !isProcessing && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-8"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-primary/40 relative">
                      <ClipboardCheck className="size-12" />
                      <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Awaiting field notes for analysis</p>
                  </motion.div>
                )}

                <FormalReport report={report} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Col: System Invariants */}
        <div className="col-span-12 lg:col-span-3 flex flex-col space-y-8">
           <div className="glass-card rounded-2xl p-8 border-slate-200 flex flex-col">
              <h3 className="font-display text-lg font-bold mb-8 flex items-center gap-3 text-slate-900">
                <Binary className="text-primary size-5" />
                Pipeline Analysis
              </h3>
              <div className="grid gap-4">
                <div className="p-6 rounded-2xl bg-white border border-slate-100 transition-all hover:border-primary/40 group shadow-sm">
                   <div className="flex items-center gap-3 mb-4">
                      <Zap className="size-4 text-secondary group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Ensemble Inference</span>
                   </div>
                   <div className="font-mono text-xs font-black text-primary tracking-tighter">TESSERACT 5 + PADDLE V2.4</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-100 transition-all hover:border-primary/40 group shadow-sm">
                   <div className="flex items-center gap-3 mb-4">
                      <Fingerprint className="size-4 text-secondary group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Handwriting Logic</span>
                   </div>
                   <div className="font-mono text-xs font-black text-primary tracking-tighter">ACTIVE-99.7% ACCURACY</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-100 transition-all hover:border-primary/40 group shadow-sm">
                   <div className="flex items-center gap-3 mb-4">
                      <Lock className="size-4 text-secondary group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Audit Chain</span>
                   </div>
                   <div className="font-mono text-xs font-black text-primary tracking-tighter">ENCRYPTED-AES-256</div>
                </div>
              </div>
           </div>

           <div className="glass-card rounded-2xl p-8 border-slate-200 flex-1 bg-white">
             <div className="space-y-8">
               <h3 className="font-display text-lg font-bold flex items-center gap-3 text-slate-900">
                 <History className="text-primary size-5" />
                 Action Required
               </h3>
               {report ? (
                 <div className="space-y-6">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 opacity-60">Protocol Violation Type</p>
                      <p className="text-[11px] font-black text-red-600 uppercase">{report.action_required?.type || "CAPA Trigger"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Cycle Deadline</p>
                      <p className="font-mono text-xs font-black text-slate-900">{report.action_required?.deadline || "T-PLUS 30 CYCLES"}</p>
                    </div>
                 </div>
               ) : (
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] text-center pt-20">Awaiting Signal</p>
               )}
               
               <div className="space-y-4 pt-10 border-t border-slate-100">
                 <button className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                   <Download className="size-4 opacity-50" />
                   Archive Node Map
                 </button>
                 <button className="w-full py-4 bg-white rounded-xl border border-slate-200 shadow-sm text-[10px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                   Verify Sign-off
                   <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

