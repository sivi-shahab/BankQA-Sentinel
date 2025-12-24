
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
  Briefcase
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie,
  Legend
} from 'recharts';
import { Lead, Customer360, CRMStats, SegmentGroup } from '../types';

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Budi Santoso', source: 'Facebook Ads', score: 92, status: 'Proposal', category: 'Hot', kycStatus: 'Verified' },
  { id: '2', name: 'Lia Wijaya', source: 'Web Form', score: 78, status: 'Meeting', category: 'Warm', kycStatus: 'Pending' },
  { id: '3', name: 'Andi Pratama', source: 'Referral', score: 85, status: 'Prospect', category: 'Hot', kycStatus: 'Verified' },
  { id: '4', name: 'Santi Putri', source: 'Instagram', score: 45, status: 'Prospect', category: 'Cold', kycStatus: 'Pending' },
  { id: '5', name: 'Rian Hidayat', source: 'LinkedIn', score: 65, status: 'Meeting', category: 'Warm', kycStatus: 'Verified' },
];

const MOCK_CUSTOMERS: Customer360[] = [
  { 
    id: 'C001', name: 'Bapak Ahmad', tier: 'Priority', 
    portfolio: { savings: 150000000, deposits: 500000000, loans: 0, investment: 120000000 },
    churnRisk: 12, lastInteraction: '2 days ago', nba: 'Offer Reksadana Saham'
  },
  { 
    id: 'C002', name: 'Ibu Maya', tier: 'Gold', 
    portfolio: { savings: 45000000, deposits: 0, loans: 250000000, investment: 0 },
    churnRisk: 68, lastInteraction: '1 month ago', nba: 'Loan Restructuring Call'
  },
  { 
    id: 'C003', name: 'Bapak Kevin', tier: 'Silver', 
    portfolio: { savings: 12000000, deposits: 10000000, loans: 0, investment: 0 },
    churnRisk: 35, lastInteraction: '1 week ago', nba: 'Credit Card Cross-sell'
  },
];

const CRM_STATS: CRMStats = {
  acquisition: {
    totalLeads: 452,
    conversionRate: 18.5,
    funnelData: [
      { stage: 'Leads', count: 452 },
      { stage: 'Prospect', count: 310 },
      { stage: 'Meeting', count: 185 },
      { stage: 'Proposal', count: 92 },
      { stage: 'Closing', count: 48 },
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

const TIER_COLORS = {
  'Priority': '#6366f1',
  'Gold': '#fbbf24',
  'Silver': '#94a3b8'
};

export const CRMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ACQUISITION' | 'RETENTION'>('ACQUISITION');
  const [selectedSegment, setSelectedSegment] = useState<SegmentGroup | null>(null);

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
            <p className="text-slate-500 font-medium">Acquisition & Retention Management System</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Funnel Visualisation */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Sales Funnel</h3>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-4">
              {CRM_STATS.acquisition.funnelData.map((item, idx) => {
                const percentage = (item.count / CRM_STATS.acquisition.funnelData[0].count) * 100;
                return (
                  <div key={idx} className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-600">{item.stage}</span>
                      <span className="text-xs font-black text-slate-900">{item.count}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 relative">
               <div className="text-3xl font-black text-indigo-600">{CRM_STATS.acquisition.conversionRate}%</div>
               <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Conversion Rate</div>
               <Sparkles className="absolute top-2 right-2 w-4 h-4 text-indigo-200" />
            </div>
          </div>

          {/* Leads Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-black text-slate-800">Leads Intelligence</h3>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search leads..."
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-48 font-medium"
                    />
                  </div>
                  <button className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100"><Filter className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Lead Detail</th>
                      <th className="px-8 py-4 text-center">AI Scoring</th>
                      <th className="px-8 py-4">Pipeline Status</th>
                      <th className="px-8 py-4">e-KYC Check</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_LEADS.map(lead => (
                      <tr key={lead.id} className="hover:bg-indigo-50/20 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="text-sm font-bold text-slate-800">{lead.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{lead.source}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col items-center">
                            <span className={`text-sm font-black ${lead.score >= 80 ? 'text-emerald-600' : lead.score >= 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                              {lead.score}
                            </span>
                            <span className="text-[8px] font-black uppercase text-slate-300">{lead.category}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">{lead.status}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-1.5">
                            {lead.kycStatus === 'Verified' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                            <span className="text-[10px] font-bold text-slate-600">{lead.kycStatus}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"><ArrowUpRight className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* RETENTION DASHBOARD ROW 1: HEALTH & SEGMENTATION DISTRIBUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Target className="w-32 h-32" /></div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Customer Health</h3>
                <div className="space-y-6">
                    <div>
                        <div className="text-4xl font-black text-slate-800">{CRM_STATS.retention.churnRate}%</div>
                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Monthly Churn Rate</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-800">{formatIDR(CRM_STATS.retention.avgCLV)}</div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Avg Lifetime Value (CLV)</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-800">{CRM_STATS.retention.slaMet}%</div>
                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Service SLA Met</div>
                    </div>
                </div>
            </div>

            {/* SEGMENTATION ENGINE */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Segmentation Engine</h3>
                    </div>
                    <button className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                        Re-evaluate Segments
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CRM_STATS.retention.segments.map((seg, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setSelectedSegment(seg)}
                            className={`p-4 rounded-2xl border transition-all text-left group relative ${
                                selectedSegment?.name === seg.name 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                                : 'bg-slate-50 border-slate-100 hover:border-indigo-200'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-1.5 rounded-lg ${selectedSegment?.name === seg.name ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                    <Users className={`w-4 h-4 ${selectedSegment?.name === seg.name ? 'text-white' : 'text-indigo-600'}`} />
                                </div>
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    seg.riskLevel === 'HIGH' 
                                    ? (selectedSegment?.name === seg.name ? 'bg-white text-red-600' : 'bg-red-50 text-red-600') 
                                    : (selectedSegment?.name === seg.name ? 'bg-white text-emerald-600' : 'bg-emerald-50 text-emerald-600')
                                }`}>
                                    {seg.riskLevel} RISK
                                </span>
                            </div>
                            <h4 className={`text-xs font-black tracking-tight mb-1 ${selectedSegment?.name === seg.name ? 'text-white' : 'text-slate-800'}`}>
                                {seg.name}
                            </h4>
                            <div className={`text-[10px] font-bold ${selectedSegment?.name === seg.name ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {seg.count} Customers
                            </div>
                            {selectedSegment?.name === seg.name && (
                                <div className="absolute -bottom-1 -right-1 p-1">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {selectedSegment && (
                    <div className="mt-8 p-6 bg-slate-900 rounded-[24px] text-white animate-slide-up relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Recommended Strategy for {selectedSegment.name}</h4>
                                <p className="text-xl font-black tracking-tight leading-none mb-4">{selectedSegment.strategy}</p>
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Reach</span>
                                        <span className="text-sm font-bold">{selectedSegment.count} Priority Accounts</span>
                                    </div>
                                    <div className="flex flex-col border-l border-slate-800 pl-4">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AUM Impact</span>
                                        <span className="text-sm font-bold text-emerald-400">~{formatIDR(selectedSegment.count * selectedSegment.avgValue)}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Launch Campaign
                            </button>
                        </div>
                        <Sparkles className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-6 -mt-6" />
                    </div>
                )}
            </div>
          </div>

          {/* RETENTION DASHBOARD ROW 2: CUSTOMER 360 & TIER ANALYSIS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TIER DISTRIBUTION CHART */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                    <Compass className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Portfolio Tier Breakdown</h3>
                </div>
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie
                                data={[
                                    { name: 'Priority', value: 150 },
                                    { name: 'Gold', value: 450 },
                                    { name: 'Silver', value: 820 }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell fill={TIER_COLORS['Priority']} />
                                <Cell fill={TIER_COLORS['Gold']} />
                                <Cell fill={TIER_COLORS['Silver']} />
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                        </RePieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CUSTOMER 360 INTELLIGENCE */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Customer 360 Intelligence</h3>
                    </div>
                    <div className="flex gap-2">
                         <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name/id..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none w-48 font-medium"
                            />
                        </div>
                        <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-100 transition-colors">
                            <Briefcase className="w-3.5 h-3.5" /> Client List
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_CUSTOMERS.map(cust => (
                        <div key={cust.id} className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 hover:border-emerald-200 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white rotate-45 translate-x-1/2 -translate-y-1/2 shadow-sm border border-slate-100"></div>
                            
                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg leading-none mb-1 group-hover:text-emerald-700 transition-colors">{cust.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${cust.tier === 'Priority' ? 'bg-indigo-500' : cust.tier === 'Gold' ? 'bg-amber-400' : 'bg-slate-400'}`}></span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{cust.tier} TIER • {cust.id}</span>
                                    </div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase border shadow-sm ${cust.churnRisk > 50 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                    Risk Score: {cust.churnRisk}%
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
                                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Total Assets</span>
                                    <span className="text-xs font-black text-slate-900 tracking-tight">{formatIDR(cust.portfolio.savings + cust.portfolio.deposits + cust.portfolio.investment)}</span>
                                </div>
                                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Liabilities</span>
                                    <span className="text-xs font-black text-rose-600 tracking-tight">{formatIDR(cust.portfolio.loans)}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-2xl border border-indigo-50 flex items-start gap-3 shadow-sm relative z-10">
                                <div className="p-1.5 bg-indigo-50 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block leading-none mb-1.5">AI Next Best Action</span>
                                    <p className="text-[12px] font-bold text-slate-700 leading-snug">{cust.nba}</p>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-medium italic">Contacted {cust.lastInteraction}</span>
                                </div>
                                <button className="p-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                </div>

                {/* SLA TICKET MONITOR */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Retention Tickets & SLA</h3>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                4 Critical
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { ticket: '#TK-4521', customer: 'Ahmad Santoso', type: 'High Value Loan Complaint', sla: '1h 24m', priority: 'High', status: 'In Progress' },
                            { ticket: '#TK-4519', customer: 'Maya Wijaya', type: 'Retention Incentive Request', sla: '14h 05m', priority: 'Medium', status: 'Pending' }
                        ].map((tk, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={`w-3 h-3 rounded-full shadow-sm ${tk.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                    <div>
                                        <div className="text-sm font-black text-slate-800">{tk.customer}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{tk.ticket}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight">{tk.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 mt-4 md:mt-0">
                                    <div className="text-right">
                                        <div className="text-[11px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1">{tk.sla}</div>
                                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">SLA Deadline</div>
                                    </div>
                                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
                                        {tk.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
