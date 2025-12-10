import React from 'react';
import { 
  CheckCircle, AlertTriangle, XCircle, 
  TrendingUp, TrendingDown, Minus,
  BookOpen, Activity, FileText, Zap, User, Headset
} from 'lucide-react';
import { CallAnalysis } from '../types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface DashboardProps {
  data: CallAnalysis;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Emerald 500
    if (score >= 75) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  const chartData = [
    { name: 'Score', value: data.qualityScore, fill: getScoreColor(data.qualityScore) }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* LEFT COLUMN: Overview & Score */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quality Score Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden">
                <div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Quality Score</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">{data.qualityScore}</span>
                        <span className="text-sm text-slate-400">/ 100</span>
                    </div>
                    <p className="text-sm mt-1 text-slate-600">
                        {data.qualityScore >= 90 ? 'Excellent' : data.qualityScore >= 75 ? 'Good' : 'Needs Improvement'}
                    </p>
                </div>
                <div className="h-24 w-24">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={10} data={chartData} startAngle={90} endAngle={-270}>
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sentiment Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                 <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Customer Sentiment</h3>
                 <div className="mt-4 flex items-center gap-3">
                    {data.sentiment === 'POSITIVE' && <TrendingUp className="w-8 h-8 text-emerald-500" />}
                    {data.sentiment === 'NEUTRAL' && <Minus className="w-8 h-8 text-slate-400" />}
                    {data.sentiment === 'NEGATIVE' && <TrendingDown className="w-8 h-8 text-red-500" />}
                    <span className={`text-2xl font-bold ${
                        data.sentiment === 'POSITIVE' ? 'text-emerald-600' : 
                        data.sentiment === 'NEGATIVE' ? 'text-red-600' : 'text-slate-600'
                    }`}>
                        {data.sentiment}
                    </span>
                 </div>
                 <p className="text-sm text-slate-500 mt-2">Based on tone and keyword analysis</p>
            </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">Executive Summary</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                {data.summary}
            </p>
        </div>

        {/* Compliance Checklist */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Compliance & Protocol</h3>
            </div>
            <div className="space-y-4">
                {data.complianceChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="mt-1 flex-shrink-0">
                            {item.status === 'PASS' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                            {item.status === 'WARNING' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                            {item.status === 'FAIL' && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-slate-800">{item.category}</h4>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    item.status === 'PASS' ? 'bg-emerald-100 text-emerald-700' :
                                    item.status === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{item.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Diarized Transcript */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
             <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <FileText className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-800">Transcript (Diarized)</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {data.transcriptSegments.map((segment, idx) => {
                    const isAgent = segment.speaker.toLowerCase().includes('agent');
                    return (
                        <div key={idx} className={`flex gap-3 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                isAgent ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                                {isAgent ? <Headset className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={`max-w-[80%] rounded-lg p-3 text-sm border ${
                                isAgent 
                                ? 'bg-blue-50 border-blue-100 text-slate-700 rounded-tl-none' 
                                : 'bg-white border-slate-200 text-slate-700 rounded-tr-none shadow-sm'
                            }`}>
                                <div className={`text-xs font-bold mb-1 uppercase tracking-wider ${
                                    isAgent ? 'text-blue-600' : 'text-emerald-600'
                                }`}>
                                    {segment.speaker}
                                </div>
                                <p className="leading-relaxed">{segment.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Actions & Glossary */}
      <div className="space-y-6">
        
        {/* Next Best Action */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-300" />
                <h3 className="text-lg font-semibold">Next Best Actions</h3>
            </div>
            <ul className="space-y-3">
                {data.nextBestActions.map((action, idx) => (
                    <li key={idx} className="flex gap-3 text-sm bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                        <span className="font-bold text-yellow-300 text-lg">{idx + 1}</span>
                        <span className="leading-snug">{action}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Glossary / Context */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
            <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-slate-800">Glossary & Context</h3>
            </div>
            <div className="space-y-4">
                {data.glossaryUsed.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No specific banking terms detected.</p>
                ) : (
                    data.glossaryUsed.map((term, idx) => (
                        <div key={idx} className="border-l-2 border-teal-500 pl-3">
                            <h4 className="font-bold text-slate-800 text-sm">{term.term}</h4>
                            <p className="text-xs text-slate-500 mt-1">{term.definition}</p>
                            <div className="mt-2 bg-teal-50 p-2 rounded text-xs text-teal-800 italic">
                                "{term.contextInCall}"
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
