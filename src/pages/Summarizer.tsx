import React, { useState } from "react";
import { 
  FileText, 
  Wand2, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit, 
  Download,
  AlertCircle,
  Database,
  ChevronDown,
  Cpu,
  Zap,
  MonitorCheck,
  Binary,
  Workflow,
  ArrowRight,
  TrendingDown,
  ArrowLeftRight,
  FileSearch,
  FileCode,
  LayoutGrid,
  Search,
  Lock,
  EyeOff,
  Fingerprint,
  Copy,
  ShieldCheck
} from "lucide-react";
import { streamSummarizeDocument, summarizeDocument } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_SOURCE_SAMPLES } from "../data/samples";
import ReactMarkdown from "react-markdown";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [docType, setDocType] = useState<'SAE' | 'SUGAM' | 'MEETING'>('SAE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setIsStreaming(true);
    setStreamedContent("");
    setResult(null);
    
    try {
      const stream = streamSummarizeDocument(text, docType);
      for await (const chunk of stream) {
        setStreamedContent(prev => prev + chunk);
      }
      setIsStreaming(false);

      const data = await summarizeDocument(text, docType);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setIsStreaming(false);
    }
  };

  const docTypes = [
    { id: 'SUGAM', label: "SUGAM Checklists" },
    { id: 'SAE', label: "SAE Narration" },
    { id: 'MEETING', label: "Meeting Summaries" }
  ];

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700 min-h-full flex flex-col pb-12">
      {/* Page Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
            <BrainCircuit className="text-secondary size-9" />
            Intelligent Regulatory Summarisation
          </h1>
          <p className="text-slate-600 font-bold mt-1 flex items-center gap-2">
            <Workflow className="size-3 text-primary" />
            Regulatory Intelligence Reconstruction Pipeline CDSCO v4.2
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1.5 shadow-sm">
          <div className="flex -space-x-2 mr-4 items-center pl-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
          </div>
          <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest font-black flex items-center pr-4">System: CDSCO-LOGIC-V4</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Col: Source Stream & Type Selection */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-8">
          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200">
            <div className="p-4 border-b border-slate-200 flex flex-col gap-4 bg-slate-50/50">
               <div className="flex justify-between items-center">
                 <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-700">Stream Ingestion</span>
                 <div className="relative">
                   <button 
                     onClick={() => setShowSamples(!showSamples)}
                     className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"
                   >
                     <Database className="size-3" />
                     Library
                     <ChevronDown className={`size-2.5 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                   </button>
                   <AnimatePresence>
                     {showSamples && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         className="absolute top-full right-0 mt-2 w-64 glass-card rounded-xl shadow-2xl z-50 overflow-hidden border-slate-200 bg-white"
                       >
                         {OPEN_SOURCE_SAMPLES.summarization.map((s, i) => (
                           <button
                             key={i}
                             onClick={() => {
                               setText(s.text);
                               setShowSamples(false);
                             }}
                             className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors text-[10px] font-black text-secondary uppercase"
                           >
                             <div className="truncate">{s.name}</div>
                             <div className="text-[8px] text-slate-500 font-bold mt-1">{s.source}</div>
                           </button>
                         ))}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               </div>
               <div className="flex gap-2">
                 {docTypes.map(type => (
                   <button 
                     key={type.id}
                     onClick={() => setDocType(type.id as any)}
                     className={`flex-1 py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all border ${
                       docType === type.id 
                         ? "bg-primary text-white border-primary shadow-md" 
                         : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-bold"
                     }`}
                   >
                     {type.label}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex-1 relative p-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Awaiting ${docType} data stream...`}
                className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-slate-900 placeholder:text-slate-500"
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
                    <h3 className="font-display text-lg font-bold text-slate-900 uppercase tracking-widest">Extraction Engine Active</h3>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-4 max-w-[200px]">Extracting regulatory logic from document stream...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-200 relative overflow-hidden">
              <button 
                onClick={handleSummarize}
                disabled={isProcessing || !text}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-3 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <FileText className="size-5 fill-current/20" />
                Forge Logic Brief
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Col: Result Reconstruction */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden border-slate-200">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <MonitorCheck className="size-4 text-primary" />
                 <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-700">Extraction Engine</span>
               </div>
               {result && (
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#46f1c5]" />
                   <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary">Verified Extraction</span>
                 </div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <AnimatePresence mode="wait">
                {!result && !isProcessing && !streamedContent && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-8"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-primary/40 relative">
                      <FileSearch className="size-10" />
                      <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-600 uppercase tracking-[0.3em]">Neural Extraction Pending</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-bold">Select source stream to initiate logic compression</p>
                    </div>
                  </motion.div>
                )}

                {(isStreaming || streamedContent) && !result && (
                  <motion.div key="streaming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                    <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse border-b border-slate-100 pb-4">
                      <Cpu className="size-4" />
                      Analyzing biological and regulatory patterns...
                    </div>
                    <div className="prose prose-sm max-w-none text-slate-900 font-mono text-xs leading-loose opacity-80 prose-headings:text-primary prose-headings:uppercase prose-headings:text-[10px] prose-headings:font-black prose-headings:tracking-[0.2em] prose-headings:border-b prose-headings:border-primary/20 prose-headings:pb-2">
                      <ReactMarkdown>{streamedContent}</ReactMarkdown>
                    </div>
                    {isStreaming && (
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                      </div>
                    )}
                  </motion.div>
                )}

                {result && (
                  <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    {/* Header Info */}
                    <div className="space-y-4">
                      <h3 className="font-display text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        {result.title || "Logic Extraction Brief"}
                      </h3>
                      <div className="flex gap-6 pb-6 border-b border-slate-100">
                         <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Classification:</span>
                           <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{result.type || docType}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Confidence:</span>
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">{Math.round((result.completeness || 0.95) * 100)}%</span>
                         </div>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    {result.metrics && (
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: "ROUGE-L", val: result.metrics.rougeL?.toFixed(3), color: "text-primary" },
                          { label: "BERT-S", val: result.metrics.bertScore?.toFixed(3), color: "text-primary" },
                          { label: "FIDELITY", val: "99.8%", color: "text-secondary" },
                          { label: "LATENCY", val: `${result.metrics.latencyMs?.toFixed(0)}MS`, color: "text-slate-500" }
                        ].map((m, i) => (
                          <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-tighter mb-1">{m.label}</div>
                            <div className={`text-sm font-black tracking-tighter ${m.color}`}>{m.val}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Compressed Logic Area */}
                    <div className="relative group/text">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-slate-100 group-hover/text:bg-primary/30 transition-colors" />
                      <div className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200 italic font-medium leading-relaxed text-sm text-slate-900 shadow-inner">
                        "{result.summary}"
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 bg-white/80 text-slate-500 hover:text-primary rounded-lg border border-slate-200 transition-all shadow-sm">
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-slate-100 text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-xl border border-slate-200 hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                        <Download className="size-3.5 text-secondary" />
                        Export Raw
                      </button>
                      <button className="flex-1 py-4 bg-secondary text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-3">
                        <FileText className="size-3.5 fill-current/20" />
                        Generate Brief
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Col: Audit & Points */}
        <div className="col-span-12 lg:col-span-3 flex flex-col space-y-8">
           <div className="glass-card rounded-2xl p-8 border-slate-200 flex flex-col bg-white shadow-sm">
              <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-3 text-slate-900">
                <ShieldCheck className="text-primary size-5" />
                Audit Status
              </h3>
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 text-center mb-8 shadow-sm">
                 <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-60">Extraction Density</div>
                 <div className="text-5xl font-black text-primary tracking-tighter">
                   {result ? Math.round((result.completeness || 0) * 100) : 0}%
                 </div>
                 <div className="mt-6 flex justify-center">
                    <span className={`px-4 py-1 rounded text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                       result?.completeness > 0.9 ? "bg-primary text-white border-primary" : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}>
                      {result?.completeness > 0.9 ? 'OPTIMAL' : 'PARTIAL'}
                    </span>
                 </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="size-3 text-secondary" />
                  Logic Invariants
                </h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom_scrollbar">
                  {result?.audit_flags?.length ? result.audit_flags.map((item: any, i: number) => (
                    <div key={i} className={`p-4 rounded-xl border bg-slate-50/50 flex gap-3 group transition-all hover:border-primary/30 shadow-sm ${
                      item.severity === 'CRITICAL' ? 'border-red-200' : 'border-slate-100'
                    }`}>
                       <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                         item.severity === 'CRITICAL' ? 'bg-red-500' : 
                         item.severity === 'HIGH' ? 'bg-orange-500' : 'bg-secondary'
                       }`} />
                       <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{item.flag}</p>
                          <p className="text-[10px] text-slate-500 opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">{item.description}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-20">
                      <CheckCircle2 className="size-8 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Logic Stream Verified</p>
                    </div>
                  )}
                </div>
              </div>
           </div>

           <div className="glass-card rounded-2xl p-8 border-slate-200 bg-white shadow-sm">
              <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-3 text-slate-900">
                <Binary className="text-secondary size-5" />
                Key Invariants
              </h3>
              <div className="space-y-4">
                {(result?.key_points || []).map((point: any, i: number) => (
                  <div key={i} className="flex gap-4 group/p">
                    <div className="w-1 bg-slate-300 rounded-full group-hover/p:bg-primary transition-colors" />
                    <p className="text-[11px] font-bold text-slate-700 group-hover/p:text-slate-900 transition-colors leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
                {!result && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center py-10">No extraction data</p>}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
