import React, { useState } from "react";
import { 
  ShieldAlert, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Flag, 
  Share2,
  AlertTriangle,
  History as HistoryIcon,
  Activity,
  CloudLightning,
  AlertCircle,
  BrainCircuit,
  Zap,
  Database,
  ChevronDown,
  Search,
  FileSearch,
  Target,
  LayoutGrid,
  Filter,
  Copy,
  Cpu,
  Workflow,
  ArrowRight,
  TrendingDown,
  ArrowLeftRight,
  Stethoscope,
  Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_SOURCE_SAMPLES } from "../data/samples";
import { 
  classifySAE, 
  streamClassifySAE, 
  calculatePriorityScore,
  getEmbeddings,
  searchPinecone
} from "../services/geminiService";
import ReactMarkdown from "react-markdown";

export default function SAEBoard() {
  const [activeView, setActiveView] = useState<'board' | 'analysis' | 'semantic'>('board');
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedJustification, setStreamedJustification] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [priority, setPriority] = useState<any>(null);
  const [similarCases, setSimilarCases] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);

const queueItems = [
    { id: "SAE-441", hospital: "AIIMS Delhi", status: "CRITICAL", time: "2 mins ago", type: "DEATH", text: "82Y Male. History of chronic renal failure. Developed multi-organ failure after first dose of TEST-ANTI-INF. Death occurred at 04:00.", delayDays: 2, daysToDeadline: 5 },
    { id: "SAE-442", hospital: "PGIMER", status: "ELEVATED", time: "15 mins ago", type: "HOSPITALISATION", text: "Female patient experienced acute cardiac distress following the administration of TEST-DRUG-X (Batch #442). Significant drop in BP (70/40 mmHg).", delayDays: 5, daysToDeadline: 16 },
    { id: "SAE-443", hospital: "CMC Vellore", status: "PENDING", time: "1 hour ago", type: "DISABILITY", text: "Subject reported persistent numbness in lower extremities 48 hours after vaccination. EMG shows signs of acute inflammatory demyelinating polyradiculoneuropathy.", delayDays: 12, daysToDeadline: 18 },
    { id: "SAE-444", hospital: "Apollo Hyd", status: "STABLE", time: "3 hours ago", type: "OTHERS", text: "Patient reported mild rash and nausea 24 hours after administration of Batch Z-19. Symptoms resolved with antihistamines.", delayDays: 1, daysToDeadline: 25 },
  ];

  const handleSemanticSearch = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;

    if (textToUse) setInputText(textToUse);

    setIsSearching(true);
    setActiveView('semantic');
    setError(null);
    try {
      const inputVector = await getEmbeddings(text);
      const searchResults = await searchPinecone(inputVector, 5);
      
      const scoredResults = searchResults.matches.map((match: any) => ({
        id: match.id,
        summary: match.metadata.summary,
        severity: match.metadata.severity,
        date: match.metadata.date,
        similarity: match.score
      }));
      
      setSimilarCases(scoredResults);
    } catch (err: any) {
      console.error(err);
      setError(`Pinecone error: ${err.message || "Vector search failed."}`);
      setSimilarCases([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClassify = async (textToUse?: string, metadata?: any) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;
    
    if (textToUse) setInputText(textToUse);
    
    setIsProcessing(true);
    setIsStreaming(true);
    setStreamedJustification("");
    setAnalysis(null);
    setPriority(null);
    setError(null);
    setActiveView('analysis');

    try {
      const stream = streamClassifySAE(text);
      for await (const chunk of stream) {
        setStreamedJustification(prev => prev + chunk);
      }
      setIsStreaming(false);

      const data = await classifySAE(text);
      setAnalysis(data);

      const priorityData = calculatePriorityScore({
        severity: data.severity,
        delayDays: metadata?.delayDays || 3,
        daysToDeadline: metadata?.daysToDeadline || 14,
        completeness: 0.85
      });
      setPriority(priorityData);

    } catch (err) {
      console.error(err);
      setError("Failed to audit case narration. Please verify the neural node connection.");
    } finally {
      setIsProcessing(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700 min-h-full flex flex-col pb-12">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-8">
        <div>
            <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
              <ShieldAlert className="text-secondary size-9" />
              Classification & Prioritisation Tool
            </h1>
            <p className="text-slate-600 font-bold mt-1 flex items-center gap-2">
              <Activity className="size-3 text-primary" />
              Automated Severity Triage & Duplicate Detection Protocol v9.2
            </p>
        </div>
        
        <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1.5 shadow-sm">
          <button 
            onClick={() => setActiveView('board')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
              activeView === 'board' ? "bg-primary text-white shadow-md" : "text-slate-700 font-bold hover:text-slate-900"
            }`}
          >
            Stream
          </button>
          <button 
            onClick={() => setActiveView('analysis')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
              activeView === 'analysis' ? "bg-primary text-white shadow-md" : "text-slate-700 font-bold hover:text-slate-900"
            }`}
          >
            Audit Engine
          </button>
          <button 
            onClick={() => setActiveView('semantic')}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
              activeView === 'semantic' ? "bg-primary text-white shadow-md" : "text-slate-700 font-bold hover:text-slate-900"
            }`}
          >
            Vector Map
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Col: Case Entry & Local Queue */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-8">
          {/* Input Area */}
          <div className="glass-card rounded-2xl flex flex-col min-h-[300px] border-slate-200 shadow-sm bg-white">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">Narration Ingest</span>
              <div className="relative">
                <button 
                  onClick={() => setShowSamples(!showSamples)}
                  className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"
                >
                  <Database className="size-3" />
                  Precedents
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
                      {OPEN_SOURCE_SAMPLES.sae.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => { setInputText(s.text); setShowSamples(false); }}
                          className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors text-[10px] font-black text-secondary uppercase"
                        >
                          {s.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col p-6">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Initialize SAE case data injection..."
                className="flex-1 bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-slate-900 placeholder:text-slate-500"
              />
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleClassify()}
                  disabled={isProcessing || !inputText}
                  className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${
                    isProcessing ? "bg-slate-100 text-slate-400" : "bg-primary text-white font-black uppercase text-xs tracking-widest shadow-md"
                  }`}
                >
                  {isProcessing ? <Zap className="size-4 animate-pulse" /> : <ShieldAlert className="size-4" />}
                  Audit Case
                </button>
                <button
                  onClick={() => handleSemanticSearch()}
                  disabled={isSearching || !inputText}
                  className="p-4 bg-slate-50 text-secondary border border-slate-200 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center"
                >
                  <Database className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Local Queue List */}
          <div className="glass-card rounded-2xl flex-1 border-slate-200 flex flex-col bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-700">Active Prioritisation Queue</span>
               <Filter className="size-3 text-secondary opacity-50" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {queueItems.map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 4 }}
                  onClick={() => handleClassify(item.text, item)}
                  className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-lg flex items-center justify-center font-black text-xs ${
                      item.status === 'CRITICAL' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-secondary/10 text-secondary border border-secondary/20'
                    }`}>
                      {item.type[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.id}</p>
                      <p className="text-[8px] text-slate-600 font-black uppercase tracking-tight">{item.hospital} • {item.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                      item.status === 'CRITICAL' ? 'text-red-600 bg-red-50 border-red-100' : 'text-secondary bg-secondary/5 border-secondary/10'
                    }`}>
                      {item.status}
                    </span>
                    <ArrowRight className="size-4 text-slate-400 group-hover:text-primary transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right Col: Main View */}
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <AnimatePresence mode="wait">
            {activeView === 'analysis' ? (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 glass-card rounded-2xl border-slate-200 flex flex-col overflow-hidden bg-white shadow-sm"
              >
                {!analysis && !streamedJustification ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-30">
                     <BrainCircuit className="size-20 text-primary mb-6" />
                     <h3 className="font-display text-xl font-bold text-slate-900 tracking-widest uppercase">Audit System Primed</h3>
                     <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mt-4">Ingest case data for automated regulatory analysis</p>
                   </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                    {/* Top Analysis Grid */}
                    <div className="grid grid-cols-12 gap-8">
                       <div className="col-span-12 md:col-span-8 space-y-8">
                          <div className="bg-slate-50/70 p-8 rounded-2xl border border-slate-200 relative overflow-hidden shadow-sm">
                             <div className="absolute top-0 right-0 p-4 opacity-5">
                               <ShieldAlert className="size-20" />
                             </div>
                             <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4">Neural Severity Classification</p>
                             <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                               {analysis?.severity || "Classifying..."}
                             </h2>
                             {analysis?.confidence && (
                               <div className="mt-8 flex items-center gap-6">
                                 <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                   <motion.div 
                                     initial={{ width: 0 }}
                                     animate={{ width: `${analysis.confidence * 100}%` }}
                                     className="h-full bg-primary"
                                   />
                                 </div>
                                 <span className="font-mono text-xs font-black text-primary">{(analysis.confidence * 100).toFixed(1)}% CONF</span>
                               </div>
                             )}
                          </div>

                          <div className="glass-card bg-slate-50/40 p-8 rounded-2xl border-slate-200 shadow-sm">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <Workflow className="size-4 text-secondary" />
                               Justification Logic Stream
                             </h4>
                             <div className="prose prose-slate prose-sm max-w-none text-slate-900 font-mono text-xs leading-relaxed opacity-80">
                                <ReactMarkdown>{streamedJustification || analysis?.justification}</ReactMarkdown>
                                {isStreaming && (
                                  <div className="flex gap-1 py-4">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>

                       <div className="col-span-12 md:col-span-4 space-y-8">
                          <div className="bg-primary text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                             <div className="absolute -bottom-4 -right-4 opacity-10">
                               <CloudLightning className="size-24" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-100">Complexity Tier</p>
                             <div className="text-5xl font-black">{priority?.tier || "T1"}</div>
                             <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-end">
                                <div>
                                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Priority Score</div>
                                  <div className="text-2xl font-black">{priority?.score || 0}</div>
                                </div>
                                <Activity className="size-6 opacity-40 animate-pulse" />
                             </div>
                          </div>

                          <div className="glass-card p-6 rounded-2xl border-slate-200 bg-white shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                               <Fingerprint className="size-4 text-secondary" />
                               Attribution Matrix
                            </h4>
                            <div className="space-y-4">
                               {[
                                 { label: "Clinical Weight", val: 88, color: "bg-primary" },
                                 { label: "Temporal Lock", val: 94, color: "bg-primary" },
                                 { label: "Semantic Delta", val: 42, color: "bg-secondary" },
                               ].map((f, i) => (
                                 <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                      <span>{f.label}</span>
                                      <span>{f.val}%</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${f.val}%` }}
                                        className={`h-full ${f.color}`}
                                      />
                                    </div>
                                 </div>
                               ))}
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                      <button className="flex-1 py-4 bg-slate-50 text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-sm">
                        <ArrowLeftRight className="size-3.5 text-secondary" />
                        Recalibrate Analysis Engine
                      </button>
                      <button className="flex-1 py-4 bg-secondary text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-3">
                        <CheckCircle2 className="size-3.5 fill-current/20" />
                        Commit to Blockchain
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : activeView === 'semantic' ? (
              <motion.div 
                key="semantic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 glass-card rounded-2xl border-slate-200 flex flex-col overflow-hidden bg-white shadow-sm"
              >
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <div>
                     <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                       <Target className="text-primary size-6" />
                       Vector Precedent Matching
                     </h3>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Cross-referencing historical regulatory decisions</p>
                   </div>
                   <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                     <span className="font-mono text-[10px] font-black text-primary">Distance: Cosine</span>
                     <div className="w-px h-4 bg-slate-200" />
                     <span className="font-mono text-[10px] font-black text-secondary">Model: GEMINI-PRO-E</span>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-6 bg-white/30">
                  {isSearching ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                       <div className="relative">
                         <Database className="size-16 text-primary/20 animate-pulse" />
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                           className="absolute inset-0 border-4 border-t-primary border-transparent rounded-full"
                         />
                       </div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Traversing Vector Manifold...</p>
                    </div>
                  ) : similarCases.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-20">
                       <FileSearch className="size-20 mb-6" />
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">No semantic precedents detected for current ingest</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                       {similarCases.map((match, i) => (
                         <motion.div 
                           key={match.id}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: i * 0.1 }}
                           className="glass-card bg-slate-50/50 p-6 rounded-2xl border-slate-100 hover:border-primary/40 transition-all group shadow-sm hover:shadow-md"
                         >
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                 <div className="px-3 py-1 bg-white border border-slate-100 rounded text-[10px] font-black text-primary tracking-widest uppercase shadow-sm">{match.id}</div>
                                 <span className="text-[8px] font-mono text-slate-400 uppercase">{match.date}</span>
                               </div>
                               <div className="text-xl font-black text-secondary tracking-tighter">{(match.similarity * 100).toFixed(1)}%</div>
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 opacity-80 leading-relaxed mb-6 italic">
                               "{match.summary}"
                            </p>
                            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{match.severity}</span>
                               <button className="px-4 py-2 bg-slate-100 text-[9px] font-black text-slate-700 uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm border border-slate-200">
                                 Dossier <ChevronRight className="size-3" />
                               </button>
                            </div>
                         </motion.div>
                       ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="board"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 grid grid-cols-2 gap-8"
              >
                 <div className="glass-card rounded-2xl p-10 border-slate-200 bg-slate-50/40 flex flex-col items-center justify-center text-center space-y-8 shadow-sm">
                    <div className="w-32 h-32 rounded-full border-2 border-slate-200 flex items-center justify-center relative bg-white shadow-inner">
                       <Zap className="size-12 text-primary opacity-50 animate-pulse" />
                       <div className="absolute inset-0 rounded-full border-4 border-t-primary border-transparent animate-spin duration-[3s]" />
                    </div>
                    <div>
                      <h4 className="font-display text-2xl font-bold text-slate-900 tracking-tight uppercase">Ingestion Stream Active</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-4 opacity-50 leading-loose">
                        System synchronized with central medical gateway. Real-time classification protocols are operational.
                      </p>
                    </div>
                    <div className="flex gap-4 w-full max-w-sm mt-4">
                       <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
                          <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Queue Load</div>
                          <div className="text-xl font-black text-primary">124</div>
                       </div>
                       <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 text-center shadow-sm">
                          <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Uptime</div>
                          <div className="text-xl font-black text-secondary">99.8%</div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8 flex flex-col">
                    <div className="glass-card rounded-2xl p-8 border-slate-200 flex-1 relative overflow-hidden shadow-sm bg-white">
                       <div className="absolute -top-10 -right-10 opacity-5">
                         <LayoutGrid className="size-48" />
                       </div>
                       <h4 className="font-display text-lg font-bold text-slate-900 uppercase mb-6 flex items-center gap-3">
                         <Stethoscope className="size-5 text-secondary" />
                         Clinical Audit Stats
                       </h4>
                       <div className="space-y-6">
                          {[
                            { label: "Death Attribution", val: "12%", trend: "up", color: "text-red-500" },
                            { label: "Hospitalisation Delta", val: "84%", trend: "down", color: "text-primary" },
                            { label: "Disability Metric", val: "04%", trend: "stable", color: "text-secondary" },
                          ].map((s, i) => (
                            <div key={i} className="flex justify-between items-center group">
                               <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-50">{s.label}</p>
                                 <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                               </div>
                               <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                  <div className="h-full bg-secondary/30" style={{ width: s.val }} />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="glass-card rounded-2xl p-8 border-secondary/20 bg-secondary/5 shadow-sm">
                       <div className="flex gap-4">
                          <AlertTriangle className="size-6 text-secondary shrink-0" />
                          <p className="text-[10px] font-black text-secondary/80 uppercase leading-relaxed tracking-tighter">
                            REGULATORY ALERT: Section 7.4 of Clinical Trial Rules mandates SAE reporting within 24 hours of occurrence. Neural pipeline flags all delays exceeding 48h.
                          </p>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Persistent System Info */}
       <footer className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-xl">
        <div className="flex gap-8 items-center text-[9px] font-black uppercase tracking-widest text-slate-700">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
             Neural Hub Linked
           </div>
           <div>Dossier Integrity Verified</div>
           <div>v9.2.4-STABLE</div>
        </div>
        <div className="font-mono text-[9px] text-slate-800 font-black">
          © 2026 MINISTRY OF HEALTH & REGULATORY AFFAIRS
        </div>
      </footer>
    </div>
  );
}
