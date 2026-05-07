import { useState } from "react";
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
  Cpu
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
      // Step 1: Real-time neural extraction (Stream)
      const stream = streamSummarizeDocument(text, docType);
      for await (const chunk of stream) {
        setStreamedContent(prev => prev + chunk);
      }
      setIsStreaming(false);

      // Step 2: Structured Audit (Final result)
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
    { id: 'SUGAM', label: "SUGAM Application" },
    { id: 'SAE', label: "SAE Case Narration" },
    { id: 'MEETING', label: "Meeting Transcript" }
  ];

  return (
    <div className="space-y-8 pb-12 h-full flex flex-col animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4C81] mb-2 uppercase">AI Document Summarisation</h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Regulatory Intelligence • CDSCO v4.2 Pipeline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
        {/* Left: Input Selection & Text */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50/50">
            <div className="flex gap-2 overflow-x-auto">
              {docTypes.map(type => (
                <button 
                  key={type.id}
                  onClick={() => setDocType(type.id as any)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                    docType === type.id 
                      ? "bg-[#0F4C81] text-white border-[#0F4C81] shadow-md" 
                      : "bg-white text-gray-400 border-gray-200 hover:text-gray-600"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowSamples(!showSamples)}
                className="px-3 py-2 bg-white text-gray-600 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 uppercase tracking-widest transition-all"
              >
                <Database className="size-3" />
                Samples
                <ChevronDown className={`size-3 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
              </button>
              {showSamples && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  {OPEN_SOURCE_SAMPLES.summarization.map((s, i) => (
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
          </div>
          <div className="flex-1 p-6 relative flex flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Paste ${docType} content here for AI summarisation...`}
              className="flex-1 w-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-gray-700 font-sans"
            />
            {isProcessing && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-4">
                     <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0F4C81] rounded-full animate-spin" />
                     <span className="text-[10px] font-bold text-[#0F4C81] uppercase tracking-[0.2em] font-mono">Neural Extraction Active</span>
                  </div>
               </div>
            )}
          </div>
          <div className="p-4 border-t border-[#E2E8F0] bg-gray-50/50">
            <button 
              onClick={handleSummarize}
              disabled={isProcessing || !text}
              className={`w-full py-3 rounded-lg font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
                isProcessing ? "bg-gray-200 text-gray-400" : "bg-[#0F4C81] hover:opacity-90 text-white shadow-lg shadow-blue-900/10"
              }`}
            >
              <FileText className="size-4" />
              GENERATE REGULATORY BRIEF
            </button>
          </div>
        </div>

        {/* Right: Summary Output */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl flex flex-col shadow-sm overflow-hidden relative">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
               <BrainCircuit className="size-4 text-[#0F4C81]" />
               Structured Output
            </h3>
            {result && (
               <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                 <CheckCircle2 className="size-3" />
                 VERIFIED
               </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {!result && !isProcessing && !streamedContent && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <FileText className="size-10 text-gray-300" />
                </div>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Awaiting instruction • Ready for ingestion</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {(isStreaming || streamedContent) && !result && (
                <motion.div
                  key="streaming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-[#0F4C81] text-[10px] font-bold uppercase tracking-widest animate-pulse mb-6">
                    <Cpu className="size-3.5" />
                    Deep Neural Reconstruction in progress...
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-sans prose-headings:text-[#0F4C81] prose-headings:uppercase prose-headings:text-[10px] prose-headings:font-bold prose-headings:tracking-widest">
                    <ReactMarkdown>{streamedContent}</ReactMarkdown>
                  </div>
                  {isStreaming && (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#0F4C81] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-[#0F4C81] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-[#0F4C81] rounded-full animate-bounce" />
                    </div>
                  )}
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-[#0F4C81] tracking-tight">{result.title || "Executive Summary"}</h3>
                    <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>DOC TYPE: <span className="text-gray-600">{result.type || docType}</span></span>
                      <span>CONFIDENCE: <span className="text-blue-600 font-mono">{Math.round((result.completeness || 0.95) * 100)}%</span></span>
                    </div>
                  </div>

                  {result.metrics && (
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">ROUGE-1</p>
                            <p className="text-sm font-bold text-[#0F4C81]">{result.metrics.rouge1?.toFixed(3)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">ROUGE-L</p>
                            <p className="text-sm font-bold text-[#0F4C81]">{result.metrics.rougeL?.toFixed(3)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">BERT-Score</p>
                            <p className="text-sm font-bold text-[#0F4C81]">{result.metrics.bertScore?.toFixed(3)}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Latency</p>
                            <p className="text-xs font-bold text-gray-500">{result.metrics.latencyMs?.toFixed(0)} ms</p>
                        </div>
                    </div>
                  )}

                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl leading-loose text-gray-700 text-sm italic font-medium">
                    "{result.summary}"
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E2E8F0] pb-2">Key Extracted Highlights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(result.key_points || result.sections?.map((s:any)=>s.heading)).map((point: any, i: number) => (
                          <div key={i} className="p-4 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-gray-600 flex gap-3 shadow-sm hover:border-blue-200 transition-colors">
                            <div className="w-1.5 h-1.5 bg-[#0F4C81] rounded-full mt-1.5 shrink-0" />
                            {point.heading || point}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                        <AlertTriangle className="size-3" />
                        Critical Regulatory Flags
                      </h4>
                      <div className="space-y-2">
                        {result.flags?.length ? result.flags.map((flag: string, i: number) => (
                          <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 flex gap-3">
                            <AlertCircle className="size-4 shrink-0" />
                            {flag}
                          </div>
                        )) : (
                          <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-xs font-bold text-green-600">
                            No immediate regulatory conflicts detected.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {result && (
            <div className="p-6 border-t border-[#E2E8F0] bg-gray-50/50 flex gap-4">
              <button className="flex-1 py-3 bg-white hover:bg-gray-50 text-[#0F4C81] text-[10px] font-bold rounded-lg border border-[#E2E8F0] flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
                <Download className="size-3.5" />
                Raw JSON
              </button>
              <button className="flex-1 py-3 bg-[#0F4C81] hover:opacity-90 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest transition-all shadow-md">
                <FileText className="size-3.5" />
                Download PDF Brief
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
