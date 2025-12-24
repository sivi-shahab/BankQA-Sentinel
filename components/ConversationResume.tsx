
import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface ConversationResumeProps {
  summary: string;
}

export const ConversationResume: React.FC<ConversationResumeProps> = ({ summary }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-slide-up">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-indigo-600" /> Conversation Resume
        </h3>
        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
      </div>
      <div className="p-4">
        <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100/50">
          <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
            "{summary}"
          </p>
        </div>
      </div>
    </div>
  );
};
