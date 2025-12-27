
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
  History as HistoryIcon,
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
  Minus,
  X, Phone, Mail, FileText, Check, ChevronRight,
  Wallet, PieChart as PieChartIcon, ArrowRight, Loader2,
  Rocket,
  Megaphone,
  Printer,
  Download,
  Share2,
  Table,
  UserMinus,
  PhoneCall,
  Send
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie,
  Legend, AreaChart, Area,
  LineChart, Line
} from 'recharts';
import { Lead, Customer360, CRMStats, SegmentGroup, Campaign } from '../types';

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
    churnRisk: 12, riskTrend: 'DOWN', riskFactors: ['Stable Balance', 'Active Investment'],
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

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];

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

// --- LEAD DETAIL PANEL ---
interface LeadDetailProps {
    lead: Lead;
    onClose: () => void;
}

const LeadDetailPanel: React.FC<LeadDetailProps> = ({ lead, onClose }) => {
    const formatIDR = (val: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val));
    
    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-slide-left overflow-y-auto border-l border-slate-200">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">{lead.id}</span>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                {lead.kycStatus === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                                {lead.kycStatus}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{lead.name}</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><BrainCircuit className="w-3.5 h-3.5 text-indigo-500" /> Source: {lead.source}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> Last Active: {lead.lastActivity}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Score Cards */}
                    <div className="grid grid-cols-3 gap-4">
                         <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col justify-between">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Intent Score</span>
                            <div className="text-3xl font-black text-indigo-600">{lead.score}<span className="text-sm text-indigo-300">/100</span></div>
                         </div>
                         <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Credit Score</span>
                            <div className="text-3xl font-black text-slate-800">{lead.creditScore}</div>
                         </div>
                         <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col justify-between">
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Est. Value</span>
                            <div className="text-xl font-black text-emerald-600 truncate">{formatIDR(lead.expectedValue).replace('Rp', '')}</div>
                         </div>
                    </div>

                    {/* AI Insight */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-5">
                            <Sparkles className="w-24 h-24 text-indigo-600" />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-indigo-600" /> FinAI Insight
                        </h4>
                        
                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Propensity Reason</label>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                    {lead.propensityReason}. High correlation with <span className="font-bold text-indigo-600">{lead.productAffinity}</span> product suite.
                                </p>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Recommended Action</label>
                                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-xs font-bold">
                                    <Clock className="w-4 h-4" /> Call between {lead.bestTimeToCall} for 45% higher conversion.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Mock */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Contact Details</h4>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500"><Phone className="w-4 h-4" /></div>
                                    <span className="text-xs font-bold text-slate-600">+62 812-3456-7890</span>
                                </div>
                                <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">Verified</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500"><Mail className="w-4 h-4" /></div>
                                    <span className="text-xs font-bold text-slate-600">prospect.lead@{lead.source.toLowerCase().replace(' ', '')}.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                        <button className="py-4 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" /> Call Now
                        </button>
                        <button className="py-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4" /> WhatsApp
                        </button>
                        <button className="col-span-2 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                             <FileText className="w-4 h-4" /> Generate Proposal PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CUSTOMER DETAIL PANEL ---
interface CustomerDetailProps {
    customer: Customer360;
    onClose: () => void;
}

const CustomerDetailPanel: React.FC<CustomerDetailProps> = ({ customer, onClose }) => {
    const [actionStatus, setActionStatus] = useState<{
        call: 'IDLE' | 'PROCESSING' | 'COMPLETED';
        email: 'IDLE' | 'PROCESSING' | 'COMPLETED';
        campaign: 'IDLE' | 'PROCESSING' | 'COMPLETED';
    }>({ call: 'IDLE', email: 'IDLE', campaign: 'IDLE' });

    const formatIDR = (val: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val));
    
    const portfolioData = [
        { name: 'Savings', value: customer.portfolio.savings },
        { name: 'Deposits', value: customer.portfolio.deposits },
        { name: 'Invest', value: customer.portfolio.investment },
        { name: 'Insur', value: customer.portfolio.insurance },
        { name: 'Loans', value: customer.portfolio.loans },
    ].filter(i => i.value > 0);

    const totalAUM = Object.values(customer.portfolio).reduce((a: number, b: number) => a + b, 0);

    const handleAction = (type: 'call' | 'email' | 'campaign') => {
        if (actionStatus[type] !== 'IDLE') return;

        setActionStatus(prev => ({ ...prev, [type]: 'PROCESSING' }));
        
        setTimeout(() => {
            setActionStatus(prev => ({ ...prev, [type]: 'COMPLETED' }));
            setTimeout(() => {
                 setActionStatus(prev => ({ ...prev, [type]: 'IDLE' }));
            }, 3000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-slide-left overflow-y-auto border-l border-slate-200">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                customer.tier === 'Priority' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                customer.tier === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>{customer.tier} Tier</span>
                            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Activity className="w-3 h-3" />
                                {customer.id}
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">{customer.name}</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><HistoryIcon className="w-3.5 h-3.5 text-slate-400" /> Last Interaction: {customer.lastInteraction}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    
                    {/* Churn Risk & Engagement */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                            customer.churnRisk > 50 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
                        }`}>
                             <div className="flex items-center justify-between mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${
                                    customer.churnRisk > 50 ? 'text-rose-500' : 'text-emerald-500'
                                }`}>Churn Probability</span>
                                {customer.churnRisk > 50 ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                             </div>
                             <div className="flex items-end gap-2">
                                <span className={`text-3xl font-black ${
                                    customer.churnRisk > 50 ? 'text-rose-600' : 'text-emerald-600'
                                }`}>{customer.churnRisk}%</span>
                                <span className="text-[10px] font-bold text-slate-400 mb-1">
                                    {customer.riskTrend === 'UP' ? 'Trending Up' : 'Trending Down'}
                                </span>
                             </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wallet Share</span>
                                <Wallet className="w-4 h-4 text-indigo-500" />
                             </div>
                             <div className="flex items-end gap-2">
                                <span className="text-3xl font-black text-slate-800">{customer.walletSharePct}%</span>
                                <div className="h-1.5 w-16 bg-slate-100 rounded-full mb-2 overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${customer.walletSharePct}%` }}></div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Portfolio Breakdown */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <PieChartIcon className="w-4 h-4 text-slate-400" /> Total AUM Breakdown
                            </h3>
                            <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                                {formatIDR(totalAUM)}
                            </span>
                        </div>
                        <div className="h-[200px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie 
                                        data={portfolioData} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        {portfolioData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => formatIDR(value)} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Retention Strategy */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">AI Retention Intelligence</h4>
                        </div>
                        
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Risk Factors</label>
                                <div className="flex flex-wrap gap-2">
                                    {customer.riskFactors.map((rf, i) => (
                                        <span key={i} className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                                            {rf}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Behavioral Prediction</label>
                                <p className="text-xs font-medium text-slate-700">{customer.lifeEventPrediction} detected. Persona identified as <span className="font-bold text-indigo-600">{customer.persona}</span>.</p>
                            </div>

                            <div className="pt-2">
                                <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Next Best Action</label>
                                <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-emerald-100 text-emerald-700 text-xs font-bold shadow-sm">
                                    <Target className="w-4 h-4" /> 
                                    {customer.nba}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                         <button 
                            onClick={() => handleAction('call')}
                            disabled={actionStatus.call !== 'IDLE'}
                            className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                                actionStatus.call === 'COMPLETED' ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                                actionStatus.call === 'PROCESSING' ? 'bg-indigo-400 text-white cursor-wait' :
                                'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                            }`}
                         >
                             {actionStatus.call === 'PROCESSING' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                              actionStatus.call === 'COMPLETED' ? <><CheckCircle2 className="w-4 h-4" /> Initiated</> : 
                              <><PhoneCall className="w-4 h-4" /> Call Client</>}
                         </button>

                         <button 
                            onClick={() => handleAction('email')}
                            disabled={actionStatus.email !== 'IDLE'}
                            className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                                actionStatus.email === 'COMPLETED' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                actionStatus.email === 'PROCESSING' ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-wait' :
                                'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                         >
                             {actionStatus.email === 'PROCESSING' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                              actionStatus.email === 'COMPLETED' ? <><CheckCircle2 className="w-4 h-4" /> Sent</> : 
                              <><Send className="w-4 h-4" /> Email Offer</>}
                         </button>

                         <button 
                            onClick={() => handleAction('campaign')}
                            disabled={actionStatus.campaign !== 'IDLE'}
                            className={`col-span-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                                actionStatus.campaign === 'COMPLETED' ? 'bg-slate-800 text-emerald-400 shadow-slate-200' :
                                actionStatus.campaign === 'PROCESSING' ? 'bg-emerald-400 text-white cursor-wait' :
                                'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100'
                            }`}
                         >
                             {actionStatus.campaign === 'PROCESSING' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                              actionStatus.campaign === 'COMPLETED' ? <><Zap className="w-4 h-4 fill-current" /> Campaign Active</> : 
                              <><Zap className="w-4 h-4" /> Execute Retention Campaign</>}
                         </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- SEGMENT ANALYSIS MODAL ---
interface SegmentAnalysisProps {
    segment: SegmentGroup;
    onClose: () => void;
}

const SegmentAnalysisModal: React.FC<SegmentAnalysisProps> = ({ segment, onClose }) => {
    const formatIDR = (val: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val));
    
    // Derived Mock Data for Visualization
    const totalAUM = segment.count * segment.avgValue;
    const churnTrendData = [
        { month: 'Jan', rate: segment.riskLevel === 'HIGH' ? 12 : 2 },
        { month: 'Feb', rate: segment.riskLevel === 'HIGH' ? 14 : 2.2 },
        { month: 'Mar', rate: segment.riskLevel === 'HIGH' ? 18 : 2.1 },
        { month: 'Apr', rate: segment.riskLevel === 'HIGH' ? 22 : 1.8 },
        { month: 'May', rate: segment.riskLevel === 'HIGH' ? 25 : 1.5 },
        { month: 'Jun', rate: segment.riskLevel === 'HIGH' ? 28 : 1.2 },
    ];

    const riskFactors = [
        { name: 'Rate Competitiveness', value: 45 },
        { name: 'Service Quality', value: 30 },
        { name: 'Competitor Offer', value: 15 },
        { name: 'Life Event', value: 10 },
    ];

    const mockMembers = [
        { name: 'Aditya W', balance: segment.avgValue * 1.2, risk: segment.riskLevel === 'HIGH' ? 85 : 12 },
        { name: 'Sarah J', balance: segment.avgValue * 0.9, risk: segment.riskLevel === 'HIGH' ? 78 : 5 },
        { name: 'Budi P', balance: segment.avgValue * 1.0, risk: segment.riskLevel === 'HIGH' ? 65 : 8 },
        { name: 'Citra L', balance: segment.avgValue * 1.5, risk: segment.riskLevel === 'HIGH' ? 92 : 2 },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl animate-slide-up flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shadow-lg ${
                            segment.riskLevel === 'HIGH' ? 'bg-rose-500 text-white shadow-rose-200' : 
                            segment.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-emerald-500 text-white shadow-emerald-200'
                        }`}>
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">{segment.name}</h2>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                    segment.riskLevel === 'HIGH' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    segment.riskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>{segment.riskLevel} RISK SEGMENT</span>
                            </div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Total Segment Value: {formatIDR(totalAUM)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Population Count</div>
                            <div className="text-3xl font-black text-slate-800 tracking-tight">{segment.count}</div>
                            <div className="text-[9px] font-bold text-slate-400 mt-1">Accounts</div>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Asset Value</div>
                            <div className="text-xl font-black text-slate-800 tracking-tight truncate">{formatIDR(segment.avgValue)}</div>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Predicted Churn Rate</div>
                            <div className={`text-3xl font-black tracking-tight ${
                                segment.riskLevel === 'HIGH' ? 'text-rose-600' : 'text-emerald-600'
                            }`}>{segment.riskLevel === 'HIGH' ? '28.4%' : '1.2%'}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Retention Trend Chart */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Retention Stability Trend</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={churnTrendData}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={segment.riskLevel === 'HIGH' ? '#f43f5e' : '#10b981'} stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor={segment.riskLevel === 'HIGH' ? '#f43f5e' : '#10b981'} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="rate" stroke={segment.riskLevel === 'HIGH' ? '#f43f5e' : '#10b981'} strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                         {/* Risk Factor Breakdown */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Primary Risk Drivers</h3>
                            <div className="space-y-4">
                                {riskFactors.map((factor, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                            <span>{factor.name}</span>
                                            <span>{factor.value}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-800 rounded-full" style={{ width: `${factor.value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Strategy & Members */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <BrainCircuit className="w-24 h-24 text-white" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-indigo-300" />
                                    <h3 className="text-sm font-black uppercase tracking-widest">AI Strategy</h3>
                                </div>
                                <p className="text-sm leading-relaxed opacity-90 font-medium border-l-2 border-indigo-500 pl-4">
                                    {segment.strategy}
                                </p>
                                <button className="mt-6 w-full py-3 bg-white text-indigo-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                                    Generate Campaign
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Sample Segment Members</h3>
                            </div>
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-50">
                                    {mockMembers.map((member, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-xs font-bold text-slate-700">{member.name}</td>
                                            <td className="px-6 py-3 text-xs font-medium text-slate-500">{formatIDR(member.balance)}</td>
                                            <td className="px-6 py-3">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                                    member.risk > 50 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {member.risk}% Risk
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- CAMPAIGN REPORT MODAL ---
interface CampaignReportProps {
  campaign: Campaign;
  onClose: () => void;
}

const CampaignReportModal: React.FC<CampaignReportProps> = ({ campaign, onClose }) => {
    const [downloading, setDownloading] = useState(false);
    
    // Mock data generation based on campaign ID for consistency
    const seed = campaign.id.charCodeAt(0);
    const channelData = [
        { name: 'Telesales', value: 45 + (seed % 10) },
        { name: 'Email', value: 25 + (seed % 5) },
        { name: 'SMS', value: 15 + (seed % 5) },
        { name: 'Social', value: 100 - (45 + 25 + 15 + (seed % 20)) }
    ];
    
    const performanceTrend = [
        { day: 'W1', leads: 120, conversions: 12 },
        { day: 'W2', leads: 250, conversions: 28 },
        { day: 'W3', leads: 480, conversions: 55 },
        { day: 'W4', leads: 310, conversions: 42 },
        { day: 'W5', leads: 520, conversions: 89 },
    ];

    const handleDownload = () => {
        setDownloading(true);
        setTimeout(() => setDownloading(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl animate-slide-up flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">{campaign.name}</h2>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                    campaign.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>{campaign.status}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Report Generated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                             <Share2 className="w-5 h-5" />
                         </button>
                         <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                             <Printer className="w-5 h-5" />
                         </button>
                         <button 
                             onClick={onClose}
                             className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                         >
                             <X className="w-5 h-5" />
                         </button>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 bg-slate-50/30">
                    
                    {/* Top KPIs */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">Rp {(campaign.stats?.roi || 0) * 15000000 / 100}M</div>
                            <div className="text-[9px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> +12.5% vs Target
                            </div>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost Per Acquisition</div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">Rp 85,000</div>
                            <div className="text-[9px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" /> -5.2% Efficient
                            </div>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROI</div>
                            <div className="text-2xl font-black text-indigo-600 tracking-tight">{campaign.stats?.roi}%</div>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</div>
                            <div className="text-2xl font-black text-emerald-500 tracking-tight">{campaign.stats?.conversionRate}%</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {/* Channel Performance */}
                        <div className="col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Channel Contribution</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie data={channelData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {channelData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-2 mt-4">
                                {channelData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                            <span className="font-bold text-slate-600">{item.name}</span>
                                        </div>
                                        <span className="font-black text-slate-800">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trend Chart */}
                        <div className="col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Weekly Conversion Trend</h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                                        <Line type="monotone" dataKey="leads" stroke="#e2e8f0" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* AI Executive Summary */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BrainCircuit className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                <h3 className="text-sm font-black text-indigo-200 uppercase tracking-widest">AI Executive Summary</h3>
                            </div>
                            <p className="text-sm leading-relaxed opacity-90 font-medium max-w-2xl">
                                Campaign <span className="text-white font-bold">{campaign.name}</span> is outperforming historical benchmarks by 18%. 
                                Telesales channel shows highest conversion quality, particularly with the "Priority" segment. 
                                Recommended action: Increase budget allocation to telesales for remaining duration and retarget non-converters via Email with a sweetened offer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        Generated by ProofPoint.AI Intelligence Engine
                    </div>
                    <button 
                        onClick={handleDownload}
                        disabled={downloading}
                        className={`px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${
                            downloading ? 'bg-emerald-500 text-white cursor-default' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200'
                        }`}
                    >
                        {downloading ? (
                            <><CheckCircle2 className="w-4 h-4 animate-bounce" /> Report Downloaded</>
                        ) : (
                            <><Download className="w-4 h-4" /> Download PDF Report</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface CRMDashboardProps {
    campaigns?: Campaign[];
}

export const CRMDashboard: React.FC<CRMDashboardProps> = ({ campaigns = [] }) => {
  const [activeTab, setActiveTab] = useState<'ACQUISITION' | 'RETENTION' | 'CAMPAIGNS'>('ACQUISITION');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer360 | null>(null);
  const [reportCampaign, setReportCampaign] = useState<Campaign | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<SegmentGroup | null>(null);
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);
  const [showForecastResult, setShowForecastResult] = useState(false);
  
  const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');

  const formatIDR = (val: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val));

  const handleGenerateForecast = () => {
      setIsGeneratingForecast(true);
      setTimeout(() => {
          setIsGeneratingForecast(false);
          setShowForecastResult(true);
          setTimeout(() => setShowForecastResult(false), 4000);
      }, 2000);
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

  return (
    <div className="space-y-8 animate-fade-in pb-20 relative">
      {/* LEAD DETAIL PANEL OVERLAY */}
      {selectedLead && (
          <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      {/* CUSTOMER DETAIL PANEL OVERLAY */}
      {selectedCustomer && (
          <CustomerDetailPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
      
      {/* CAMPAIGN REPORT MODAL OVERLAY */}
      {reportCampaign && (
          <CampaignReportModal campaign={reportCampaign} onClose={() => setReportCampaign(null)} />
      )}

      {/* SEGMENT ANALYSIS MODAL OVERLAY */}
      {selectedSegment && (
          <SegmentAnalysisModal segment={selectedSegment} onClose={() => setSelectedSegment(null)} />
      )}

      {/* FORECAST TOAST/OVERLAY */}
      {showForecastResult && (
          <div className="fixed bottom-10 right-10 z-[70] bg-slate-900 text-white p-6 rounded-2xl shadow-2xl animate-slide-up flex items-center gap-4 max-w-sm border border-slate-800">
              <div className="p-3 bg-emerald-500 rounded-full text-white">
                  <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                  <h4 className="text-sm font-black uppercase tracking-wider mb-1">Forecast Ready</h4>
                  <p className="text-xs text-slate-300">Retention simulation completed. +12% projected uplift with current strategy.</p>
              </div>
          </div>
      )}

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
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTab('ACQUISITION')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'ACQUISITION' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Acquisition (Hunt)
          </button>
          <button 
            onClick={() => setActiveTab('RETENTION')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'RETENTION' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Retention (Farm)
          </button>
           <button 
            onClick={() => setActiveTab('CAMPAIGNS')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'CAMPAIGNS' ? 'bg-white text-pink-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Campaign Performance
          </button>
        </div>
      </div>

      {activeTab === 'ACQUISITION' ? (
        <div className="space-y-8 animate-fade-in">
            {/* TOP INTELLIGENCE ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    {/* Live Campaign Tracker Widget */}
                    {activeCampaign ? (
                        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm relative group overflow-hidden">
                             <div className="absolute top-0 right-0 p-3">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live Campaign</span>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-3 mb-4 mt-2">
                                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200">
                                    <Rocket className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-slate-800 truncate">{activeCampaign.name}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{activeCampaign.productType}</p>
                                </div>
                             </div>

                             {activeCampaign.stats && (
                                 <div className="space-y-3">
                                     <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ROI Yield</span>
                                        <span className="text-xl font-black text-emerald-600">{activeCampaign.stats.roi}%</span>
                                     </div>
                                     <div className="grid grid-cols-2 gap-2">
                                         <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                             <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Conv. Rate</div>
                                             <div className="text-sm font-black text-indigo-600">{activeCampaign.stats.conversionRate}%</div>
                                         </div>
                                         <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Acceptance</div>
                                            <div className="text-sm font-black text-emerald-600">{activeCampaign.stats.acceptanceRate}%</div>
                                         </div>
                                     </div>
                                 </div>
                             )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-6 border border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center text-center py-10">
                            <Rocket className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Active Campaign</p>
                            <p className="text-[9px] text-slate-300">Set active in Management</p>
                        </div>
                    )}

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
                                        <button 
                                            onClick={() => setSelectedLead(lead)}
                                            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                                        >
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
      ) : activeTab === 'RETENTION' ? (
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
                              <div 
                                key={customer.id} 
                                onClick={() => setSelectedCustomer(customer)}
                                className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex items-center justify-between group hover:border-rose-200 hover:shadow-xl transition-all cursor-pointer"
                              >
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-lg border border-rose-100">
                                          {customer.name[0]}
                                      </div>
                                      <div>
                                          <div className="text-sm font-black text-slate-800 leading-none mb-1">{customer.name}</div>
                                          <div className="flex items-center gap-1.5">
                                              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Risk: {customer.churnRisk}%</span>
                                              {customer.riskTrend === 'UP' ? <ArrowUpNarrowWide className="w-3.5 h-3.5 text-rose-500" /> : customer.riskTrend === 'DOWN' ? <ArrowDownNarrowWide className="w-3.5 h-3.5 text-emerald-500" /> : <Minus className="w-3.5 h-3.5 text-slate-300" />}
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
                      <div 
                        key={cust.id} 
                        onClick={() => setSelectedCustomer(cust)}
                        className="group bg-white border border-slate-100 rounded-[44px] p-8 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all duration-700 flex flex-col relative overflow-hidden cursor-pointer"
                      >
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
                              <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(cust);
                                }}
                                className="p-4 bg-slate-900 text-white rounded-[24px] hover:bg-emerald-600 hover:scale-110 transition-all shadow-xl active:scale-95 group-hover:shadow-emerald-100"
                              >
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
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v: any) => `Rp${Number(v)/1000000}M`} tick={{ fontSize: 10, fontWeight: 'bold' }} />
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
                        <div 
                            key={idx} 
                            onClick={() => setSelectedSegment(segment)}
                            className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all group cursor-pointer shadow-sm hover:shadow-md"
                        >
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
                <button 
                    onClick={handleGenerateForecast}
                    disabled={isGeneratingForecast}
                    className="w-full py-5 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest mt-8 flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isGeneratingForecast ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowUpRight className="w-4 h-4" /> Generate Segment Forecast</>}
                </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
           {/* CAMPAIGN PERFORMANCE DASHBOARD */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* MAIN CHART */}
               <div className="lg:col-span-2 bg-white rounded-[44px] p-10 border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl"><Megaphone className="w-6 h-6" /></div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Multi-Channel Campaign Performance</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ROI & Conversion Rate Comparison</p>
                            </div>
                        </div>
                   </div>
                   <div className="h-[350px]">
                       <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={sortedCampaigns} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'black', fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={60} />
                               <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                               <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                               <Tooltip 
                                  cursor={{ fill: '#f8fafc' }} 
                                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }} 
                                  formatter={(value, name) => [
                                      name === 'ROI' ? <span className="text-emerald-600 font-black">{value}%</span> : <span className="text-indigo-600 font-black">{value}%</span>,
                                      name === 'stats.roi' ? 'ROI Yield' : 'Conversion Rate'
                                  ]}
                                  labelStyle={{ color: '#64748b', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}
                               />
                               <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                               <Bar yAxisId="left" dataKey="stats.roi" name="ROI Yield" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                               <Bar yAxisId="right" dataKey="stats.conversionRate" name="Conversion Rate" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                           </BarChart>
                       </ResponsiveContainer>
                   </div>
               </div>

               {/* SIDE STATS */}
               <div className="space-y-6">
                  {/* Aggregate Summary */}
                   <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                             <Rocket className="w-32 h-32 text-white" />
                        </div>
                        <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6">Total Impact</h4>
                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="text-4xl font-black tracking-tighter mb-1">
                                    {sortedCampaigns.reduce((acc, c) => acc + (c.stats?.leadsTargeted || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Leads Targeted</div>
                            </div>
                            <div className="h-px w-full bg-slate-700"></div>
                            <div>
                                <div className="text-4xl font-black tracking-tighter mb-1 text-emerald-400">
                                    {Math.round(sortedCampaigns.reduce((acc, c) => acc + (c.stats?.roi || 0), 0) / sortedCampaigns.length)}%
                                </div>
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Avg. Campaign ROI</div>
                            </div>
                        </div>
                   </div>

                   {/* Active Campaign Spotlight */}
                   {activeCampaign && (
                       <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
                           <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</span>
                               </div>
                               <Rocket className="w-4 h-4 text-emerald-500" />
                           </div>
                           <h4 className="font-black text-slate-800 text-sm mb-1">{activeCampaign.name}</h4>
                           <div className="text-[10px] text-slate-400 font-bold uppercase mb-6">{activeCampaign.productType}</div>
                           
                           <div className="space-y-3">
                               <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                                   <span>Conversion</span>
                                   <span className="text-indigo-600">{activeCampaign.stats?.conversionRate}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500" style={{ width: `${(activeCampaign.stats?.conversionRate || 0) * 3}%` }}></div>
                               </div>
                               
                               <div className="flex justify-between items-center text-xs font-bold text-slate-600 pt-2">
                                   <span>Acceptance</span>
                                   <span className="text-emerald-600">{activeCampaign.stats?.acceptanceRate}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-500" style={{ width: `${activeCampaign.stats?.acceptanceRate}%` }}></div>
                               </div>
                           </div>
                       </div>
                   )}
               </div>
           </div>

           {/* DETAILED METRICS GRID */}
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {sortedCampaigns.map((camp) => (
                   <div key={camp.id} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col">
                       <div className="flex items-start justify-between mb-6">
                           <div className="flex items-center gap-3">
                               <div className={`p-3 rounded-2xl ${camp.status === 'ACTIVE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                                   {camp.productType.includes('Loan') ? <Landmark className="w-5 h-5" /> : 
                                    camp.productType.includes('Card') ? <CreditCard className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                               </div>
                               <div>
                                   <div className="text-xs font-black text-slate-800 mb-0.5 max-w-[150px] truncate" title={camp.name}>{camp.name}</div>
                                   <div className="text-[9px] font-bold text-slate-400 uppercase">{camp.status}</div>
                               </div>
                           </div>
                           <div className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-lg">
                               {camp.uploadDate.toLocaleDateString()}
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 mb-6">
                           <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                               <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">ROI</div>
                               <div className="text-lg font-black text-emerald-600">{camp.stats?.roi}%</div>
                           </div>
                           <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Leads</div>
                               <div className="text-lg font-black text-slate-700">{camp.stats?.leadsTargeted.toLocaleString()}</div>
                           </div>
                       </div>
                       
                       <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>File: {camp.fileName.substring(0, 15)}...</span>
                           <button 
                                onClick={() => setReportCampaign(camp)}
                                className="text-indigo-600 hover:underline hover:text-indigo-800 transition-colors"
                           >
                               View Report
                           </button>
                       </div>
                   </div>
               ))}
           </div>
        </div>
      )}
    </div>
  );
};
