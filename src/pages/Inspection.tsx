import { useState } from "react";
import { ClipboardCheck, FilePlus, Download, PenTool, ShieldCheck, AlertTriangle, Database, ChevronDown } from "lucide-react";
import { generateInspectionReport } from "../services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { OPEN_SOURCE_SAMPLES } from "../data/samples";

export default function Inspection() {
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleGenerate = async () => {
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
  };

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F4C81] mb-2 uppercase">Inspection Report Generation</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">CDSCO Field Intelligence • NLP-Enhanced Reporting</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest">Ensemble OCR:</span>
            <span className="text-[10px] font-bold font-mono tracking-tighter">TESSERACT 5 + PADDLE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
        {/* Left: Input */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
               <FilePlus className="size-4 text-amber-500" />
               Field Observations / OCR Data
            </span>
            <div className="flex gap-2">
               <div className="relative">
                 <button 
                  onClick={() => setShowSamples(!showSamples)}
                  className="px-3 py-1 bg-white hover:bg-gray-100 text-amber-600 text-[9px] font-bold rounded border border-amber-200 flex items-center gap-2 uppercase tracking-widest transition-all"
                 >
                   <Database className="size-3" />
                   OCR Samples
                   <ChevronDown className={`size-3 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                 </button>
                 {showSamples && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    {OPEN_SOURCE_SAMPLES.inspection.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setNotes(s.text);
                          setShowSamples(false);
                        }}
                        className="w-full p-4 text-left hover:bg-gray-50 border-b last:border-0 transition-colors"
                      >
                        <p className="text-[10px] font-bold text-amber-600 uppercase">{s.name}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Source: {s.source}</p>
                      </button>
                    ))}
                  </div>
                 )}
               </div>
               <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-widest border border-amber-100">Handwriting Layer Active</span>
            </div>
          </div>
          <div className="flex-1 p-8 space-y-4 relative">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter raw inspection notes here. (e.g., 'Temp in storage was 28C, facility lacks proper drainage at site B...')"
              className="w-full h-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-gray-700 font-sans custom-scrollbar"
            />
            {isProcessing && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-4">
                     <div className="w-10 h-10 border-4 border-gray-100 border-t-amber-500 rounded-full animate-spin" />
                     <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] font-mono">Formalising Document</span>
                  </div>
               </div>
            )}
          </div>
          <div className="p-4 border-t border-[#E2E8F0] bg-gray-50/50">
            <button 
              onClick={handleGenerate}
              disabled={isProcessing || !notes}
              className={`w-full py-4 rounded-lg font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
                isProcessing ? "bg-gray-200 text-gray-400" : "bg-amber-600 hover:opacity-90 text-white shadow-lg shadow-amber-900/10"
              }`}
            >
              GENERATE FORMAL REPORT
              <PenTool className="size-4" />
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden relative">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck className="size-4 text-[#0F4C81]" />
               Formal Regulatory Report
            </h3>
            {report && (
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                report.severity_rating === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-[#0F4C81] border-blue-100'
              }`}>
                {report.severity_rating || 'NOMINAL'}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50 custom-scrollbar">
            <AnimatePresence mode="wait">
              {!report && !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 opacity-30">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <ClipboardCheck className="size-10 text-gray-300" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">No report generated • Awaiting field notes</p>
                </div>
              )}

              {report && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-12 rounded-lg shadow-xl text-black font-serif min-h-[800px] relative overflow-hidden border border-[#E2E8F0] space-y-10">
                    <div className="flex justify-between border-b-2 border-black pb-6">
                      <div className="text-[10px] font-bold leading-tight uppercase tracking-tight">
                        Central Drugs Standard Control Organisation<br/>
                        Ministry of Health & Family Welfare<br/>
                        Goverment of India
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold font-mono text-[#0F4C81]">REF: {report.inspection_details?.id || "CDSCO/FIELD/2026"}</div>
                        <div className="text-[10px] font-bold font-mono">{report.inspection_details?.date || new Date().toISOString().split('T')[0]}</div>
                      </div>
                    </div>
                    
                    <h2 className="text-center text-lg font-bold uppercase underline decoration-double tracking-tight">GCP Inspection Report</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[11px] border-b border-gray-200 pb-6">
                       <div className="space-y-4">
                          <h3 className="font-black uppercase border-l-4 border-[#0F4C81] pl-2">1. Inspection Details</h3>
                          <div className="grid grid-cols-2 gap-x-2">
                             <p className="text-gray-500 font-bold uppercase">Site Name:</p>
                             <p>{report.inspection_details?.site}</p>
                             <p className="text-gray-500 font-bold uppercase">Inspectors:</p>
                             <p>{report.inspection_details?.inspectors}</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="font-black uppercase border-l-4 border-[#0F4C81] pl-2">2. Study Details</h3>
                          <div className="grid grid-cols-2 gap-x-2">
                             <p className="text-gray-500 font-bold uppercase">Protocol:</p>
                             <p>{report.study_details?.protocol}</p>
                             <p className="text-gray-500 font-bold uppercase">Sponsor:</p>
                             <p>{report.study_details?.sponsor}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6 text-[12px]">
                       <h3 className="font-black uppercase border-l-4 border-amber-500 pl-2">3. Observations</h3>
                       <div className="space-y-4">
                          {report.observations?.critical?.length > 0 && (
                             <div className="space-y-2">
                                <p className="text-[10px] font-bold text-red-600 uppercase">Critical Findings</p>
                                <ul className="list-disc pl-5 space-y-1 italic">
                                   {report.observations.critical.map((v:any, i:any) => <li key={i}>{v}</li>)}
                                </ul>
                             </div>
                          )}
                          {report.observations?.major?.length > 0 && (
                             <div className="space-y-2">
                                <p className="text-[10px] font-bold text-amber-600 uppercase">Major Findings</p>
                                <ul className="list-disc pl-5 space-y-1">
                                   {report.observations.major.map((v:any, i:any) => <li key={i}>{v}</li>)}
                                </ul>
                             </div>
                          )}
                          <div className="space-y-2">
                             <p className="text-[10px] font-bold text-gray-400 uppercase">Recommendations</p>
                             <p className="leading-relaxed text-justify">{report.observations?.recommendations?.[0] || report.formal_report_text}</p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 pt-6 border-t border-gray-100">
                       <div className="space-y-4">
                          <h3 className="text-[11px] font-black uppercase">4. Classification</h3>
                          <div className="space-y-2 text-[10px]">
                             <div className="flex justify-between border-b pb-1">
                                <span className="font-bold text-gray-500 uppercase">Compliance</span>
                                <span className="font-black text-[#0F4C81]">{report.classification?.compliance}</span>
                             </div>
                             <div className="flex justify-between border-b pb-1">
                                <span className="font-bold text-gray-500 uppercase">Risk Level</span>
                                <span className="font-black text-red-600">{report.classification?.risk}</span>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-[11px] font-black uppercase">5. Action Required</h3>
                          <div className="p-3 bg-gray-50 rounded border border-gray-100 italic text-[10px]">
                             <p className="font-bold text-[#0F4C81] mb-1">{report.action_required?.type || "CAPA Submission"}</p>
                             <p>Deadline: {report.action_required?.deadline || "30 Days from issue"}</p>
                          </div>
                       </div>
                    </div>

                    <div className="mt-16 pt-12 border-t flex justify-end">
                      <div className="text-center">
                        <div className="w-40 border-b-2 border-black mb-2 shadow-sm" />
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Inspector Digital Sign-off</div>
                        <div className="text-[8px] font-mono mt-1 text-[#0F4C81]">{btoa(report.inspection_details?.id || 'sign').substring(0,24)}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {report && (
            <div className="p-6 border-t border-[#E2E8F0] bg-gray-50/50 flex gap-4">
              <button className="flex-1 py-3 bg-[#0F4C81] hover:opacity-90 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest shadow-md transition-all">
                <Download className="size-3.5" />
                Archive CDSCO PDF
              </button>
              <button className="flex-1 py-3 bg-white hover:bg-gray-50 text-[#0F4C81] text-[10px] font-bold rounded-lg border border-[#E2E8F0] flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
                <ShieldCheck className="size-3.5" />
                Digital Signature
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

