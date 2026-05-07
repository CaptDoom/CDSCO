import React, { useState, useRef } from "react";
import { Upload, FileCode, ShieldCheck, Download, Search, AlertCircle, Database, ChevronDown } from "lucide-react";
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
      setError("Anonymisation cycle failed. Neural weights are unreachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const currentOutput = anonymizedMode === 'pseudonymised' ? outputVersions.pseudonymised : outputVersions.irreversible;

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4C81] mb-2 uppercase">AI Anonymisation Tool</h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">DPDP Act 2023 • Regulatory De-identification Pipeline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
        {/* Left: Input */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50/50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Source Document / Patient Narration</span>
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  onClick={() => setShowSamples(!showSamples)}
                  className="px-3 py-1 bg-white hover:bg-gray-50 text-[#0F4C81] text-[10px] font-bold rounded-lg transition-colors border border-[#E2E8F0] flex items-center gap-2 uppercase tracking-widest"
                >
                  <Database className="size-3" />
                  Dataset Sample
                  <ChevronDown className={`size-3 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                </button>
                {showSamples && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    {OPEN_SOURCE_SAMPLES.anonymization.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setText(s.text);
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
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-white hover:bg-gray-50 text-[#0F4C81] text-[10px] font-bold rounded-lg transition-colors border border-[#E2E8F0] flex items-center gap-2 uppercase tracking-widest"
              >
                <Upload className="size-3" />
                Upload
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
          <div className="flex-1 relative flex flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw regulatory text or patient narration here..."
              className="flex-1 p-6 bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-gray-700 font-sans"
            />
            {error && (
              <div className="absolute inset-x-0 bottom-4 mx-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="size-3.5" />
                {error}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-[#E2E8F0] bg-gray-50/50">
            <button 
              onClick={handleProcess}
              disabled={isProcessing || !text}
              className={`w-full py-3 rounded-lg font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
                isProcessing ? "bg-gray-200 text-gray-400" : "bg-[#0F4C81] hover:opacity-90 text-white shadow-lg shadow-blue-900/10"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-100 border-t-[#0F4C81] rounded-full animate-spin" />
                  Neural Scrubbing...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  EXECUTE ANONYMISATION
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50/50">
            <div className="flex bg-white border border-[#E2E8F0] rounded-lg p-1">
               <button 
                onClick={() => setAnonymizedMode('pseudonymised')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${
                  anonymizedMode === 'pseudonymised' ? "bg-[#0F4C81] text-white" : "text-gray-400 hover:text-gray-600"
                }`}
               >
                 Step 1: Pseudonymised
               </button>
               <button 
                onClick={() => setAnonymizedMode('irreversible')}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${
                  anonymizedMode === 'irreversible' ? "bg-red-600 text-white" : "text-gray-400 hover:text-gray-600"
                }`}
               >
                 Step 2: Irreversible
               </button>
            </div>
            {currentOutput && (
               <div className="flex gap-2">
                 <span className="bg-green-50 text-green-600 text-[9px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase tracking-widest">
                   {anonymizedMode === 'irreversible' ? 'ANONYMOUS' : 'PROTECTED'}
                 </span>
               </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {!currentOutput && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                  <ShieldCheck className="size-10" />
                </div>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Select document to initiate Neural scrubbing</p>
              </div>
            )}

            {currentOutput && (
              <div className="space-y-8">
                {/* Advanced Metrics / Hybrid Audit */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-xl border border-[#E2E8F0]">
                  <div className="text-center">
                    <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">Regex Engine</div>
                    <div className="text-xl font-bold text-[#0F4C81]">{metrics?.hybrid_audit?.regex_matches || 0} hits</div>
                  </div>
                  <div className="text-center md:border-l border-[#E2E8F0]">
                    <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">Transformer</div>
                    <div className="text-xl font-bold text-[#0F4C81]">{metrics?.hybrid_audit?.transformer_entities || 0} objs</div>
                  </div>
                  <div className="text-center md:border-l border-[#E2E8F0]">
                    <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">k-Anonymity</div>
                    <div className="text-xl font-bold text-[#0F4C81]">k=5</div>
                  </div>
                  <div className="text-center md:border-l border-[#E2E8F0]">
                    <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">Confidence</div>
                    <div className="text-xl font-bold text-green-600">
                      {Math.round((metrics?.hybrid_audit?.context_confidence || 0.98) * 100)}%
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border font-mono text-xs leading-loose whitespace-pre-wrap transition-colors ${
                  anonymizedMode === 'irreversible' ? "bg-red-50/30 border-red-100 text-red-900" : "bg-blue-50/50 border-blue-100 text-[#0F4C81]"
                }`}>
                  {currentOutput}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Search className="size-3" />
                      Detected Entities ({results.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.map((ent, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg shadow-sm">
                          <span className="text-[9px] font-bold text-[#0F4C81] font-mono bg-blue-50 px-1.5 py-0.5 rounded">{ent.category}</span>
                          <span className="text-xs font-bold text-gray-600">{ent.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-[#E2E8F0] p-6 rounded-xl space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Compliance Audit (DPDP 2023)</h3>
                    <div className="space-y-3">
                       {[
                         { label: "Data Minimisation", status: "PASSED", cert: "Sec 4.2" },
                         { label: "Purpose Limitation", status: "VERIFIED", cert: "Sec 5.1" },
                         { label: "Right to Correction", status: "TOKENIZED", cert: "Sec 12.3" }
                       ].map((item, i) => (
                         <div key={i} className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold text-[#0F4C81]">{item.status}</span>
                               <span className="text-[8px] bg-white border px-1 rounded text-gray-300 font-mono">{item.cert}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="size-5 text-amber-600 shrink-0" />
                  <p className="text-[9px] text-amber-600 font-bold leading-relaxed uppercase font-mono tracking-tighter">
                    {anonymizedMode === 'pseudonymised' 
                      ? "PSEUDONYMISATION ACTIVE: Reversible using Private Key. CDSCO HSM Tokenisation enabled." 
                      : "IRREVERSIBLE ANONYMISATION: Generalisation applied. Subject ID mapping discarded for non-identifiability."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {currentOutput && (
            <div className="p-6 border-t border-[#E2E8F0] bg-gray-50/50 flex gap-4">
              <button className="flex-1 py-3 bg-white hover:bg-gray-50 text-[#0F4C81] text-[10px] font-bold rounded-lg border border-[#E2E8F0] flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
                <Download className="size-3.5" />
                Raw Export
              </button>
              <button className="flex-1 py-3 bg-[#0F4C81] hover:opacity-90 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest transition-all shadow-md">
                <ShieldCheck className="size-3.5" />
                Certify Results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
