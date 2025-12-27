
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus,
  Activity, FileText, Zap, User, Headset, 
  Clock, Mic, Sparkles, Award, ShieldAlert, 
  ExternalLink, CheckCircle2, Loader2, Database,
  UserCircle, Info, Hash, Heart, Phone, Mail, Calendar,
  Coins, HandCoins, CalendarDays, Percent, Wallet, Tag,
  AlertCircle, FileCheck, Lock as LockIcon, Timer, 
  MessageSquare, Users, BarChart3, Fingerprint,
  Users2
} from 'lucide-react';
import { CallAnalysis } from '../types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  data: CallAnalysis;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Emerald 500
    if (score >= 75) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  const talkTimeData = [
    { name: 'Agent', value: data.conversationStats.agentTalkTimePct, fill: '#6366f1' },
    { name: 'Customer', value: data.conversationStats.customerTalkTimePct, fill: '#10b981' }
  ];

  const crmFields = [
    { label: 'Full Name', value: data.extractedInfo.customerName, icon: User, color: 'text-indigo-600' },
    { label: 'Date of Birth', value: data.extractedInfo.dateOfBirth, icon: Calendar, color: 'text-rose-500' },
    { label: 'ID Number (NIK)', value: data.extractedInfo.identityNumber, icon: Hash, color: 'text-slate-600' },
    { label: "Mother's Maiden Name", value: data.extractedInfo.motherMaidenName, icon: Heart, color: 'text-pink-500' },
    { label: 'Phone Number', value: data.extractedInfo.phoneNumber, icon: Phone, color: 'text-emerald-600' },
    { label: 'Email Address', value: data.extractedInfo.emailAddress, icon: Mail, color: 'text-cyan-600' },
  ];

  const productFields = [
    { label: 'Loan Amount', value: data.extractedInfo.loanAmount, icon: Coins, color: 'text-indigo-500' },
    { label: 'Monthly Installment', value: data.extractedInfo.monthlyInstallment, icon: HandCoins, color: 'text-emerald-500' },
    { label: 'Tenor', value: data.extractedInfo.installmentDuration, icon: CalendarDays, color: 'text-blue-500' },
    { label: 'Interest Rate', value: data.extractedInfo.interestRate, icon: Percent, color: 'text-amber-500' },
    { label: 'Admin Fee', value: data.extractedInfo.adminFee, icon: Wallet, color: 'text-slate-500' },
    { label: 'Cross-sell', value: data.extractedInfo.crossSellProduct, icon: Tag, color: 'text-violet-500' },
  ];

  const performanceMetrics = [
    { label: 'Empathy', score: data.agentPerformance.empathyScore, color: 'bg-pink-500' },
    { label: 'Clarity', score: data.agentPerformance.clarityScore, color: 'bg-blue-500' },
    { label: 'Persuasion', score: data.agentPerformance.persuasionScore, color: 'bg-indigo-500' },
    { label: 'Product Knowledge', score: data.agentPerformance.productKnowledgeScore, color: 'bg-emerald-500' },
    { label: 'Closing Skill', score: data.agentPerformance.closingSkillScore, color: 'bg-amber-500' },
  ];

  const handleExportToCRM = () => {
    setIsExporting(true);
    setTimeout(() => {
        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
        case 'STAR_PERFORMER': return 'bg-emerald-500 text-white shadow-emerald-200';
        case 'SOLID_PERFORMER': return 'bg-indigo-500 text-white shadow-indigo-200';
        case 'AVERAGE': return 'bg-amber-500 text-white shadow-amber-200';
        case 'NEEDS_COACHING': return 'bg-red-500 text-white shadow-red-200';
        default: return 'bg-slate-500 text-white';
    }
  };

  const getGenderColor = (gender: string) => {
    if (gender === 'MALE') return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    if (gender === 'FEMALE') return 'text-rose-600 bg-rose-50 border-rose-100';
    return 'text-slate-400 bg-slate-50 border-slate-100';
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* 1. KEY QUALITY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex items-center justify-between border border-slate-800">
           <div className="relative z-10">
              <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">ProofScore Quality Audit</h2>
              <div className="flex items-end gap-3">
                 <span className="text-6xl font-black tracking-tighter">{data.qualityScore}</span>
                 <span className="text-xl text-slate-500 font-bold mb-2">/100</span>
              </div>
           </div>
           
           <div className="h-32 w-32 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={12} data={[{ value: data.qualityScore, fill: getScoreColor(data.qualityScore) }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={12} />
                </RadialBarChart>
                </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
             <div className="flex justify-between items-start mb-2">
                <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Sentiment Index</h3>
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 cursor-help" title={data.sentimentReasoning}>
                    <Info className="w-3.5 h-3.5" />
                </div>
             </div>
             <div className="flex items-center gap-3">
                {data.sentiment === 'POSITIVE' && <TrendingUp className="w-10 h-10 text-emerald-500" />}
                {data.sentiment === 'NEUTRAL' && <Minus className="w-10 h-10 text-slate-400" />}
                {data.sentiment === 'NEGATIVE' && <TrendingDown className="w-10 h-10 text-red-500" />}
                <div className="min-w-0">
                    <span className="text-2xl font-black block text-slate-800 leading-none">{data.sentiment}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 truncate">{data.sentimentReasoning}</p>
                </div>
             </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Agent Verdict</h3>
             <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${getVerdictStyles(data.agentPerformance.verdict)} shadow-lg`}>
                    <Award className="w-6 h-6" />
                </div>
                <div className="text-xs font-black text-slate-800 tracking-tight block uppercase">
                    {data.agentPerformance.verdict.replace('_', ' ')}
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">

            {/* VOICE IDENTITY & PROFILE (GENDER DETECTION) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-100 rounded-2xl">
                            <Fingerprint className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Voice Profile Analysis</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Biometric & Gender Identification</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${getGenderColor(data.genderProfile.agentGender)}`}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <Headset className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Audit Subject (Agent)</span>
                                <h4 className="text-sm font-black tracking-tight uppercase">{data.genderProfile.agentGender}</h4>
                            </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 opacity-20" />
                    </div>

                    <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${getGenderColor(data.genderProfile.customerGender)}`}>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Counterparty (Customer)</span>
                                <h4 className="text-sm font-black tracking-tight uppercase">{data.genderProfile.customerGender}</h4>
                            </div>
                        </div>
                        <Users2 className="w-5 h-5 opacity-20" />
                    </div>
                </div>
                
                {data.genderProfile.reasoning && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-medium italic">
                            <span className="font-black uppercase mr-2">Analysis:</span>
                            {data.genderProfile.reasoning}
                        </p>
                    </div>
                )}
            </div>
            
            {/* 2. CONVERSATIONAL DYNAMICS (TALK TIME / WPM) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Conversational Dynamics</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Flow & Interaction Analysis</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{data.conversationStats.effectivenessRating}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Talk Time Proportion */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="h-32 w-32 mb-4 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={talkTimeData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                                        {talkTimeData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Ratio</span>
                                <span className="text-xs font-black text-slate-800">{data.conversationStats.agentTalkTimePct}%</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> <span className="text-[9px] font-black text-slate-500 uppercase">Agent</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[9px] font-black text-slate-500 uppercase">Cust</span></div>
                        </div>
                    </div>

                    {/* Speed / WPM */}
                    <div className="flex flex-col items-center justify-center border-x border-slate-100 px-8">
                        <div className="p-4 bg-amber-50 rounded-full mb-3">
                            <Timer className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="text-center">
                            <span className="text-3xl font-black text-slate-800 block leading-none">{data.conversationStats.wordsPerMinute}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Words Per Minute</span>
                        </div>
                    </div>

                    {/* Interruptions */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-rose-50 rounded-full mb-3">
                            <MessageSquare className="w-8 h-8 text-rose-500" />
                        </div>
                        <div className="text-center">
                            <span className="text-3xl font-black text-slate-800 block leading-none">{data.conversationStats.interruptionCount}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interruptions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PERFORMANCE DEEP DIVE (STRENGTHS & WEAKNESSES) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Competency Audit</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Skill Vector Analysis</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        {performanceMetrics.map((m, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                    <span>{m.label}</span>
                                    <span className="text-slate-800">{m.score}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${m.color} transition-all duration-1000`} style={{ width: `${m.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {/* Strengths */}
                        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Key Strengths</h4>
                            </div>
                            <ul className="space-y-2">
                                {data.agentPerformance.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-2 text-xs font-bold text-slate-700">
                                        <span className="text-emerald-500">•</span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Weaknesses / Improvements */}
                        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldAlert className="w-4 h-4 text-rose-600" />
                                <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Areas for Improvement</h4>
                            </div>
                            <ul className="space-y-2">
                                {data.agentPerformance.weaknesses.map((w, i) => (
                                    <li key={i} className="flex gap-2 text-xs font-bold text-slate-700">
                                        <span className="text-rose-500">•</span> {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. TRANSCRIPT */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-[500px]">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 px-2">
                    <FileText className="w-5 h-5 text-slate-400" /> Verified Transcript
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar px-2">
                    {data.transcriptSegments.map((segment, idx) => {
                        const isAgent = segment.speaker.toLowerCase().includes('agent');
                        return (
                            <div key={idx} className={`flex gap-4 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${isAgent ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-emerald-600'}`}>
                                    {isAgent ? <Headset className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl p-4 text-sm border shadow-sm ${isAgent ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-200'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{segment.speaker}</span>
                                        <span className="text-[9px] font-black opacity-30">{segment.timestamp}</span>
                                    </div>
                                    <p className="font-bold text-slate-700 leading-relaxed">{segment.text}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* 5. SIDEBAR: CRM & PRODUCT DETAILS */}
        <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-0 shadow-lg border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-slate-900 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-white font-black text-xs uppercase tracking-wider">Enterprise Sync</h3>
                    </div>
                    {data.extractedInfo.customerAgreed ? (
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full">
                            <FileCheck className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">SUCCESS</span>
                         </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-full">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">REJECTED</span>
                        </div>
                    )}
                </div>
                
                <div className="p-6 space-y-6 bg-slate-50/50 flex-1">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                        <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Primary Product</label>
                        <div className="flex items-center gap-3 font-black text-slate-900 text-lg">
                            <Tag className="w-5 h-5 text-indigo-600" />
                            {data.extractedInfo?.productName || 'N/A'}
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Customer Profile</label>
                        {crmFields.map((field, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`p-2 rounded-xl bg-slate-50 ${field.color}`}>
                                        <field.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <label className="text-[8px] font-black text-slate-400 uppercase mb-0.5">{field.label}</label>
                                        <div className="text-[11px] font-black text-slate-800 truncate">{field.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                        <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-4">Financial Specifics</label>
                        {data.extractedInfo.customerAgreed ? (
                            <div className="grid grid-cols-2 gap-3">
                                {productFields.map((field, idx) => (
                                    <div key={idx} className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <field.icon className={`w-3.5 h-3.5 ${field.color}`} />
                                            <label className="text-[8px] font-black text-slate-400 uppercase">{field.label}</label>
                                        </div>
                                        <div className="text-[11px] font-black text-slate-800 truncate">
                                            {field.value || 'N/A'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 bg-slate-100 rounded-3xl border border-dashed border-slate-300 text-center">
                                <LockIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-tight">Sync Locked.<br/>No Customer Agreement.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-white p-6 border-t border-slate-100">
                    <button 
                        onClick={handleExportToCRM}
                        disabled={isExporting}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${
                            exportSuccess 
                            ? 'bg-emerald-500 text-white shadow-emerald-200' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-100'
                        }`}
                    >
                        {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : exportSuccess ? <CheckCircle2 className="w-5 h-5" /> : <><ExternalLink className="w-5 h-5" /> COMMIT TO CRM</>}
                    </button>
                    <p className="text-[8px] text-center text-slate-300 mt-4 font-black tracking-widest uppercase">Secured by ProofPoint.AI</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
