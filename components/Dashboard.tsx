
import React from 'react';
import { 
  CheckCircle, AlertTriangle, XCircle, 
  TrendingUp, TrendingDown, Minus,
  Activity, FileText, Zap, User, Headset, 
  ClipboardList, CreditCard, Clock, BarChart3, 
  Mic, Users, Sparkles, Calendar, Landmark, 
  Phone, Mail, Briefcase, MapPin, Hash, Heart,
  Timer, Award, ShieldAlert, ThumbsUp, ThumbsDown,
  ShieldCheck
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

  const crmFields = [
    { label: 'Full Name', value: data.extractedInfo.customerName, icon: User, color: 'text-indigo-600' },
    { label: 'Date of Birth', value: data.extractedInfo.dateOfBirth, icon: Calendar, color: 'text-rose-500' },
    { label: 'ID Number (NIK)', value: data.extractedInfo.identityNumber, icon: Hash, color: 'text-slate-600' },
    { label: "Mother's Maiden Name", value: data.extractedInfo.motherMaidenName, icon: Heart, color: 'text-pink-500' },
    { label: 'Target Account No.', value: data.extractedInfo.bankAccountNumber, icon: CreditCard, color: 'text-amber-600' },
    { label: 'Target Bank', value: data.extractedInfo.targetBankName, icon: Landmark, color: 'text-blue-600' },
    { label: 'Phone Number', value: data.extractedInfo.phoneNumber, icon: Phone, color: 'text-emerald-600' },
    { label: 'Email Address', value: data.extractedInfo.emailAddress, icon: Mail, color: 'text-cyan-600' },
    { label: 'Occupation', value: data.extractedInfo.occupation, icon: Briefcase, color: 'text-violet-600' },
    { label: 'Residential Address', value: data.extractedInfo.residentialAddress, icon: MapPin, color: 'text-orange-600' },
  ];

  const WPM_THRESHOLD = 160;
  const isTooFast = data.conversationStats.wordsPerMinute > WPM_THRESHOLD;

  const performanceMetrics = [
    { label: 'Empathy', score: data.agentPerformance.empathyScore, color: 'bg-pink-500' },
    { label: 'Clarity', score: data.agentPerformance.clarityScore, color: 'bg-blue-500' },
    { label: 'Persuasion', score: data.agentPerformance.persuasionScore, color: 'bg-indigo-500' },
    { label: 'Product Knowledge', score: data.agentPerformance.productKnowledgeScore, color: 'bg-emerald-500' },
    { label: 'Closing Skill', score: data.agentPerformance.closingSkillScore, color: 'bg-amber-500' },
  ];

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
        case 'STAR_PERFORMER': return 'bg-emerald-500 text-white shadow-emerald-200';
        case 'SOLID_PERFORMER': return 'bg-indigo-500 text-white shadow-indigo-200';
        case 'AVERAGE': return 'bg-amber-500 text-white shadow-amber-200';
        case 'NEEDS_COACHING': return 'bg-red-500 text-white shadow-red-200';
        default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      
      {/* 1. HERO SECTION: High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Quality Score - Large Hero Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex items-center justify-between border border-slate-700">
           <div className="relative z-10">
              <h2 className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2">Overall Quality Score</h2>
              <div className="flex items-end gap-3">
                 <span className="text-6xl font-bold tracking-tighter">{data.qualityScore}</span>
                 <span className="text-xl text-slate-400 mb-2">/ 100</span>
              </div>
              <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                  data.qualityScore >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
                  data.qualityScore >= 75 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 
                  'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                  {data.qualityScore >= 90 ? 'EXCEPTIONAL' : data.qualityScore >= 75 ? 'SATISFACTORY' : 'ATTENTION NEEDED'}
              </div>
           </div>
           
           <div className="h-32 w-32 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={12} data={chartData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: 'rgba(255,255,255,0.1)' }} dataKey="value" cornerRadius={12} />
                </RadialBarChart>
                </ResponsiveContainer>
           </div>
           
           {/* Background Decor */}
           <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-16 h-16 text-slate-900" />
             </div>
             <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Customer Sentiment</h3>
             <div className="flex items-center gap-3">
                {data.sentiment === 'POSITIVE' && <TrendingUp className="w-10 h-10 text-emerald-500" />}
                {data.sentiment === 'NEUTRAL' && <Minus className="w-10 h-10 text-slate-400" />}
                {data.sentiment === 'NEGATIVE' && <TrendingDown className="w-10 h-10 text-red-500" />}
                <div>
                    <span className={`text-2xl font-bold block ${
                        data.sentiment === 'POSITIVE' ? 'text-emerald-700' : 
                        data.sentiment === 'NEGATIVE' ? 'text-red-700' : 'text-slate-700'
                    }`}>
                        {data.sentiment}
                    </span>
                    <span className="text-xs text-slate-400">Analysis based on tone & keywords</span>
                </div>
             </div>
        </div>

        {/* Performance Verdict */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Agent Verdict</h3>
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${getVerdictStyles(data.agentPerformance.verdict)} shadow-lg transition-transform group-hover:scale-110`}>
                    <Award className="w-6 h-6" />
                </div>
                <div>
                    <span className="text-sm font-black text-slate-800 tracking-tight block">
                        {data.agentPerformance.verdict.replace('_', ' ')}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Based on skills audit</p>
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. LEFT COLUMN: Analytics & Compliance */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* AGENT PERFORMANCE SCORECARD - NEW SECTION */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Agent Competency Profile</h3>
                            <p className="text-xs text-slate-500">Soft Skills & Sales Effectiveness</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Skill Bars */}
                    <div className="space-y-5">
                        {performanceMetrics.map((metric, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-500">
                                    <span>{metric.label}</span>
                                    <span className="text-slate-800 font-mono">{metric.score}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${metric.color} transition-all duration-1000 ease-out shadow-sm`}
                                        style={{ width: `${metric.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="space-y-6">
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <ThumbsUp className="w-12 h-12 text-emerald-900" />
                            </div>
                            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <TrendingUp className="w-3 h-3" /> Key Strengths
                            </h4>
                            <ul className="space-y-2">
                                {data.agentPerformance.strengths.map((str, i) => (
                                    <li key={i} className="text-xs text-emerald-800 font-medium flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1 flex-shrink-0"></div>
                                        {str}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <ThumbsDown className="w-12 h-12 text-rose-900" />
                            </div>
                            <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <ShieldAlert className="w-3 h-3" /> Focus Areas
                            </h4>
                            <ul className="space-y-2">
                                {data.agentPerformance.weaknesses.map((weak, i) => (
                                    <li key={i} className="text-xs text-rose-800 font-medium flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1 flex-shrink-0"></div>
                                        {weak}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversation Metrics & Pace */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Conversation Metrics</h3>
                            <p className="text-xs text-slate-500">Share of Voice & Speech Dynamics</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                          data.conversationStats.effectivenessRating === 'OPTIMAL' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                          {data.conversationStats.effectivenessRating.replace('_', ' ')}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest flex items-center gap-1.5 ${
                          isTooFast ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                          {isTooFast && <AlertTriangle className="w-3 h-3" />}
                          {isTooFast ? 'Speaking Too Fast' : 'Normal Pace'}
                      </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-blue-600 flex items-center gap-1"><Headset className="w-4 h-4" /> Agent: {Math.round(data.conversationStats.agentTalkTimePct)}%</span>
                        <span className="text-emerald-600 flex items-center gap-1">Customer: {Math.round(data.conversationStats.customerTalkTimePct)}% <User className="w-4 h-4" /></span>
                    </div>
                    <div className="h-4 w-full bg-emerald-100 rounded-full overflow-hidden flex shadow-inner">
                        <div 
                            className="h-full bg-blue-500 shadow-md relative group transition-all duration-1000 ease-out"
                            style={{ width: `${data.conversationStats.agentTalkTimePct}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${isTooFast ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            <Timer className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Words Per Minute</span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-black ${isTooFast ? 'text-red-600' : 'text-slate-800'}`}>
                                    {data.conversationStats.wordsPerMinute}
                                </span>
                                <span className="text-xs font-bold text-slate-400">WPM</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Interruptions</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-800">
                                    {data.conversationStats.interruptionCount}
                                </span>
                                <span className="text-xs font-bold text-slate-400">Times</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-3">
                    <BarChart3 className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700">Analytics Insight</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mt-1">
                            {data.conversationStats.feedback}
                            {isTooFast && (
                                <span className="block mt-2 text-red-600 font-bold text-xs flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5" /> 
                                    Coaching Tip: The agent's speech rate exceeds {WPM_THRESHOLD} WPM. Encourage a more deliberate pace for better customer comprehension.
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transcript */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[600px]">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-600" />
                        <h3 className="text-lg font-bold text-slate-800">Transcript</h3>
                    </div>
                    <span className="text-xs text-slate-400">Diarized & Verified</span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {data.transcriptSegments.map((segment, idx) => {
                        const isAgent = segment.speaker.toLowerCase().includes('agent');
                        return (
                            <div key={idx} className={`flex gap-4 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                    isAgent ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    {isAgent ? <Headset className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={`max-w-[75%] rounded-2xl p-4 text-sm shadow-sm ${
                                    isAgent 
                                    ? 'bg-indigo-50/50 border border-indigo-100 text-slate-700 rounded-tl-none' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tr-none'
                                }`}>
                                    <div className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${
                                        isAgent ? 'text-indigo-600' : 'text-emerald-600'
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

        {/* 3. RIGHT COLUMN: CRM Data & Coaching */}
        <div className="space-y-6">
            
            {/* Automated CRM Entry */}
            <div className="bg-white rounded-2xl p-0 shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-white font-bold">Auto-Captured Data</h3>
                    </div>
                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase font-black">AI Verified</span>
                </div>
                <div className="p-6 space-y-4">
                    {/* Product Highlight */}
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Product Offering</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Zap className="w-4 h-4 text-indigo-600" />
                            <span className="text-lg font-black text-indigo-900 tracking-tight">{data.extractedInfo?.productName || 'N/A'}</span>
                        </div>
                        <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                             <TrendingUp className="w-3 h-3" /> Potential: {data.extractedInfo?.contributionAmount || 'N/A'}
                        </div>
                    </div>

                    {/* Detailed Fields - 1 Data 1 Field */}
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        {crmFields.map((field, idx) => (
                            <div key={idx} className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className={`mt-1 p-1.5 rounded-lg bg-white border border-slate-100 shadow-sm ${field.color}`}>
                                    <field.icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 group-hover:text-indigo-500 transition-colors">
                                        {field.label}
                                    </label>
                                    <div className={`text-sm font-bold tracking-tight ${field.value === 'Tidak disebutkan' ? 'text-slate-300 italic font-normal' : 'text-slate-800'}`}>
                                        {field.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <button className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-2 w-full uppercase tracking-widest">
                        Commit to Enterprise CRM <Users className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Compliance Checklist - Moved here to keep columns balanced */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Compliance Audit</h3>
                </div>
                <div className="space-y-3">
                    {data.complianceChecklist.map((item, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                            item.status === 'PASS' ? 'bg-white border-slate-200 hover:border-emerald-200' : 
                            item.status === 'WARNING' ? 'bg-amber-50/30 border-amber-100' : 'bg-red-50/30 border-red-100'
                        }`}>
                            <div className="mt-0.5">
                                {item.status === 'PASS' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                {item.status === 'WARNING' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                {item.status === 'FAIL' && <XCircle className="w-5 h-5 text-red-500" />}
                            </div>
                            <div>
                                <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.category}</h5>
                                <p className="text-[11px] text-slate-500 mt-0.5">{item.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Best Actions (Coaching) */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <h3 className="text-lg font-bold">Coaching Points</h3>
                    </div>
                    <ul className="space-y-4">
                        {data.nextBestActions.map((action, idx) => (
                            <li key={idx} className="flex gap-3 text-sm bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs text-yellow-300 border border-white/10">
                                    {idx + 1}
                                </span>
                                <span className="leading-snug opacity-90">{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
