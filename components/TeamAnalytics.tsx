import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, TrendingUp, ShieldCheck, Target, 
  Award, ArrowUpRight, ArrowDownRight, 
  BarChart3, PieChart, Star, Search, Filter,
  MoreVertical, CheckCircle2, Loader2, X,
  Calendar, Phone, MessageSquare, Mic,
  Clock, Zap, ThumbsUp, AlertTriangle,
  ChevronRight, CalendarDays, User, Activity,
  Radio, PauseOctagon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, Legend, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { AgentSummary, TeamStats } from '../types';
import { generateAgentAvatar } from '../services/geminiService';

// Mock data for the demonstration
const MOCK_AGENTS: AgentSummary[] = [
  { id: '1', name: 'Sarah Jenkins', avatar: 'SJ', avgScore: 94, callsCount: 128, complianceRate: 99, topSkill: 'Empathy', status: 'Active' },
  { id: '2', name: 'Michael Chen', avatar: 'MC', avgScore: 88, callsCount: 142, complianceRate: 96, topSkill: 'Product Knowledge', status: 'Active' },
  { id: '3', name: 'Aria Stark', avatar: 'AS', avgScore: 82, callsCount: 96, complianceRate: 92, topSkill: 'Persuasion', status: 'Active' },
  { id: '4', name: 'David Miller', avatar: 'DM', avgScore: 74, callsCount: 110, complianceRate: 85, topSkill: 'Closing', status: 'In Training' },
  { id: '5', name: 'James Wilson', avatar: 'JW', avgScore: 68, callsCount: 54, complianceRate: 78, topSkill: 'Clarity', status: 'Probation' },
];

const TEAM_STATS: TeamStats = {
  avgQualityScore: 84,
  totalCalls: 1240,
  complianceTargetMet: 91,
  sentimentDistribution: [
    { name: 'Positive', value: 65 },
    { name: 'Neutral', value: 25 },
    { name: 'Negative', value: 10 },
  ],
  competencyAverages: [
    { subject: 'Empathy', A: 85, fullMark: 100 },
    { subject: 'Clarity', A: 78, fullMark: 100 },
    { subject: 'Persuasion', A: 92, fullMark: 100 },
    { subject: 'Knowledge', A: 88, fullMark: 100 },
    { subject: 'Closing', A: 70, fullMark: 100 },
  ],
};

const COLORS = ['#10b981', '#6366f1', '#f43f5e'];

// --- SUB-COMPONENTS ---

const AgentAvatar: React.FC<{ name: string; skill: string; fallback: string; size?: 'sm' | 'lg'; enableAi?: boolean }> = ({ name, skill, fallback, size = 'sm', enableAi = false }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (!enableAi) return;
    
    let mounted = true;
    const fetchAvatar = async () => {
      // Small random delay to stagger requests
      await new Promise(r => setTimeout(r, Math.random() * 1000));
      if (!mounted) return;
      try {
        const svg = await generateAgentAvatar(name, skill);
        if (mounted) setSvgContent(svg);
      } catch (e) {
        // Silently fail to fallback
      }
    };
    fetchAvatar();
    return () => { mounted = false; };
  }, [name, skill, enableAi]);

  const sizeClass = size === 'lg' ? 'w-24 h-24 rounded-[2rem]' : 'w-10 h-10 rounded-xl';

  if (!svgContent) {
    return (
      <div className={`${sizeClass} bg-slate-100 flex items-center justify-center border border-slate-200 font-black text-slate-400 ${enableAi ? 'animate-pulse' : ''}`}>
         {enableAi ? (
            <Loader2 className={`${size === 'lg' ? 'w-8 h-8' : 'w-4 h-4'} animate-spin`} />
         ) : (
            <span className={`${size === 'lg' ? 'text-3xl' : 'text-xs'}`}>{fallback}</span>
         )}
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClass} bg-white flex items-center justify-center overflow-hidden shadow-md border border-slate-100 hover:scale-105 transition-transform duration-300`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      title={`AI Generated Avatar for ${name}`}
    />
  );
};

// --- AGENT DETAIL PANEL ---

interface AgentDetailProps {
    agent: AgentSummary;
    onClose: () => void;
}

const AgentDetailPanel: React.FC<AgentDetailProps> = ({ agent, onClose }) => {
    const [showCoachingModal, setShowCoachingModal] = useState(false);
    const [showLiveMonitor, setShowLiveMonitor] = useState(false);
    const [coachingSuccess, setCoachingSuccess] = useState(false);
    
    // Live Monitor State
    const [liveTranscript, setLiveTranscript] = useState<{speaker:string, text:string}[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);

    // Mock Trend Data specific to this view
    const trendData = [
        { month: 'Jan', score: agent.avgScore - 5 },
        { month: 'Feb', score: agent.avgScore - 2 },
        { month: 'Mar', score: agent.avgScore + 1 },
        { month: 'Apr', score: agent.avgScore - 3 },
        { month: 'May', score: agent.avgScore },
        { month: 'Jun', score: agent.avgScore + 2 },
    ];

    const recentCalls = [
        { id: 101, time: '2 hours ago', duration: '4:12', sentiment: 'POSITIVE', score: 95, topic: 'Loan Inquiry' },
        { id: 102, time: 'Yesterday', duration: '12:05', sentiment: 'NEUTRAL', score: 82, topic: 'Complaint' },
        { id: 103, time: '2 days ago', duration: '8:30', sentiment: 'NEGATIVE', score: 65, topic: 'CC Activation' },
    ];

    const handleScheduleCoaching = (e: React.FormEvent) => {
        e.preventDefault();
        setCoachingSuccess(true);
        setTimeout(() => {
            setCoachingSuccess(false);
            setShowCoachingModal(false);
        }, 2000);
    };

    const startLiveMonitor = () => {
        setShowLiveMonitor(true);
        setIsConnecting(true);
        setLiveTranscript([]);
        
        // Simulate Connection
        setTimeout(() => {
            setIsConnecting(false);
            // Simulate Streaming Transcript
            const mockStream = [
                { speaker: 'Agent', text: 'Good afternoon, thank you for calling Premier Banking. My name is ' + agent.name.split(' ')[0] + '.' },
                { speaker: 'Customer', text: 'Hi, I saw a charge on my card I dont recognize.' },
                { speaker: 'Agent', text: 'I understand that can be concerning. I can certainly help you check that transaction.' },
                { speaker: 'Agent', text: 'Could you please verify the last 4 digits of your card number?' },
                { speaker: 'Customer', text: 'Sure, it is 4452.' },
                { speaker: 'Agent', text: 'Thank you. I see a transaction for $45.00 at "TechGadgets Inc". Does that ring a bell?' }
            ];

            let i = 0;
            const interval = setInterval(() => {
                if (i < mockStream.length) {
                    setLiveTranscript(prev => [...prev, mockStream[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 2500);

        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-slide-left overflow-y-auto border-l border-slate-200">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <AgentAvatar name={agent.name} skill={agent.topSkill} fallback={agent.avatar} size="lg" enableAi={true} />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{agent.name}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                     agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                     agent.status === 'In Training' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                     'bg-red-50 text-red-600 border-red-100'
                                }`}>{agent.status}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5" /> ID: AGT-{agent.id.padStart(3, '0')}</span>
                                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-indigo-500" /> Top Skill: {agent.topSkill}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    
                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center text-center">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Avg Score</span>
                            <span className="text-3xl font-black text-indigo-600">{agent.avgScore}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Compliance</span>
                            <span className="text-3xl font-black text-emerald-600">{agent.complianceRate}%</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center text-center">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Audits</span>
                            <span className="text-3xl font-black text-amber-600">{agent.callsCount}</span>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-400" /> Performance Trajectory (6 Months)
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis hide domain={['dataMin - 10', 100]} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Calls */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" /> Recent Audits
                        </h3>
                        {recentCalls.map((call) => (
                            <div key={call.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group bg-white">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${
                                        call.sentiment === 'POSITIVE' ? 'bg-emerald-50 text-emerald-600' :
                                        call.sentiment === 'NEUTRAL' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-600'
                                    }`}>
                                        {call.sentiment === 'POSITIVE' ? <ThumbsUp className="w-5 h-5" /> : 
                                         call.sentiment === 'NEGATIVE' ? <AlertTriangle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800">{call.topic}</h4>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Clock className="w-3 h-3" /> {call.duration} • {call.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-xl font-black ${
                                        call.score >= 90 ? 'text-emerald-600' : call.score >= 75 ? 'text-amber-500' : 'text-red-500'
                                    }`}>{call.score}</span>
                                    <span className="text-[8px] font-black text-slate-300 uppercase">Score</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => setShowCoachingModal(true)}
                            className="py-4 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-4 h-4" /> Schedule Coaching
                        </button>
                        <button 
                            onClick={startLiveMonitor}
                            className="py-4 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            <Zap className="w-4 h-4" /> Analyze Live
                        </button>
                    </div>

                </div>
            </div>

            {/* --- COACHING MODAL --- */}
            {showCoachingModal && (
                <div className="absolute inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
                        <button 
                            onClick={() => setShowCoachingModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {coachingSuccess ? (
                            <div className="py-12 flex flex-col items-center text-center animate-slide-up">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800">Coaching Scheduled!</h3>
                                <p className="text-sm text-slate-500 mt-2">Invites sent to you and {agent.name}.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                        <CalendarDays className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">Schedule Coaching</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">For {agent.name}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleScheduleCoaching} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Focus Area</label>
                                        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option>Empathy & Tone</option>
                                            <option>Product Knowledge - Loans</option>
                                            <option>Objection Handling</option>
                                            <option>Compliance Refresh</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Date</label>
                                            <input type="date" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Time</label>
                                            <input type="time" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                                        <textarea rows={3} placeholder="Add specific call IDs or context..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-4">
                                        Confirm Session
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* --- LIVE MONITOR OVERLAY --- */}
            {showLiveMonitor && (
                <div className="absolute inset-0 z-[80] bg-slate-900 flex flex-col items-center justify-center animate-fade-in text-white p-6">
                    <button 
                        onClick={() => setShowLiveMonitor(false)}
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="w-full max-w-4xl bg-slate-800 rounded-[32px] border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                        {/* Monitor Header */}
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <AgentAvatar name={agent.name} skill={agent.topSkill} fallback={agent.avatar} size="lg" enableAi={true} />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-black uppercase border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> LIVE
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-1">Active Call • Duration: 04:21 • Channel 2</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sentiment</div>
                                    <div className="text-emerald-400 font-bold">Positive (0.8)</div>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-700"></div>
                                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-2 transition-colors">
                                    <PauseOctagon className="w-4 h-4" /> Barge In
                                </button>
                            </div>
                        </div>

                        {/* Monitor Body */}
                        <div className="flex-1 flex flex-col relative">
                            {isConnecting ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
                                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Connecting to Secure Stream...</p>
                                </div>
                            ) : (
                                <div className="flex-1 p-8 overflow-y-auto space-y-4 custom-scrollbar">
                                    {liveTranscript.map((line, idx) => (
                                        <div key={idx} className={`flex gap-4 ${line.speaker === 'Agent' ? 'flex-row' : 'flex-row-reverse'} animate-slide-up`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                                line.speaker === 'Agent' ? 'bg-indigo-600' : 'bg-slate-600'
                                            }`}>
                                                {line.speaker === 'Agent' ? 'A' : 'C'}
                                            </div>
                                            <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                                                line.speaker === 'Agent' ? 'bg-slate-700/50 text-slate-200 rounded-tl-none' : 'bg-slate-800 text-slate-400 rounded-tr-none'
                                            }`}>
                                                {line.text}
                                            </div>
                                        </div>
                                    ))}
                                    {liveTranscript.length > 0 && (
                                        <div className="flex items-center gap-2 text-slate-500 text-xs italic ml-12 animate-pulse">
                                            <div className="flex space-x-1">
                                                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                            Transcribing...
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Waveform Visualization (Mock) */}
                            <div className="h-24 bg-slate-900 border-t border-slate-700 p-4 flex items-center justify-center gap-1">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-1.5 bg-indigo-500/50 rounded-full transition-all duration-100 ease-in-out"
                                        style={{ 
                                            height: isConnecting ? '4px' : `${Math.max(4, Math.random() * 40)}px`,
                                            opacity: isConnecting ? 0.2 : 1
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};


// --- MAIN COMPONENT ---

export const TeamAnalytics: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentSummary | null>(null);

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      
      {selectedAgent && (
          <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}

      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +4.2%
                </span>
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Quality Score</h4>
            <div className="text-3xl font-black text-slate-800">{TEAM_STATS.avgQualityScore}%</div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: '84%' }}></div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +1.5%
                </span>
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Rate</h4>
            <div className="text-3xl font-black text-slate-800">{TEAM_STATS.complianceTargetMet}%</div>
            <div className="mt-2 text-[10px] font-bold text-slate-400">TARGET: 95%</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    Total Agents: 42
                </span>
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calls Audited</h4>
            <div className="text-3xl font-black text-slate-800">{TEAM_STATS.totalCalls}</div>
            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase">This Quarter</div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-2xl border border-indigo-500 shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <Target className="w-20 h-20 text-white" />
            </div>
            <div className="relative z-10 text-white">
                <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Top Performer</h4>
                <div className="text-xl font-black tracking-tight mb-2">Sarah Jenkins</div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-300 fill-yellow-300" />)}
                    </div>
                    <span className="text-[10px] font-bold text-indigo-100 uppercase">99.2% Accuracy</span>
                </div>
            </div>
        </div>
      </div>

      {/* 2. VISUALIZATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Competency Radar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Departmental Competency</h3>
                    <p className="text-xs text-slate-400 font-medium">Aggregate soft skill metrics across all agents</p>
                  </div>
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 cursor-pointer">
                      <BarChart3 className="w-5 h-5" />
                  </div>
              </div>
              <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={TEAM_STATS.competencyAverages}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                          <Radar
                              name="Team Average"
                              dataKey="A"
                              stroke="#6366f1"
                              fill="#6366f1"
                              fillOpacity={0.4}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                      </RadarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Sentiment Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1">Customer Sentiment</h3>
              <p className="text-xs text-slate-400 font-medium mb-8 text-center uppercase tracking-widest">Global Call Mood</p>
              
              <div className="flex-1 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                    <Pie
                        data={TEAM_STATS.sentimentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {TEAM_STATS.sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    </RePieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 mt-4">
                  {TEAM_STATS.sentimentDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                              <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-800">{item.value}%</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 3. LEADERBOARD TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Agent Performance Leaderboard</h3>
              <div className="flex items-center gap-2">
                  <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search agent..."
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                      />
                  </div>
                  <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500">
                      <Filter className="w-4 h-4" />
                  </button>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Agent Name</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Avg Score</th>
                          <th className="px-6 py-4">Calls Audit</th>
                          <th className="px-6 py-4">Compliance</th>
                          <th className="px-6 py-4">Primary Strength</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {MOCK_AGENTS.map((agent, idx) => (
                          <tr key={agent.id} className="hover:bg-indigo-50/30 transition-colors group">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      {/* AI Avatar disabled in list view to prevent 429 quota errors */}
                                      <AgentAvatar 
                                        name={agent.name} 
                                        skill={agent.topSkill} 
                                        fallback={agent.avatar}
                                        enableAi={false}
                                      />
                                      <div>
                                          <div className="text-sm font-bold text-slate-800">{agent.name}</div>
                                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Rank #{idx+1}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                      agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                      agent.status === 'In Training' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                      'bg-red-50 text-red-600 border-red-100'
                                  }`}>
                                      {agent.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <div className="text-sm font-black text-slate-800">{agent.avgScore}%</div>
                                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full ${agent.avgScore >= 85 ? 'bg-emerald-500' : agent.avgScore >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${agent.avgScore}%` }}
                                          ></div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-600">{agent.callsCount}</td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      <span className="text-sm font-bold text-slate-700">{agent.complianceRate}%</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">
                                      {agent.topSkill}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <button 
                                      onClick={() => setSelectedAgent(agent)}
                                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm"
                                  >
                                      <ArrowUpRight className="w-4 h-4" />
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                  Load More Agents
              </button>
          </div>
      </div>

    </div>
  );
};