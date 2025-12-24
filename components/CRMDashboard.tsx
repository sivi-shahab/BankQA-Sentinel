
import React, { useState } from 'react';
import { 
  Target, Users, Zap, ShieldCheck, 
  TrendingUp, TrendingDown, Clock, 
  CreditCard, Landmark, Filter, 
  Plus, MoreHorizontal, CheckCircle2, 
  AlertCircle, ArrowUpRight, Heart,
  Search, ExternalLink, Calendar,
  PieChart, BarChart3, Database, 
  UserPlus, UserCheck, MessageSquare,
  Sparkles, Award, Layers,
  Compass,
  Briefcase,
  XCircle,
  BellRing,
  ArrowRightCircle,
  ShieldAlert,
  ShieldEllipsis,
  Activity,
  Flame,
  Coins,
  History,
  Timer,
  Fingerprint,
  BrainCircuit,
  Maximize2,
  TrendingUp as TrendingIcon,
  Smile,
  Meh,
  Frown,
  BarChart as LucideBarChart,
  ShieldHalf,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Minus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie,
  Legend, AreaChart, Area,
  LineChart, Line
} from 'recharts';
import { Lead, Customer360, CRMStats, SegmentGroup } from '../types';

const MOCK_LEADS: Lead[] = [
  { 
    id: 'L001', name: 'Budi Santoso', source: 'Facebook Ads', score: 92, status: 'Proposal', 
    category: 'Hot', kycStatus: 'Verified', productAffinity: 'KPR Fixed Rate',
    propensityReason: 'Searched for "Mortgage" 3 times today', bestTimeToCall: '14:00 - 16:00',
    expectedValue: 1250000000, lastActivity: '2 mins ago', creditScore: 780
  },
  { 
    id: 'L002', name: 'Lia Wijaya', source: 'Web Form', score: 78, status: 'Meeting', 
    category: 'Warm', kycStatus: 'Pending', productAffinity: 'Credit Card Platinum',
    propensityReason: 'High travel spend profile detected', bestTimeToCall: '09:00 - 11:00',
    expectedValue: 45000000, lastActivity: '1 hour ago', creditScore: 650
  },
  { 
    id: 'L003', name: 'Andi Pratama', source: 'Referral', score: 85, status: 'Prospect', 
    category: 'Hot', kycStatus: 'Verified', productAffinity: 'Wealth Management',
    propensityReason: 'Existing Priority segment referral', bestTimeToCall: '13:00 - 15:00',
    expectedValue: 5000000000, lastActivity: '15 mins ago', creditScore: 810
  },
];

const MOCK_CUSTOMERS: Customer360[] = [
  { 
    id: 'C001', name: 'Bapak Ahmad', tier: 'Priority', 
    portfolio: { savings: 150000000, deposits: 500000000, loans: 0, investment: 120000000, insurance: 50000000 },
    churnRisk: 12, riskTrend: 'DOWN', riskFactors: ['Stable AUM Growth', 'High Digital Engagement'],
    lastInteraction: '2 days ago', nba: 'Offer Reksadana Saham',
    persona: 'Pragmatic Wealth Builder', engagementScore: 94, walletSharePct: 65,
    moodTrend: ['POS', 'POS', 'NEU', 'POS'], lifeEventPrediction: 'Retirement Planning (85%)',
    wealthVelocity: 'RISING'
  },
  { 
    id: 'C002', name: 'Ibu Maya', tier: 'Gold', 
    portfolio: { savings: 45000000, deposits: 0, loans: 250000000, investment: 0, insurance: 10000000 },
    churnRisk: 68, riskTrend: 'UP', riskFactors: ['Frequent Large Withdrawals', 'Recent Competitor Inquiry', 'Loan DPD > 3 Days'],
    lastInteraction: '1 month ago', nba: 'Debt Consolidation Loan',
    persona: 'Debt-burdened Professional', engagementScore: 24, walletSharePct: 15,
    moodTrend: ['NEG', 'NEG', 'NEU', 'NEG'], lifeEventPrediction: 'Home Downsizing (60%)',
    wealthVelocity: 'DECLINING'
  },
  { 
    id: 'C003', name: 'Bapak Kevin', tier: 'Silver', 
    portfolio: { savings: 12000000, deposits: 10000000, loans: 0, investment: 0, insurance: 0 },
    churnRisk: 35, riskTrend: 'STABLE', riskFactors: ['Minimal App Activity', 'Dormant Payroll Account'],
    lastInteraction: '1 week ago', nba: 'Credit Card Limit Boost',
    persona: 'Early Stage Saver', engagementScore: 45, walletSharePct: 40,
    moodTrend: ['NEU', 'POS', 'NEU', 'NEU'], lifeEventPrediction: 'Education Loan Need (75%)',
    wealthVelocity: 'STABLE'
  },
  { 
    id: 'C004', name: 'Ibu Siska', tier: 'Priority', 
    portfolio: { savings: 80000000, deposits: 2000000000, loans: 0, investment: 750000000, insurance: 150000000 },
    churnRisk: 5, riskTrend: 'STABLE', riskFactors: ['Family Legacy Account', 'Multi-product Holder'],
    lastInteraction: 'Today', nba: 'Family Trust Advisory',
    persona: 'High-Net-Worth Matriarch', engagementScore: 98, walletSharePct: 88,
    moodTrend: ['POS', 'POS', 'POS', 'POS'], lifeEventPrediction: 'Estate Transfer (90%)',
    wealthVelocity: 'RISING'
  },
];

const CRM_STATS: CRMStats = {
  acquisition: {
    totalLeads: 452,
    conversionRate: 18.5,
    expectedRevenue: 14200000000,
    funnelData: [
      { stage: 'Leads', count: 452, dropOff: 0 },
      { stage: 'Prospect', count: 310, dropOff: 31 },
      { stage: 'Meeting', count: 185, dropOff: 40 },
      { stage: 'Proposal', count: 92, dropOff: 50 },
      { stage: 'Closing', count: 48, dropOff: 47 },
    ]
  },
  retention: {
    avgCLV: 12500000,
    churnRate: 3.2,
    activeCampaigns: 12,
    slaMet: 96.8,
    segments: [
      { name: 'High Value Whales', count: 124, avgValue: 750000000, riskLevel: 'LOW', strategy: 'Concierge Priority Service' },
      { name: 'At Risk Priority', count: 35, avgValue: 520000000, riskLevel: 'HIGH', strategy: 'Immediate Retention Call' },
      { name: 'Passive Savers', count: 850, avgValue: 25000000, riskLevel: 'MEDIUM', strategy: 'Investment Upsell Campaign' },
      { name: 'Dormant Students', count: 420, avgValue: 1200000, riskLevel: 'HIGH', strategy: 'Activation Incentive' },
    ]
  }
};

const MoodIcon: React.FC<{ mood: 'POS' | 'NEU' | 'NEG' }> = ({ mood }) => {
    if (mood === 'POS') return <Smile className="w-3 h-3 text-emerald-500" />;
    if (mood === 'NEU') return <Meh className="w-3 h-3 text-amber-500" />;
    return <Frown className="w-3 h-3 text-rose-500" />;
};

const CreditScoreBadge: React.FC<{ score?: number }> = ({ score }) => {
    if (!score) return <span className="text-slate-300 italic text-[10px]">No Data</span>;
    let color = 'bg-slate-100 text-slate-600';
    if (score >= 750) color = 'bg-emerald-50 text-emerald-600 border-emerald-100';
    else if (score >= 650) color = 'bg-indigo-50 text-indigo-600 border-indigo-100';
    else if (score >= 550) color = 'bg-amber-50 text-amber-600 border-amber-100';
    else color = 'bg-rose-50 text-rose-600 border-rose-100';

    return (
        <div className={`px-2.5 py-1 rounded-lg border font-black text-[11px] ${color} flex items-center gap-1.5 shadow-sm`}>
            <ShieldHalf className="w-3 h-3" />
            {score}
        </div>
    );
};

export const CRMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ACQUISITION' | 'RETENTION'>('ACQUISITION');
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">CRM Intelligence</h1>
            <p className="text-slate-500 font-medium text-sm">Predictive Portfolio & Customer 360 Insight</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('ACQUISITION')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ACQUISITION' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Acquisition (Hunt)
          </button>
          <button 
            onClick={() => setActiveTab('RETENTION')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'RETENTION' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Retention (Farm)
          </button>
        </div>
      </div>

      {activeTab === 'ACQUISITION' ? (
        <div className="space-y-8 animate-fade-in">
            {/* TOP INTELLIGENCE ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative group overflow-hidden">
                        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Target className="w-32 h-32 text-indigo-600" />
                        </div>
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Target className="w-5 h-5" /></div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">+12% WoW</span>
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Pipeline</h4>
                        <div className="text-2xl font-black text-slate-800 tracking-tight">{CRM_STATS.acquisition.totalLeads} Hot Leads</div>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Coins className="w-20 h-20 text-white" />
                        </div>
                        <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Expected Revenue</h4>
                        <div className="text-xl font-black text-white tracking-tight leading-none mb-1">{formatIDR(CRM_STATS.acquisition.expectedRevenue)}</div>
                        <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-tight">Projected for Q3-2024</p>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Sales Momentum Forecast</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">AI-Driven Conversion Prediction (60D Window)</p>
                        </div>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { month: 'Jan', actual: 4200, forecast: 4500 },
                                { month: 'Feb', actual: 4800, forecast: 5000 },
                                { month: 'Mar', actual: 5100, forecast: 5300 },
                                { month: 'Apr', actual: 5900, forecast: 6200 },
                                { month: 'May', actual: null, forecast: 7100 },
                                { month: 'Jun', actual: null, forecast: 7800 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                                <YAxis hide />
                                <Area type="monotone" dataKey="forecast" stroke="#e2e8f0" strokeDasharray="5 5" fill="transparent" />
                                <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" />
                                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* LEADS HUB WITH CREDIT SCORING */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm animate-pulse">
                            <Flame className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">Hot Acquisition Pipeline</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Propensity & Creditworthiness Analysis</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search leads..." className="pl-10 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none w-72 shadow-sm" />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm"><Filter className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-10 py-5">Prospect Profile</th>
                                <th className="px-10 py-5">Credit Scoring</th>
                                <th className="px-10 py-5">AI Behavioral Propensity</th>
                                <th className="px-10 py-5 text-center">Intent Score</th>
                                <th className="px-10 py-5">BTC (Best Time)</th>
                                <th className="px-10 py-5 text-right">Value Forecast</th>
                                <th className="px-10 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_LEADS.map(lead => (
                                <tr key={lead.id} className="hover:bg-indigo-50/30 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-black text-sm shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                                {lead.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-800 leading-none mb-1">{lead.name}</div>
                                                <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{lead.productAffinity}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <CreditScoreBadge score={lead.creditScore} />
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-medium text-slate-500 italic group-hover:border-indigo-100 transition-all">
                                            "{lead.propensityReason}"
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="text-lg font-black text-indigo-600 leading-none">{lead.score}</div>
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{lead.category}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                                            <Timer className="w-3.5 h-3.5 text-indigo-500" />
                                            {lead.bestTimeToCall}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right font-black text-sm text-slate-800">
                                        {formatIDR(lead.expectedValue)}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                                            <ArrowRightCircle className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      ) : (
        <div className="space-y-12 animate-fade-in">
          {/* RETENTION INTELLIGENCE ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* VITAL SIGNS */}
              <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 opacity-5 text-indigo-600 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                      <Activity className="w-64 h-64" />
                  </div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" /> Retention Vital Signs
                  </h3>
                  <div className="space-y-8">
                      <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-800 tracking-tighter">{CRM_STATS.retention.churnRate}%</span>
                            <span className="text-xs font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-rose-100"><TrendingUp className="w-3.5 h-3.5" /> 0.2%</span>
                          </div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Churn Risk Index Monthly</div>
                      </div>
                      <div>
                          <div className="text-5xl font-black text-slate-800 tracking-tighter">{formatIDR(CRM_STATS.retention.avgCLV)}</div>
                          <div className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mt-1">Avg. Asset Value per Segment</div>
                      </div>
                  </div>
              </div>

              {/* ACTION CENTER - CRITICAL CHURN ALERTS */}
              <div className="lg:col-span-2 bg-gradient-to-br from-rose-500 to-rose-700 rounded-[40px] p-1 shadow-2xl shadow-rose-100">
                  <div className="bg-white/95 backdrop-blur-md rounded-[38px] p-10 h-full">
                      <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-5">
                              <div className="p-4 bg-rose-100 text-rose-600 rounded-3xl animate-bounce shadow-lg shadow-rose-100">
                                  <BellRing className="w-8 h-8" />
                              </div>
                              <div>
                                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">RM Action Center: Critical</h2>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Immediate Engagement Strategy Required</p>
                              </div>
                          </div>
                          <div className="text-[10px] font-black text-rose-500 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100 uppercase tracking-widest shadow-sm">
                                {MOCK_CUSTOMERS.filter(c => c.churnRisk > 30).length} High Risk Accounts Identified
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {MOCK_CUSTOMERS.filter(c => c.churnRisk > 30).slice(0, 2).map(customer => (
                              <div key={customer.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex items-center justify-between group hover:border-rose-200 hover:shadow-xl transition-all">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-lg border border-rose-100">
                                          {customer.name[0]}
                                      </div>
                                      <div>
                                          <div className="text-sm font-black text-slate-800 leading-none mb-1">{customer.name}</div>
                                          <div className="flex items-center gap-1.5">
                                              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Risk: {customer.churnRisk}%</span>
                                              {customer.riskTrend === 'UP' ? <ArrowUpNarrowWide className="w-3.5 h-3.5 text-rose-500" /> : <ArrowDownNarrowWide className="w-3.5 h-3.5 text-emerald-500" />}
                                          </div>
                                      </div>
                                  </div>
                                  <button className="p-3 bg-slate-900 text-white rounded-2xl group-hover:bg-rose-600 transition-all shadow-lg active:scale-95">
                                      <MessageSquare className="w-5 h-5" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* THE HYPER-INTELLIGENT CUSTOMER 360 HUB */}
          <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 px-4">
                  <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-600 text-white rounded-[24px] shadow-xl shadow-emerald-100">
                          <BrainCircuit className="w-8 h-8" />
                      </div>
                      <div>
                          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Customer 360 Hub</h2>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Behavioral Portfolio Intelligence & Risk Markers</p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search customer hub..." className="pl-10 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none w-80 shadow-sm" />
                      </div>
                      <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 shadow-sm"><Filter className="w-5 h-5" /></button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {MOCK_CUSTOMERS.map(cust => (
                      <div key={cust.id} className="group bg-white border border-slate-100 rounded-[44px] p-8 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-700 flex flex-col relative overflow-hidden">
                          {/* Behavioral Background Indicator */}
                          <div className={`absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 ${cust.tier === 'Priority' ? 'text-indigo-600' : 'text-amber-500'}`}>
                              <Fingerprint className="w-48 h-48" />
                          </div>

                          {/* Top Row: Identification & Trend */}
                          <div className="flex items-center justify-between mb-8 relative z-10">
                              <div className="flex items-center gap-4">
                                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white text-xl font-black shadow-xl ${
                                      cust.tier === 'Priority' ? 'bg-indigo-600 shadow-indigo-100' : 
                                      cust.tier === 'Gold' ? 'bg-amber-400 shadow-amber-100' : 'bg-slate-400 shadow-slate-100'
                                  }`}>
                                      {cust.name[0]}
                                  </div>
                                  <div>
                                      <h4 className="font-black text-slate-800 text-lg leading-none mb-1">{cust.name}</h4>
                                      <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                                              cust.tier === 'Priority' ? 'text-indigo-500' : 'text-amber-600'
                                          }`}>{cust.tier}</span>
                                          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                          <div className="flex gap-1">
                                              {cust.moodTrend.map((m, i) => <MoodIcon key={i} mood={m} />)}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-1.5 leading-none">
                                      <span className={`text-2xl font-black ${cust.churnRisk > 40 ? 'text-rose-500' : 'text-slate-800'}`}>
                                          {cust.churnRisk}%
                                      </span>
                                      {cust.riskTrend === 'UP' ? <ArrowUpNarrowWide className="w-5 h-5 text-rose-500" /> : cust.riskTrend === 'DOWN' ? <ArrowDownNarrowWide className="w-5 h-5 text-emerald-500" /> : <Minus className="w-5 h-5 text-slate-300" />}
                                  </div>
                                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Churn Risk Index</span>
                              </div>
                          </div>

                          {/* Risk Analysis Section (NEW) */}
                          <div className="mb-6 relative z-10">
                              <div className="flex items-center gap-2 mb-3">
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Factor Breakdown</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                  {cust.riskFactors.map((factor, idx) => (
                                      <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-500 rounded-lg group-hover:bg-white group-hover:border-rose-100 group-hover:text-rose-600 transition-all">
                                          {factor}
                                      </span>
                                  ))}
                              </div>
                          </div>

                          {/* Behavioral Persona Chip */}
                          <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-all relative z-10">
                              <div className="flex items-center gap-2 mb-1">
                                  <BrainCircuit className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">AI Behavioral Persona</span>
                              </div>
                              <p className="text-xs font-black text-slate-800 tracking-tight">{cust.persona}</p>
                          </div>
                          
                          {/* Portfolio Stats Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                              <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Wallet Share</span>
                                  <div className="flex items-baseline gap-1">
                                      <span className="text-xl font-black text-slate-800">{cust.walletSharePct}%</span>
                                      <TrendingIcon className="w-2.5 h-2.5 text-emerald-500" />
                                  </div>
                              </div>
                              <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Engagement</span>
                                  <div className="flex items-baseline gap-1">
                                      <span className="text-xl font-black text-slate-800">{cust.engagementScore}</span>
                                      <span className="text-[9px] font-black text-slate-300 uppercase">/100</span>
                                  </div>
                              </div>
                          </div>

                          {/* Life Event Propensity */}
                          <div className="p-5 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[28px] text-white shadow-xl relative z-10 mb-8 overflow-hidden group/prediction transition-all hover:scale-105 active:scale-95 cursor-pointer">
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/prediction:rotate-12 transition-transform">
                                  <Compass className="w-12 h-12" />
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                  <Sparkles className="w-4 h-4 text-amber-300" />
                                  <span className="text-[9px] font-black text-emerald-200 uppercase tracking-widest leading-none">Event Propensity Marker</span>
                              </div>
                              <p className="text-sm font-black leading-tight mb-2">{cust.lifeEventPrediction}</p>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full w-fit">
                                  <span className="text-[9px] font-black uppercase tracking-widest">Target:</span>
                                  <span className="text-[9px] font-black text-emerald-100 uppercase tracking-widest truncate max-w-[120px]">{cust.nba}</span>
                              </div>
                          </div>

                          {/* Footer Action */}
                          <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                              <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Wealth Velocity</span>
                                  <div className="flex items-center gap-1.5">
                                      <div className={`w-2.5 h-2.5 rounded-full ${
                                          cust.wealthVelocity === 'RISING' ? 'bg-emerald-500' :
                                          cust.wealthVelocity === 'STABLE' ? 'bg-blue-400' : 'bg-rose-500'
                                      } shadow-sm shadow-black/5`}></div>
                                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{cust.wealthVelocity}</span>
                                  </div>
                              </div>
                              <button className="p-4 bg-slate-900 text-white rounded-[24px] hover:bg-emerald-600 hover:scale-110 transition-all shadow-xl active:scale-95 group-hover:shadow-emerald-100">
                                  <Maximize2 className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* ASSET COMPOSITION & SEGMENT ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[44px] p-10 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><LucideBarChart className="w-6 h-6" /></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Granular Asset Mix per Tier</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Product Penetration & Concentration Across Portfolios</p>
                        </div>
                    </div>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { tier: 'Priority', Savings: 350000000, Deposits: 650000000, Investment: 800000000, Insurance: 120000000, Loans: 150000000 },
                            { tier: 'Gold', Savings: 120000000, Deposits: 180000000, Investment: 250000000, Insurance: 45000000, Loans: 320000000 },
                            { tier: 'Silver', Savings: 35000000, Deposits: 15000000, Investment: 25000000, Insurance: 5000000, Loans: 185000000 },
                        ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'black', fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000000}M`} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }} />
                            <Legend iconType="circle" />
                            <Bar dataKey="Savings" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Deposits" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Investment" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Insurance" fill="#f59e0b" stackId="a" radius={[12, 12, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-[44px] p-10 border border-slate-200 shadow-sm flex flex-col h-full">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Segment Churn Risk Index</h3>
                <div className="space-y-6 flex-1">
                    {CRM_STATS.retention.segments.map((segment, idx) => (
                        <div key={idx} className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all group cursor-pointer shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="text-sm font-black text-slate-800">{segment.name}</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{segment.count} Account Members</div>
                                </div>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                                    segment.riskLevel === 'LOW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    segment.riskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>{segment.riskLevel} Risk</span>
                            </div>
                            <div className="text-[10px] font-bold text-indigo-600 leading-tight">
                                <span className="text-slate-400 font-black uppercase text-[8px] block mb-1">Retention Strategy:</span>
                                {segment.strategy}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full py-5 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest mt-8 flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-95">
                    Generate Segment Forecast <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
