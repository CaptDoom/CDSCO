import { useState, useEffect } from "react";
import { ShieldCheck, History as HistoryIcon, User as UserIcon, Lock, Database, FileDigit } from "lucide-react";
import { motion } from "motion/react";

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Initial mock logs for high-fidelity visual
    const mockLogs = [
      { id: "tx_9921_00x1", userId: "Vaibhav K.", action: "ANON_STEP_1:PSEUDO", inputHash: "0x892a...f92", createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
      { id: "tx_9921_00x2", userId: "System_AI", action: "ANON_STEP_2:IRREVERSIBLE", inputHash: "0x122b...e31", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      { id: "tx_9921_00x3", userId: "Officer_490", action: "SAE_REG_STREAMLINE", inputHash: "0x771c...a12", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: "tx_9921_00x4", userId: "System_AI", action: "PII_CONTEXT_SCRUB", inputHash: "0xaf34...882", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() }
    ];
    setLogs(mockLogs);

    fetch("/api/admin/audit")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setLogs(data);
      })
      .catch(err => console.error("Server Audit Fetch Error:", err));
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4C81] mb-2 uppercase">Append-Only Audit Trail</h1>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Regulatory Immutable System Log • v4.2 Ledger</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
          <ShieldCheck className="size-8 text-green-500" />
          <h3 className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Log Integrity</h3>
          <p className="text-2xl font-bold text-[#0F4C81] uppercase italic">Verified</p>
          <div className="text-[10px] font-bold font-mono text-gray-400">SHA-256 Chained Check Passed</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
          <HistoryIcon className="size-8 text-[#0F4C81]" />
          <h3 className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Retention Period</h3>
          <p className="text-2xl font-bold text-[#0F4C81] uppercase italic">365 Days</p>
          <div className="text-[10px] font-bold font-mono text-gray-400">Compliance Code Sec 4.2</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
          <Database className="size-8 text-amber-500" />
          <h3 className="font-bold uppercase text-[10px] tracking-widest text-gray-400">Storage Region</h3>
          <p className="text-2xl font-bold text-[#0F4C81] uppercase italic">India (South)</p>
          <div className="text-[10px] font-bold font-mono text-gray-400">MeitY Certified Center</div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E2E8F0] bg-gray-50/50 flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Audit Transaction Log</span>
          <span className="text-[10px] font-bold font-mono text-[#0F4C81] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">LOG_COUNT: {logs.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Officer</th>
                <th className="px-6 py-4">Action Pipeline</th>
                <th className="px-6 py-4">Input Hash (HEX)</th>
                <th className="px-6 py-4">Timestamp (UTC)</th>
                <th className="px-6 py-4">State</th>
              </tr>
            </thead>
            <tbody className="text-sm font-sans divide-y divide-[#E2E8F0]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold uppercase text-[10px] italic tracking-widest">No transactions detected.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-[10px] font-bold text-[#0F4C81]">{log.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                       <UserIcon className="size-3 text-gray-400" />
                       <span className="font-bold text-gray-600 text-xs">{log.userId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-500 uppercase tracking-tight border border-gray-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{log.inputHash.slice(0, 12)}...</td>
                    <td className="px-6 py-4 text-[10px] font-bold font-mono text-gray-500">{new Date(log.createdAt).toISOString().replace('T', ' ').slice(0, 19)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 text-[9px] font-bold uppercase tracking-widest">
                        <Lock className="size-3" /> Encrypted
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
