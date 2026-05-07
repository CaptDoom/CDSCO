import { useState } from "react";
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
  ChevronDown
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
        // We reuse summarizer logic for completeness check as it already has the schema
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
    <div className="space-y-8 pb-12 h-full flex flex-col animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F4C81] mb-2 uppercase">Compliance & Versioning</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Regulatory Completeness • Delta Analysis Platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowSamples(!showSamples)}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-[#0F4C81] text-[10px] font-bold rounded-lg border border-[#E2E8F0] shadow-sm flex items-center gap-2 uppercase tracking-widest transition-all"
            >
              <Database className="size-3" />
              Dataset Samples
              <ChevronDown className={`size-3 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
            </button>
            {showSamples && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[#E2E8F0] shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-3 bg-gray-50 border-b border-[#E2E8F0] text-[9px] font-bold text-gray-400 uppercase tracking-widest">
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
                    className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-0 transition-colors"
                  >
                    <p className="text-[10px] font-bold text-[#0F4C81] uppercase">{s.name}</p>
                    <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Source: {s.source}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex bg-gray-50 border border-[#E2E8F0] rounded-xl p-1 shadow-inner">
            <button 
              onClick={() => { setMode('comparison'); setResult(null); setShowSamples(false); }}
              className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                mode === 'comparison' ? "bg-white text-[#0F4C81] shadow-md border border-blue-50" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Version Comparison
            </button>
            <button 
              onClick={() => { setMode('completeness'); setResult(null); setShowSamples(false); }}
              className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                mode === 'completeness' ? "bg-white text-[#0F4C81] shadow-md border border-blue-50" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Completeness Audit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
        {/* Left: Inputs */}
        <div className="space-y-6 flex flex-col">
          {mode === 'comparison' ? (
            <>
              <div className="bg-white border border-[#E2E8F0] rounded-xl flex-1 flex flex-col shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Document A (Reference)</span>
                  <FileText className="size-4 text-gray-400" />
                </div>
                <textarea
                  value={docA}
                  onChange={(e) => setDocA(e.target.value)}
                  placeholder="Paste original document content..."
                  className="flex-1 p-6 bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-gray-700 font-sans"
                />
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-xl flex-1 flex flex-col shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Document B (Modified)</span>
                  <FileCheck2 className="size-4 text-[#0F4C81]" />
                </div>
                <textarea
                  value={docB}
                  onChange={(e) => setDocB(e.target.value)}
                  placeholder="Paste updated document content..."
                  className="flex-1 p-6 bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-gray-700 font-sans"
                />
              </div>
            </>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-xl flex-1 flex flex-col shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Regulatory Application (SUGAM Forms)</span>
                <ClipboardCheck className="size-4 text-[#0F4C81]" />
              </div>
              <textarea
                value={docCheck}
                onChange={(e) => setDocCheck(e.target.value)}
                placeholder="Paste application content to audit for completeness..."
                className="flex-1 p-6 bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-gray-700 font-sans"
              />
            </div>
          )}

          <button 
            onClick={handleAction}
            disabled={isProcessing || (mode === 'comparison' ? (!docA || !docB) : !docCheck)}
            className={`w-full py-4 rounded-lg font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
              isProcessing ? "bg-gray-200 text-gray-400" : "bg-[#0F4C81] hover:opacity-90 text-white shadow-lg shadow-blue-900/10"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-100 border-t-[#0F4C81] rounded-full animate-spin" />
                NEURAL AUDIT IN PROGRESS...
              </>
            ) : (
              <>
                <ArrowLeftRight className="size-4" />
                {mode === 'comparison' ? 'EXECUTE DELTA ANALYSIS' : 'VERIFY COMPLETENESS'}
              </>
            )}
          </button>
        </div>

        {/* Right: Results Dashboard */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden relative">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
               <FileDiff className="size-4 text-[#0F4C81]" />
               Analysis Dashboard
            </h3>
            {result && (
               <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase">
                 {mode === 'comparison' ? `Magnitude: ${result.changeMagnitude}%` : `Score: ${Math.round((result.completeness || 0) * 100)}%`}
               </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {!result && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <FileDiff className="size-16 text-gray-300" />
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Select mode and provide data to initiate AI audit</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {result && mode === 'comparison' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-gray-600 leading-relaxed font-medium">
                    <p className="mb-4 font-bold text-[#0F4C81] uppercase text-[10px] tracking-widest">Analysis Executive Summary</p>
                    {result.summary}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E2E8F0] pb-2">Identified Substantive Diffs</h4>
                    <div className="space-y-4">
                      {result.diffs.map((diff: any, i: number) => (
                        <div key={i} className={`p-5 rounded-xl border-l-[6px] shadow-sm flex flex-col gap-3 bg-white border border-[#E2E8F0] ${
                          diff.type === 'ADDITION' ? 'border-l-green-500' :
                          diff.type === 'DELETION' ? 'border-l-red-500' :
                          'border-l-amber-500'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              diff.type === 'ADDITION' ? 'bg-green-50 text-green-600' :
                              diff.type === 'DELETION' ? 'bg-red-50 text-red-600' :
                              'bg-amber-50 text-amber-600'
                            }`}>
                              • {diff.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 font-bold leading-relaxed">
                            {diff.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {result && mode === 'completeness' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Audit Score</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-[#0F4C81]">{Math.round((result.completeness || 0) * 100)}%</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Compliant</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Flags Detected</p>
                      <div className="flex items-end gap-2">
                        <span className={`text-2xl font-bold ${result.flags?.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {result.flags?.length || 0}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Actions Required</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E2E8F0] pb-2">Verification Checklist</h4>
                    <div className="space-y-3">
                      {(result.key_points || []).map((point: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
                          <div className="size-5 bg-green-50 border border-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="size-3 text-green-500" />
                          </div>
                          <span className="text-xs font-bold text-gray-600">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.flags?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest border-b border-red-100 pb-2">Missing/Inconsistent Fields</h4>
                      <div className="space-y-2">
                        {result.flags.map((flag: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                            <AlertCircle className="size-4 text-red-500 shrink-0" />
                            <span className="text-xs font-bold text-red-700">{flag}</span>
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
    </div>
  );
}
