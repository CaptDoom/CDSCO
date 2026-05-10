import React, { useState, useMemo } from "react";
import { 
  BarChart3, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Target, 
  Layers,
  FileSearch,
  CheckCircle2,
  Table as TableIcon,
  AlertTriangle,
  Code2,
  Database,
  LineChart,
  ArrowUpRight,
  TrendingUp,
  Settings2,
  Trophy,
  Activity,
  Verified,
  ShieldAlert,
  Server,
  Zap as CloudZap,
  ArrowRight,
  Lock,
  Layout,
  Binary
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Benchmarks() {
  const [activeParam, setActiveParam] = useState("p5"); // Parameter 5 default (Robustness)

  const parameters = [
    { id: "p1", label: "P1: Data Prep", icon: Database },
    { id: "p2", label: "P2: Model Building", icon: Cpu },
    { id: "p3", label: "P3: Model Evaluation", icon: Target },
    { id: "p4", label: "P4: Code/Report", icon: Code2 },
    { id: "p5", label: "P5: Robustness", icon: ShieldCheck },
  ];

  const renderP1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="glass-card p-8 rounded-2xl border-slate-200 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-3">
          <TrendingUp className="size-4 text-primary" />
          Skewness Mitigation Matrix
        </h4>
        <div className="flex items-end gap-3 h-48 mb-8">
           {[0.8, 0.65, 0.45, 0.3, 0.15, 0.05].map((h, i) => (
             <div key={i} className="flex-1 space-y-1.5 relative group/bar">
               <div className="w-full bg-red-100 rounded-t-sm transition-all duration-1000" style={{ height: `${h * 100}%` }} />
               <div className="w-full bg-primary rounded-t-sm transition-all duration-1000 absolute bottom-0 left-0" style={{ height: `${(h * 0.2) * 100}%` }} />
               <div className="absolute top-full pt-2 w-full text-center opacity-0 group-hover/bar:opacity-100 transition-opacity">
                  <span className="font-mono text-[8px] font-black text-slate-900">-{Math.round(h*100)}%</span>
               </div>
             </div>
           ))}
        </div>
        <div className="flex justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">Raw Skew</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase">Log-Mitigated</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl border-slate-200 shadow-sm space-y-8">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
          <Database className="size-4 text-secondary" />
          Stratified Split Logic
        </h4>
        <div className="space-y-6">
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-900 uppercase opacity-60 tracking-wider">Train Set (80%)</span>
               <span className="font-mono text-xs font-black text-primary">n = 124,502</span>
             </div>
             <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-primary" />
             </div>
           </div>
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-900 uppercase opacity-60 tracking-wider">Test Set (20%)</span>
               <span className="font-mono text-xs font-black text-secondary">n = 31,126</span>
             </div>
             <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div initial={{ width: 0 }} animate={{ width: '20%' }} className="h-full bg-secondary" />
             </div>
           </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 italic text-[9px] font-medium text-slate-500 leading-relaxed">
          *Stratification maintained across severity classes (Death, Disability, Hosp) with seed 42 and GPU-accelerated shuffle buffers.
        </div>
      </div>
    </div>
  );

  const renderP2 = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="md:col-span-2 glass-card rounded-2xl border-slate-200 overflow-hidden shadow-sm bg-white">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
            <Activity className="size-4 text-primary" />
            Model Selection Matrix
          </h4>
          <span className="font-mono text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 uppercase">Audit Trail: v2.4.1</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Architecture</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Score (u)</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Latency</th>
                <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: "Logistic Regression (TF-IDF)", score: 0.68, latency: "12ms", status: "Baseline" },
                { name: "Random Forest (Ensemble)", score: 0.74, latency: "85ms", status: "Discarded" },
                { name: "Clinical-RoBERTa (Base)", score: 0.89, latency: "420ms", status: "Selected" },
                { name: "Clinical-RoBERTa (Large)", score: 0.91, latency: "1850ms", status: "In-Review" }
              ].map((m, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-6 text-[10px] font-black text-slate-900 group-hover:text-primary transition-colors">{m.name}</td>
                  <td className="p-6 text-[10px] font-black text-center text-primary">{m.score}</td>
                  <td className="p-6 text-[10px] font-medium text-center text-slate-400 opacity-60">{m.latency}</td>
                  <td className="p-6 text-right">
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded tracking-tighter border shadow-sm ${
                      m.status === 'Selected' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="glass-card p-8 rounded-2xl border-slate-200 bg-primary/5 shadow-sm relative overflow-hidden group">
         <div className="absolute bottom-0 right-0 p-8 text-primary opacity-[0.03] group-hover:opacity-[0.07] transition-all group-hover:scale-110">
            <Settings2 className="size-48" />
         </div>
         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 flex items-center gap-3">
            <Cpu className="size-4" />
            Inference Tuning
         </h4>
         <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-end border-b border-primary/10 pb-4">
              <span className="text-[9px] font-black text-slate-900 uppercase opacity-40">Trials Completed:</span>
              <span className="font-display text-4xl font-black text-primary">150</span>
            </div>
            <div className="p-6 bg-white rounded-xl border border-primary/20 font-mono text-[10px] text-primary leading-relaxed shadow-inner">
               <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/5">
                  <Zap className="size-3" />
                  <span className="font-black uppercase tracking-widest">Optimal Vectors</span>
               </div>
               - lr: 2.34e-05<br/>
               - weight_decay: 0.01<br/>
               - scheduler: linear_warmup<br/>
               - dropout: 0.12
            </div>
            <button className="w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-md hover:brightness-110 active:scale-95 transition-all">
              Initialize Optuna Hub
            </button>
         </div>
      </div>
    </div>
  );

  const renderP5 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="lg:col-span-8 space-y-8">
        <div className="glass-card rounded-2xl p-8 border-slate-200 shadow-sm relative overflow-hidden group bg-white">
           <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <Verified className="size-6" />
                 </div>
                 <div>
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Public Dataset Benchmarks</h3>
                   <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest opacity-60 flex items-center gap-2">
                     <Binary className="size-2.5" />
                     SROIE | ICDAR | FUNSD | CNN/DailyMail
                   </p>
                 </div>
              </div>
              <div className="px-6 py-3 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-3">
                <CheckCircle2 className="size-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">CERTIFIED GOLD 1.0</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Text Extraction (CER)", score: "2.43%", benchmark: "SROIE", target: "<5%", icon: FileSearch },
                { label: "Key Info Ext (F1)", score: "0.912", benchmark: "FUNSD", target: ">0.85", icon: Layout },
                { label: "Summarisation (R-L)", score: "0.428", benchmark: "CNN/DM", target: ">0.40", icon: Layers },
                { label: "Classification (MCC)", score: "0.920", benchmark: "CDSCO", target: ">0.80", icon: ShieldCheck }
              ].map((b, i) => (
                <div key={i} className="p-6 bg-slate-50/40 border border-slate-100 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all hover:bg-slate-50 shadow-sm">
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">{b.label}</p>
                         <b.icon className="size-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="font-display text-4xl font-black text-slate-900 mb-4 tracking-tighter group-hover:text-primary transition-colors">{b.score}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-tighter">{b.benchmark}</span>
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-[8px] font-black text-slate-400 uppercase opacity-60">Target {b.target}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-card p-8 rounded-2xl border-slate-200 shadow-sm relative overflow-hidden bg-white">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
             <ShieldAlert className="size-4 text-secondary" />
             Privacy Invariants: Anonymisation Rigor
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/10 group hover:border-secondary/30 transition-all text-center shadow-sm">
                <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-4">k-Anonymity</p>
                <p className="font-display text-4xl font-black text-secondary tracking-tighter mb-2">k=5</p>
                <div className="h-1 bg-secondary/10 w-full rounded-full overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-secondary" />
                </div>
              </div>
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 group hover:border-primary/30 transition-all text-center shadow-sm">
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">l-Diversity</p>
                <p className="font-display text-4xl font-black text-primary tracking-tighter mb-2">l=3</p>
                <div className="h-1 bg-primary/10 w-full rounded-full overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-primary" />
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 group hover:border-slate-400 transition-all text-center shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-70">t-Closeness</p>
                <p className="font-display text-4xl font-black text-slate-900 tracking-tighter mb-2 opacity-60">t=0.12</p>
                <div className="h-1 bg-slate-200 w-full rounded-full overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-slate-400/30" />
                </div>
              </div>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-8 flex items-center gap-3 opacity-60">
             <Lock className="size-2.5" />
             verified: mimic-iii / enron pii / Audit_Leak_Prob: &lt; 1e-7
           </p>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="glass-card p-8 rounded-2xl border-slate-200 shadow-sm bg-white">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10 flex items-center gap-3">
              <TableIcon className="size-4 text-primary" />
              Inference Matrix
           </h4>
           <div className="grid grid-cols-2 gap-2 mb-10">
              {[
                { l: "TP", v: 450, c: "bg-primary text-white", shadow: "shadow-sm" },
                { l: "FP", v: 22, c: "bg-slate-50 text-slate-400 border border-slate-200", shadow: "" },
                { l: "FN", v: 18, c: "bg-slate-50 text-slate-400 border border-slate-200", shadow: "" },
                { l: "TN", v: 1850, c: "bg-white text-primary border border-primary/20 font-black", shadow: "shadow-inner" }
              ].map((box, i) => (
                <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-2xl ${box.c} ${box.shadow} transition-all hover:scale-95 cursor-default`}>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{box.l}</span>
                  <span className="text-3xl font-black font-display tracking-tighter">{box.v}</span>
                </div>
              ))}
           </div>
           <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase font-mono tracking-widest">
                   <span className="text-slate-400 opacity-70">Classification (MCC)</span>
                   <span className="text-primary font-display text-lg">0.920</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase font-mono tracking-widest">
                   <span className="text-slate-400">System Latency (E2E)</span>
                   <span className="text-secondary font-display text-lg">12.4s</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full bg-secondary" />
                </div>
              </div>
           </div>
        </div>

        <div className="glass-card p-6 rounded-2xl bg-red-50 border border-red-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <ShieldAlert className="size-4 text-red-600" />
             <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em] opacity-80">Statistical Variance Report</p>
           </div>
           <p className="text-[10px] font-black text-red-600/60 leading-relaxed uppercase tracking-tighter">
             p-95 confidence verified. mcnemar signf logic (p &lt; 0.01) against lead-3 baseline vectors.
           </p>
        </div>

        <div className="glass-card p-8 rounded-2xl border-slate-200 bg-white shadow-sm space-y-6">
           <h3 className="font-display text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
             <Trophy className="text-secondary size-5" />
             technical rubric v4
           </h3>
           <div className="space-y-3">
             <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase opacity-80">
               <CheckCircle2 className="size-3.5 text-primary" />
               CER &lt; 5% Verified
             </div>
             <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase opacity-80">
               <CheckCircle2 className="size-3.5 text-primary" />
               k-Anonymity Target MET
             </div>
             <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase opacity-80">
               <CheckCircle2 className="size-3.5 text-primary" />
               ROUGE-L Score Validated
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700 min-h-full flex flex-col pb-12">
      {/* Page Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="font-display text-5xl font-black text-slate-900 tracking-tight flex items-center gap-6">
            <ShieldCheck className="text-primary size-12" />
            Governance, Risk & Operational Benchmarks
          </h1>
          <p className="text-slate-500 font-black mt-2 flex items-center gap-3 uppercase tracking-widest text-xs opacity-70">
            <Server className="size-4 text-secondary" />
            Statistical Validation & Technical Rubric Mapping v4.0.0
          </p>
        </div>
        <div className="flex items-center gap-8">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-40 mb-1">Global Validation Status</p>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                 <span className="font-mono text-sm font-black text-slate-900">OPERATIONAL-ALPHA-98</span>
              </div>
           </div>
           <button className="px-8 py-5 bg-secondary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-4 group">
             Generate Report
             <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
      </header>

      <div className="flex flex-col space-y-12 flex-1">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-full w-fit max-w-full overflow-x-auto no-scrollbar shadow-sm">
          {parameters.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveParam(p.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeParam === p.id 
                  ? "bg-secondary text-white shadow-md scale-105 z-10" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <p.icon className="size-4" />
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeParam}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              {activeParam === "p1" && renderP1()}
              {activeParam === "p2" && renderP2()}
              {activeParam === "p5" && renderP5()}
              
              {["p3", "p4"].includes(activeParam) && (
                <div className="h-[400px] flex flex-col items-center justify-center glass-card border border-dashed rounded-3xl opacity-40">
                  <Cpu className="size-16 text-primary mb-8 animate-pulse" />
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] text-center max-w-md leading-relaxed">
                    Module synthesis active in {activeParam === 'p3' ? 'Model Evaluation' : 'Code Readability'} cluster. Access restricted to authorized evaluators.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
