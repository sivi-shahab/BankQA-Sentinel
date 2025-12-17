
import React from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ComplianceItem } from '../types';

interface ComplianceAuditProps {
  checklist: ComplianceItem[];
}

export const ComplianceAudit: React.FC<ComplianceAuditProps> = ({ checklist }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-slide-up">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Compliance Audit
        </h3>
        <span className="text-[10px] font-bold text-slate-400">PASSED {checklist.filter(i => i.status === 'PASS').length}/{checklist.length}</span>
      </div>
      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {checklist.map((item, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
              item.status === 'PASS' ? 'bg-white border-slate-100 hover:border-emerald-200' : 
              item.status === 'WARNING' ? 'bg-amber-50/50 border-amber-100' : 'bg-red-50/50 border-red-100'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {item.status === 'PASS' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              {item.status === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
              {item.status === 'FAIL' && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
            <div>
              <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                {item.category}
              </h5>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {item.details}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 p-3 border-t border-slate-200">
          <button className="w-full text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">
              Download Compliance Report
          </button>
      </div>
    </div>
  );
};
