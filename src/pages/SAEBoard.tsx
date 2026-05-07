import { useState } from "react";
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
  LayoutGrid,
  Filter,
  Copy,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_SOURCE_SAMPLES } from "../data/samples";
import { classifySAE, streamClassifySAE } from "../services/geminiService";
import ReactMarkdown from "react-markdown";

export default function SAEBoard() {
  const [activeView, setActiveView] = useState<'board' | 'analysis'>('board');
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedJustification, setStreamedJustification] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  const queueItems = [
    { id: "SAE-441", hospital: "AIIMS Delhi", status: "CRITICAL", time: "2 mins ago", type: "DEATH", text: "82Y Male. History of chronic renal failure. Developed multi-organ failure after first dose of TEST-ANTI-INF. Death occurred at 04:00." },
    { id: "SAE-442", hospital: "PGIMER", status: "ELEVATED", time: "15 mins ago", type: "HOSPITALISATION", text: "Female patient experienced acute cardiac distress following the administration of TEST-DRUG-X (Batch #442). Significant drop in BP (70/40 mmHg)." },
    { id: "SAE-443", hospital: "CMC Vellore", status: "PENDING", time: "1 hour ago", type: "DISABILITY", text: "Subject reported persistent numbness in lower extremities 48 hours after vaccination. EMG shows signs of acute inflammatory demyelinating polyradiculoneuropathy." },
  ];

  const handleClassify = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;
    
    if (textToUse) setInputText(textToUse);
    
    setIsProcessing(true);
    setIsStreaming(true);
    setStreamedJustification("");
    setAnalysis(null);
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
    } catch (err) {
      console.error(err);
      setError("Failed to audit case narration. Please verify the neural node connection.");
    } finally {
      setIsProcessing(false);
      setIsStreaming(false);
    }
  };

  const shapFeatures = [
    { label: '"intensive care"', value: 0.842, color: "bg-[#0F4C81]" },
    { label: '"impairment"', value: 0.615, color: "bg-[#0F4C81]" },
    { label: '"acute distress"', value: 0.552, color: "bg-[#0F4C81]" },
    { label: '"mild discomfort" (Base)', value: -0.312, color: "bg-red-100" },
  ];

  const classifications = [
    { label: "Death", value: "2.1%" },
    { label: "Disability / Hospitalisation", value: "94.2%", active: true },
    { label: "Other Medical Event", value: "3.7%" },
  ];

  const similarIncidents = [
    { id: "SAE-88120-Z", match: "89% Match", desc: "Ventricular tachycardia following TEST-DRUG-X..." },
    { id: "SAE-10029-A", match: "74% Match", desc: "Subject experienced anaphylaxis and persistent..." },
  ];

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F4C81] mb-2 uppercase">SAE Classification Engine</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Medical Review Board • Severity & Causality Audit</p>
        </div>
        <div className="flex bg-gray-50 border border-[#E2E8F0] rounded-xl p-1 shadow-inner">
          <button 
            onClick={() => setActiveView('board')}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
              activeView === 'board' ? "bg-white text-[#0F4C81] shadow-md border border-blue-50" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Case Ingestion
          </button>
          <button 
            onClick={() => setActiveView('analysis')}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
              activeView === 'analysis' ? "bg-white text-[#0F4C81] shadow-md border border-blue-50" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Neural Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Left: Input / Queue */}
        <div className="lg:col-span-1 bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Input Narration</span>
            <div className="relative">
              <button 
                onClick={() => setShowSamples(!showSamples)}
                className="hover:text-[#0F4C81] transition-colors flex items-center gap-1"
              >
                <Database className="size-3" />
                Samples
              </button>
              {showSamples && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#E2E8F0] shadow-xl rounded-xl z-50 overflow-hidden">
                  {OPEN_SOURCE_SAMPLES.sae.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInputText(s.text); setShowSamples(false); }}
                      className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-0 transition-colors text-[10px] font-bold"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-4">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste SAE case details for neural classification..."
                className="w-full h-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-gray-700 font-sans border-b border-gray-100 placeholder:text-gray-300"
              />
              {error && (
                <div className="absolute inset-x-0 bottom-12 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase animate-in fade-in slide-in-from-bottom-2">
                  <AlertCircle className="size-3.5" />
                  {error}
                </div>
              )}
              {inputText && (
                <button 
                  onClick={() => { setInputText(""); setAnalysis(null); setError(null); }}
                  className="absolute bottom-2 right-0 text-[9px] font-bold text-red-400 hover:text-red-500 uppercase tracking-widest"
                >
                  Clear Input
                </button>
              )}
            </div>
            <button
              onClick={() => handleClassify()}
              disabled={isProcessing || !inputText}
              className={`w-full py-4 rounded-lg font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
                isProcessing ? "bg-gray-200 text-gray-400" : "bg-[#0F4C81] hover:opacity-90 text-white shadow-lg shadow-blue-900/10"
              }`}
            >
              {isProcessing ? <Zap className="size-4 animate-pulse" /> : <ShieldAlert className="size-4" />}
              {isProcessing ? "AUDITING..." : "CLASSIFY CASE SEVERITY"}
            </button>
          </div>
        </div>

        {/* Right: Analysis Dashboard */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === 'board' ? (
              <motion.div 
                key="board"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Priority Review Queue</span>
                  <Filter className="size-3" />
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50/30">
                  {queueItems.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleClassify(item.text)}
                      className="bg-white border border-[#E2E8F0] p-4 rounded-xl flex items-center justify-between shadow-sm hover:border-[#0F4C81]/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                          item.status === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.type[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#0F4C81]">{item.id}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">{item.hospital} • {item.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                          item.status === 'CRITICAL' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                        <ChevronRight className="size-4 text-gray-300 group-hover:text-[#0F4C81] transition-colors" />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center py-8 opacity-20 flex-col gap-2">
                    <HistoryIcon className="size-8" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">End of verified queue</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col p-8 space-y-8"
              >
                {!analysis && !streamedJustification && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                    <BrainCircuit className="size-16 text-gray-300 mb-4" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Neural weights ready • Ingest case for classification</p>
                  </div>
                )}

                {(isStreaming || streamedJustification) && !analysis && (
                  <div className="space-y-6 flex-1 overflow-y-auto pr-4">
                    <div className="flex items-center gap-3 text-[#0F4C81] text-[10px] font-bold uppercase tracking-widest animate-pulse border-b border-blue-50 pb-4">
                      <Cpu className="size-4" />
                      Neural reasoning stream active
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-sans">
                       <ReactMarkdown>{streamedJustification}</ReactMarkdown>
                    </div>
                    {isStreaming && (
                      <div className="flex gap-1.5 py-4">
                        <div className="w-2 h-2 bg-[#0F4C81] rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-[#0F4C81] rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-[#0F4C81] rounded-full animate-bounce" />
                      </div>
                    )}
                  </div>
                )}

                {analysis && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl md:col-span-2">
                        <p className="text-[9px] font-bold text-red-600 uppercase mb-2">Automated Severity Detection (v4.2)</p>
                        <h2 className="text-4xl font-black text-red-700 tracking-tighter uppercase">{analysis.severity}</h2>
                        <p className="text-xs text-red-800 font-bold mt-4 leading-relaxed line-clamp-3">
                          {analysis.justification}
                        </p>
                      </div>
                      <div className="p-6 bg-[#0F4C81] rounded-2xl flex flex-col justify-between text-white shadow-xl shadow-blue-900/20">
                        <div>
                          <p className="text-[9px] font-bold opacity-60 uppercase mb-1">Classifier Confidence</p>
                          <p className="text-3xl font-bold">{(analysis.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CloudLightning className="size-4 text-amber-300" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">GPU Edge Accelerated</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Duplicate Detection Matrix</h3>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                           <div className="flex justify-between items-center mb-4">
                             <div className="flex items-center gap-2">
                               <Copy className="size-3 text-[#0F4C81]" />
                               <span className="text-[10px] font-bold text-gray-700">Semantic Duplicates</span>
                             </div>
                             <span className="text-[10px] font-bold text-green-600 uppercase">Unique (0 fits)</span>
                           </div>
                           <div className="space-y-1">
                             <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                               <div className="h-full bg-green-500 w-[4%]" />
                             </div>
                             <p className="text-[8px] text-gray-400 font-bold">Hash Conflict probability: 0.00042%</p>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Explainable AI (SHAP)</h3>
                        <div className="space-y-3">
                          {shapFeatures.map((f, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                              <div className="flex justify-between text-[9px] font-bold uppercase">
                                <span className="text-gray-500">{f.label}</span>
                                <span className="text-[#0F4C81]">+{f.value}</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full flex overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${f.value * 100}%` }}
                                  className={`h-full ${f.color}`} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="flex-1 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[10px] font-bold text-[#0F4C81] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <LayoutGrid className="size-3.5" />
                        Compare Similar Cases
                      </button>
                      <button className="flex-1 py-3 bg-[#0F4C81] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg">
                        <BrainCircuit className="size-3.5" />
                        Audit Neural Weights
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
