
import React from 'react';
import { 
  Users, TrendingUp, ShieldCheck, Target, 
  Award, ArrowUpRight, ArrowDownRight, 
  BarChart3, PieChart, Star, Search, Filter,
  MoreVertical, CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, Legend, PieChart as RePieChart, Pie, Cell 
} from 'recharts';
import { AgentSummary, TeamStats } from '../types';

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

export const TeamAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
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
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-md">
                                          {agent.avatar}
                                      </div>
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
                                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm">
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
