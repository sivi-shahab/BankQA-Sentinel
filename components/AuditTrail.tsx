
import React from 'react';
import { ShieldCheck, Clock, User, Globe, Activity, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditTrailProps {
  logs: AuditLog[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">System Audit Trail</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Compliance Logs (BI/OJK Standards)</p>
          </div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-4">Timestamp</th>
              <th className="px-8 py-4">Security Principal</th>
              <th className="px-8 py-4">Action Event</th>
              <th className="px-8 py-4">Resource</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Source IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Clock className="w-3 h-3" />
                    {log.timestamp.toLocaleTimeString()}
                    <span className="opacity-40">{log.timestamp.toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{log.user}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-black text-slate-800 tracking-tight uppercase">{log.action}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs text-slate-400 font-bold truncate block max-w-[150px]">{log.resource}</span>
                </td>
                <td className="px-8 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tight ${
                    log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    log.status === 'WARNING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-red-50 text-red-600 border-red-100 animate-pulse'
                  }`}>
                    {log.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {log.status}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <Globe className="w-3 h-3" />
                    {log.ipAddress}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
