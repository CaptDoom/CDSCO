import { useState, useEffect } from "react";
import { 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  CloudLightning, 
  Zap,
  Target,
  ArrowRight,
  LayoutDashboard,
  User as UserIcon,
  RefreshCw,
  ClipboardCheck,
  History as HistoryIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { realtimeService } from "../services/realtimeService";

export default function Dashboard() {
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [queue, setQueue] = useState([
    { id: "#SAE-2023-9021", entity: "Biotech Pharma Ltd.", type: "SAE Phase III", severity: "Death", sColor: "red" },
    { id: "#NDA-441-X001", entity: "Apex Health Sol.", type: "NDA Filing", severity: "Hospitalization", sColor: "blue" },
    { id: "#SAE-2023-8842", entity: "Generic Corp India", type: "Pharmacovigilance", severity: "Disability", sColor: "amber" },
    { id: "#VAR-229-771", entity: "Zenith Pharmaceuticals", type: "Post-Market Var.", severity: "Other", sColor: "gray" },
  ]);

  useEffect(() => {
    realtimeService.connect();
    
    const unsubscribe = realtimeService.subscribeEvents((event) => {
      setLiveEvents(prev => [event, ...prev].slice(0, 5));
    });

    const interval = setInterval(() => {
      setQueue(prev => {
        const next = [...prev];
        if (Math.random() > 0.8) {
           next.unshift({
             id: `#SGM-${Math.floor(Math.random() * 9000) + 1000}`,
             entity: "Incoming Application...",
             type: "SUGAM Sync",
             severity: "New",
             sColor: "blue"
           });
           if (next.length > 6) next.pop();
        }
        return next;
      });
    }, 8000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const stats = [
    { 
      label: "REGULATORY STREAMLINING", 
      value: "84%", 
      change: "Ready for Fast-Track", 
      icon: TrendingUp, 
      color: "blue" 
    },
    { 
      label: "TOTAL SCAN VOLUME", 
      value: "14,842", 
      change: "+14.2% this month", 
      icon: FileText, 
      color: "green" 
    },
    { 
      label: "ANONYMISATION CONFIDENCE", 
      value: "99.2%", 
      change: "Verified (DPDP 2023)", 
      icon: ShieldCheck, 
      color: "red" 
    },
    { 
      label: "CDSCO APPROVAL VELOCITY", 
      value: "1.4d", 
      change: "Avg. Review Time", 
      icon: Zap, 
      color: "indigo" 
    }
  ];

  const activities = [
    { 
      user: "System Logic", 
      action: "Completed Step-2 (Irreversible) for", 
      target: "Lilly Pharma SAE-002", 
      time: "4 mins ago", 
      location: "Encryption Node 4",
      type: "success"
    },
    { 
      user: "N. Sharma (SRO)", 
      action: "Verified integrity of", 
      target: "AstraZeneca NDA-49", 
      time: "12 mins ago", 
      location: "CDSCO Mumbai",
      type: "success"
    },
    { 
      user: "AI Engine", 
      action: "Detected PHI Leak in", 
      target: "Generic-Tab-X1", 
      time: "45 mins ago", 
      location: "Pre-Scrub Audit",
      type: "alert"
    },
    { 
      user: "Batch Manager", 
      action: "Ingested 2.4GB PHI-Sensitive Data", 
      target: "AIIMS PV Data", 
      time: "1 hour ago", 
      location: "Bulk Sync",
      type: "system"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-sm relative group overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-[#0F4C81]">{stat.value}</h3>
               </div>
               <div className="p-2 bg-gray-50 rounded-lg">
                 <stat.icon className="size-5 text-gray-400" />
               </div>
            </div>
            {stat.change && (
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold ${
                  stat.change.startsWith('+') ? 'text-green-500' : 
                  stat.change.includes('Verified') ? 'text-green-600' : 'text-[#0F4C81]'
                }`}>
                  {stat.change}
                </span>
              </div>
            )}
          </motion.div>
        ))}
        {/* Special AI Review Accuracy Card with Spark icon */}
        {/* This is handled by the loop above, but I'll make sure indigo is styled correctly */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Review Queue */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <ClipboardCheck className="size-4 text-[#0F4C81]" />
              Priority Review Queue
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Live WebSocket Connected</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/30 text-[9px] font-medium text-gray-400 uppercase tracking-widest border-b border-gray-100 italic font-serif">
                  <th className="px-6 py-5">Application ID</th>
                  <th className="px-6 py-5">Entity Name</th>
                  <th className="px-6 py-5">Report Type</th>
                  <th className="px-6 py-5 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {queue.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-all duration-200 group cursor-pointer">
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-mono tracking-tighter text-[#0F4C81] bg-blue-50/50 px-2 py-1 rounded border border-blue-100/50">
                         {item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700 tracking-tight">{item.entity}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">{item.type}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm transition-transform group-hover:scale-105 inline-block ${
                        item.sColor === 'red' ? 'text-red-600 bg-red-100/20 border-red-200' :
                        item.sColor === 'blue' ? 'text-blue-600 bg-blue-100/20 border-blue-200' :
                        item.sColor === 'amber' ? 'text-amber-600 bg-amber-100/20 border-amber-200' :
                        'text-gray-400 bg-gray-100/50 border-gray-200'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#E2E8F0] text-center">
             <button className="text-[10px] font-bold text-[#0F4C81] uppercase tracking-widest hover:underline">
               View All Active Queues (126 total)
             </button>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <HistoryIcon className="size-4 text-[#0F4C81]" />
              Live Audit Stream
            </h3>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[8px] font-bold text-green-600 uppercase tracking-tighter">Live</span>
            </span>
          </div>
          <div className="flex-1 p-6 space-y-6">
            <AnimatePresence initial={false}>
              {liveEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <RefreshCw className="size-6 text-gray-200 animate-spin mb-2" />
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Waiting for audit node synchronization...</p>
                </div>
              )}
              {liveEvents.map((act, i) => (
                <motion.div 
                  key={act.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex gap-4 group"
                >
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center relative z-10 bg-white ${
                      act.severity === 'CRITICAL' ? 'border-red-200 text-red-500' :
                      act.severity === 'SUCCESS' ? 'border-green-200 text-green-500' :
                      act.severity === 'WARNING' ? 'border-amber-200 text-amber-500' :
                      'border-gray-200 text-[#0F4C81]'
                    }`}>
                      {act.severity === 'CRITICAL' ? <AlertTriangle className="size-3.5" /> : 
                       act.severity === 'SUCCESS' ? <CheckCircle2 className="size-3.5" /> :
                       act.severity === 'WARNING' ? <AlertCircle className="size-3.5" /> :
                       <Zap className="size-3.5" />}
                    </div>
                    {i !== liveEvents.length - 1 && (
                      <div className="absolute top-8 left-4 w-px h-10 bg-gray-100" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">System Node</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-tight font-medium">
                      {act.message}
                    </p>
                    <p className="text-[9px] text-[#0F4C81] mt-1 uppercase font-bold tracking-tight opacity-60">
                      Audit Chain Verified
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="p-4 border-t border-[#E2E8F0]">
             <button className="w-full py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest">
               Access Audit Repository
             </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Risk and Scans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {/* Risk Factor Analysis */}
         <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Risk Factor Analysis</h3>
            <div className="space-y-6">
               {[
                  { label: "Unexpected Clinical Outcome", value: 0.42, color: "#0F4C81" },
                  { label: "Historical Lab Compliance", value: -0.18, color: "#10B981" },
                  { label: "Dosage Margin Error", value: 0.25, color: "#0F4C81" }
               ].map((risk, i) => (
                  <div key={i}>
                     <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-gray-600">{risk.label}</span>
                        <span className={risk.value > 0 ? "text-blue-600" : "text-green-600"}>
                           {risk.value > 0 ? `+${risk.value}` : risk.value}
                        </span>
                     </div>
                     <div className="h-4 bg-gray-50 rounded-full overflow-hidden flex items-center px-1">
                        <div 
                           className="h-2 rounded-full transition-all duration-1000"
                           style={{ 
                              width: `${Math.abs(risk.value) * 100}%`,
                              backgroundColor: risk.color,
                              marginLeft: risk.value < 0 ? 'auto' : '0',
                              marginRight: risk.value < 0 ? '0' : 'auto'
                           }}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Automated Compliance Scan */}
         <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col">
            <div className="mb-auto">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">Automated Compliance Scan</h3>
               <p className="text-[13px] text-gray-600 leading-relaxed mb-10 font-medium">
                  Neural engines detected <span className="text-[#0F4C81] font-black underline decoration-[#0F4C81]/30">3 missing metadata tags</span> in verified container index <span className="font-bold text-gray-900">#NDA-441-X001</span>. 
               </p>
            </div>
            <button className="w-full py-4 bg-[#0F4C81] text-white rounded-xl text-[10px] font-bold hover:bg-[#1a5f9b] transition-all uppercase tracking-widest shadow-lg shadow-blue-900/20 ring-1 ring-white/10 active:scale-95">
               Engage Policy Repair
            </button>
         </div>

         {/* Infrastructure Health & Footer Status */}
         <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex-1">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Infrastructure Health</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-600">Delhi Central Server</span>
                     <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold border border-green-100 rounded uppercase">Optimal</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-600">AI Inference Latency</span>
                     <span className="text-xs font-bold text-[#0F4C81] font-mono">142ms</span>
                  </div>
               </div>
               <div className="mt-8 flex justify-center">
                  <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center shadow-lg text-white">
                    <CloudLightning className="size-6" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Footer Info */}
      <footer className="pt-8 border-t border-[#E2E8F0] flex flex-wrap justify-between items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">All Systems Operational • RAHA v2.4.1</p>
         </div>
         <div className="flex gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <button className="hover:text-[#0F4C81]">Privacy Policy</button>
            <button className="hover:text-[#0F4C81]">User Manual</button>
            <button className="hover:text-[#0F4C81]">Institutional Ethics Board</button>
         </div>
      </footer>
    </div>
  );
}
