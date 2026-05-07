import { useState, useEffect } from "react";
import { 
  ShieldAlert,
  ShieldCheck, 
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
  Server
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Anonymizer from "./pages/Anonymizer";
import SAEBoard from "./pages/SAEBoard";
import Summarizer from "./pages/Summarizer";
import Comparison from "./pages/Comparison";
import Inspection from "./pages/Inspection";
import AuditLog from "./pages/AuditLog";
import Benchmarks from "./pages/Benchmarks";
import { motion, AnimatePresence } from "motion/react";
import { realtimeService } from "./services/realtimeService";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    realtimeService.connect();
    const unsubscribeStatus = realtimeService.subscribeStatus(setSystemStatus);
    
    return () => {
      clearInterval(timer);
      unsubscribeStatus();
    };
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "anon", label: "Anonymisation", icon: EyeOff },
    { id: "sae", label: "SAE Case Board", icon: Activity },
    { id: "summarizer", label: "Summarisation", icon: FileText },
    { id: "compare", label: "Comparison Tool", icon: ArrowLeftRight },
    { id: "inspect", label: "Inspection Docs", icon: ClipboardCheck },
    { id: "benchmarks", label: "Technical Audit", icon: Zap },
    { id: "audit", label: "Blockchain Log", icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col shadow-sm z-30">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center shadow-lg">
              <ShieldAlert className="text-white size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#0F4C81] leading-none uppercase">RAHA</h1>
              <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mt-1">Regulatory Authority AI</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  activeTab === item.id 
                    ? "bg-[#0F4C81] text-white shadow-md shadow-blue-900/10" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <item.icon className={`size-4 transition-colors ${activeTab === item.id ? "text-white" : "group-hover:text-[#0F4C81]"}`} />
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div className="flex items-center gap-2 mb-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Active Node</span>
             </div>
             <p className="text-[10px] font-bold text-[#0F4C81] uppercase">{systemStatus?.node || "SENTINEL-01"}</p>
             <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Uptime: 14:02:44:11</p>
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-[#0F4C81] transition-colors">
              <Info className="size-4" />
              <span className="text-xs font-bold">Support</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-[#0F4C81] transition-colors">
              <FileText className="size-4" />
              <span className="text-xs font-bold">Documentation</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F8FAFC]">
        {/* Header */}
        <header className="h-16 border-b border-[#E2E8F0] flex items-center justify-between px-8 bg-white z-20">
          <div className="flex-1 max-w-xl flex items-center gap-8">
             <div className="flex items-center gap-2 text-gray-400 border-r border-gray-100 pr-8">
               <Clock className="size-3.5" />
               <span className="text-[10px] font-bold font-mono tracking-tighter">
                 {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
               </span>
             </div>
             <div className="flex-1">
               {activeTab === 'dashboard' ? (
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-focus-within:text-[#0F4C81] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search applications, SAE IDs, or regulatory documents..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] transition-all"
                    />
                  </div>
               ) : (
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    RAHA Platform <span className="mx-2 text-gray-200">|</span> <span className="text-gray-600">{activeTab.replace('-', ' ')}</span>
                  </div>
               )}
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('audit')}
                className={`p-2 transition-colors ${activeTab === 'audit' ? 'text-[#0F4C81] bg-blue-50 rounded-lg' : 'text-gray-400 hover:text-[#0F4C81]'}`}
                title="System Audit Trial"
              >
                <HistoryIcon className="size-5" />
              </button>
              
              <div className="relative group/notif">
                <button className="p-2 text-gray-400 hover:text-[#0F4C81] transition-colors relative">
                  <Bell className="size-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E2E8F0] shadow-xl rounded-xl invisible group-hover:notif:visible opacity-0 group-hover/notif:opacity-100 transition-all z-50 p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Notifications</p>
                  <div className="space-y-3">
                    <div className="p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors cursor-pointer">
                      <p className="text-xs font-bold text-gray-700">New SAE Critical Report</p>
                      <p className="text-[10px] text-gray-400 mt-1">Batch #442 ingestion complete. Risk: HIGH.</p>
                    </div>
                    <div className="p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors cursor-pointer">
                      <p className="text-xs font-bold text-gray-700">Audit Node Sync</p>
                      <p className="text-[10px] text-gray-400 mt-1">Blockchain ledger verified for last 100 tx.</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 text-[10px] font-bold text-[#0F4C81] uppercase text-center hover:underline">View all alerts</button>
                </div>
              </div>

              <div className="relative group/user">
                <button className="p-2 text-gray-400 hover:text-[#0F4C81] transition-colors">
                  <UserIcon className="size-5" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E2E8F0] shadow-xl rounded-xl invisible group-hover/user:visible opacity-0 group-hover/user:opacity-100 transition-all z-50 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-8 bg-gray-100 rounded-lg flex items-center justify-center text-[#0F4C81] font-bold text-xs">VK</div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">Vaibhav K.</p>
                      <p className="text-[9px] text-gray-400">Senior Evaluator</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <button className="w-full text-left px-2 py-1.5 text-xs font-bold text-gray-500 hover:text-[#0F4C81] hover:bg-gray-50 rounded-md transition-colors">Profile Settings</button>
                    <button className="w-full text-left px-2 py-1.5 text-xs font-bold text-gray-500 hover:text-[#0F4C81] hover:bg-gray-50 rounded-md transition-colors">Security Logs</button>
                    <div className="border-t border-gray-100 my-2" />
                    <button className="w-full text-left px-2 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors">Sign Out</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "anon" && <Anonymizer />}
              {activeTab === "sae" && <SAEBoard />}
              {activeTab === "summarizer" && <Summarizer />}
              {activeTab === "compare" && <Comparison />}
              {activeTab === "inspect" && <Inspection />}
              {activeTab === "benchmarks" && <Benchmarks />}
              {activeTab === "audit" && <AuditLog />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>

  );
}
