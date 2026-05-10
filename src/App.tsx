import React, { useState, useEffect, lazy, Suspense } from "react";
import { 
  Shield,
  FileText, 
  Search, 
  Settings, 
  LayoutDashboard, 
  Activity, 
  ClipboardCheck, 
  EyeOff,
  Bell,
  Plus,
  History as HistoryIcon,
  User as UserIcon,
  ChevronDown,
  Info,
  ArrowLeftRight,
  Zap,
  BrainCircuit,
  Clock,
  Server,
  HelpCircle,
  LogOut,
  Users,
  CheckCircle,
  BarChart,
  Brain,
  UserCheck,
  Globe
} from "lucide-react";

// Lazy-loaded page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Anonymizer = lazy(() => import("./pages/Anonymizer"));
const SAEBoard = lazy(() => import("./pages/SAEBoard"));
const Summarizer = lazy(() => import("./pages/Summarizer"));
const Comparison = lazy(() => import("./pages/Comparison"));
const Inspection = lazy(() => import("./pages/Inspection"));
const Benchmarks = lazy(() => import("./pages/Benchmarks"));

import { motion, AnimatePresence } from "motion/react";
import { realtimeService } from "./services/realtimeService";

import { TopNavbar } from "./components/layout/TopNavbar";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    realtimeService.connect();
    const unsubscribeStatus = realtimeService.subscribeStatus(setSystemStatus);
    
    return () => {
      unsubscribeStatus();
    };
  }, []);

  const menuItems = [
    { id: "dashboard", label: "System Overview", icon: LayoutDashboard },
    { id: "anon", label: "PII/PHI Anonymisation", icon: EyeOff },
    { id: "summarizer", label: "Document Summarisation", icon: Zap },
    { id: "compare", label: "Completeness & Comparison", icon: ArrowLeftRight },
    { id: "sae", label: "Severity Classification", icon: Shield },
    { id: "inspect", label: "Inspection Report Gen", icon: ClipboardCheck },
    { id: "benchmarks", label: "Technical Robustness", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 flex flex-col pt-20 pb-6 bg-white border-r border-slate-200 z-40 transition-all duration-300">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-4 p-3 bg-slate-900 rounded-xl border border-white/10 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20 shadow-sm relative z-10">
              <Shield className="text-primary size-5 fill-primary/20" />
            </div>
            <div className="relative z-10">
              <div className="font-display text-lg font-black text-white leading-tight tracking-tighter">IndiaAI-CDSCO</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary font-bold">SENTINEL NODE</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 group relative ${
                activeTab === item.id 
                  ? "bg-primary/10 text-primary border-l-4 border-primary" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`size-5 transition-all duration-300 ${activeTab === item.id ? "text-primary scale-110 opacity-100" : "opacity-70 group-hover:opacity-100 group-hover:text-primary group-hover:scale-110"}`} />
              <span className={`text-sm font-bold uppercase tracking-wide transition-all ${activeTab === item.id ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-6 pt-6 border-t border-slate-200 space-y-4">
          <button className="w-full bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md hover:shadow-lg hover:brightness-110">
            <Zap className="size-4" fill="currentColor" />
            <span className="uppercase text-xs tracking-widest font-black">Generate Report</span>
          </button>
          
          <div className="space-y-1">
            <button className="w-full flex items-center gap-4 px-4 py-2 text-slate-500 hover:text-slate-900 transition-all group">
              <Server className="size-4 group-hover:text-primary transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-widest">System Status</span>
            </button>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-4 px-4 py-2 text-slate-500 hover:text-red-600 transition-all group"
            >
              <LogOut className="size-4 group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden pl-72">
        <TopNavbar />

        {/* View Content Canvas */}
        <div className="flex-1 pt-16 overflow-y-auto custom-scrollbar bg-slate-50 relative">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-full p-10"
            >
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">Initializing Neural Node...</p>
                </div>
              }>
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "anon" && <Anonymizer />}
                {activeTab === "sae" && <SAEBoard />}
                {activeTab === "summarizer" && <Summarizer />}
                {activeTab === "compare" && <Comparison />}
                {activeTab === "inspect" && <Inspection />}
                {activeTab === "benchmarks" && <Benchmarks />}
                
                {!["dashboard", "anon", "sae", "summarizer", "compare", "inspect", "benchmarks"].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 border border-slate-200">
                      <Activity className="size-10 text-slate-400 opacity-20" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Module Under Calibration</h2>
                    <p className="text-slate-500 max-w-md mx-auto">This regulatory module is currently being synchronized. Expected availability in the next system update.</p>
                  </div>
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
