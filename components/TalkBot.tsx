
import React, { useState, useEffect } from 'react';
import { 
  Bot, CalendarClock, Phone, PhoneForwarded, 
  CheckCircle2, AlertCircle, Plus, Search, 
  MoreHorizontal, Play, FileText, ArrowRight,
  Clock, Mic2, X, Loader2, Signal, BookOpen,
  BrainCircuit, Database, Rocket,
  PieChart as PieChartIcon, ThumbsUp, ThumbsDown,
  TrendingUp, BarChart3, ListFilter, User, LayoutList
} from 'lucide-react';
import { BotCall, CallAnalysis, Customer360, KnowledgeDocument, Campaign } from '../types';
import { Dashboard } from './Dashboard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TalkBotProps {
  customers: Customer360[];
  knowledgeDocs: KnowledgeDocument[];
  campaigns: Campaign[];
}

export const TalkBot: React.FC<TalkBotProps> = ({ customers, knowledgeDocs, campaigns }) => {
  const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'ANALYTICS'>('SCHEDULE');
  
  // Note: Knowledge logic is handled centrally. 
  // The bot simulation below uses 'activeCampaign' to demonstrate context awareness without needing to display the docs here.

  // Generate analysis based on whether there is an active campaign or not
  const generateLiveAnalysis = (customerName: string, topic: string): CallAnalysis => {
    const isPositive = Math.random() > 0.4; // Slightly higher chance of success for demo
    const isCampaignCall = !!activeCampaign;
    
    // Customize transcript based on campaign presence
    const introText = isCampaignCall 
      ? `Good morning ${customerName}, I'm calling from Premier Bank with a special offer for our new ${activeCampaign.name}.`
      : `Good morning, am I speaking with ${customerName}?`;

    const pitchText = isCampaignCall
      ? `This ${activeCampaign.productType} comes with a special rate available only for our selected customers this month.`
      : `I'm calling regarding your ${topic}. Do you have a moment?`;

    const closingText = isPositive 
      ? (isCampaignCall ? `Great! I've marked your interest in ${activeCampaign.name}. An agent will finalize the ${activeCampaign.productType} details.` : `Great! We have a special offer to lower your interest rate.`)
      : `I understand, I will call back later.`;

    const positiveReasons = [
      "Customer interested in low interest rate",
      "Customer needs product for upcoming renovation",
      "Customer accepted term condition",
      "Customer asked for follow up next week"
    ];

    const negativeReasons = [
      "Customer hung up immediately",
      "Customer stated they are busy/in meeting",
      "Customer already has competitor product",
      "Customer not interested in loan offers"
    ];

    const reason = isPositive 
      ? positiveReasons[Math.floor(Math.random() * positiveReasons.length)]
      : negativeReasons[Math.floor(Math.random() * negativeReasons.length)];

    return {
      transcriptSegments: [
        { speaker: 'TalkBot AI', text: introText, timestamp: '00:02' },
        { speaker: 'Customer', text: 'Yes, this is he. Who is calling?', timestamp: '00:05' },
        { speaker: 'TalkBot AI', text: pitchText, timestamp: '00:08' },
        { speaker: 'Customer', text: isPositive ? 'Sure, tell me more.' : 'I am busy right now.', timestamp: '00:12' },
        { speaker: 'TalkBot AI', text: closingText, timestamp: '00:15' }
      ],
      summary: isCampaignCall 
        ? `Bot executed outreach for Active Campaign: ${activeCampaign.name}. Customer response was ${isPositive ? 'Positive' : 'Negative'}.`
        : `Bot initiated call regarding ${topic}. Customer was ${isPositive ? 'receptive' : 'busy'}.`,
      qualityScore: isPositive ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 20) + 60,
      sentiment: isPositive ? 'POSITIVE' : 'NEGATIVE',
      sentimentReasoning: reason,
      nextBestActions: isPositive ? ['Send Email Offer', 'Schedule Follow-up'] : ['Retry in 24h'],
      complianceChecklist: [
        { category: 'Identity Verification', status: 'PASS', details: 'Bot verified name.' },
        { category: 'Product Disclosure', status: 'PASS', details: isCampaignCall ? 'Campaign terms mentioned.' : 'Standard disclosure read.' }
      ],
      glossaryUsed: [],
      extractedInfo: {
        customerName: customerName,
        productName: isCampaignCall ? activeCampaign.productType : topic,
        dateOfBirth: '1980-01-01',
        identityNumber: '1234567890',
        motherMaidenName: 'Unknown',
        bankAccountNumber: '***5555',
        targetBankName: 'Premier Bank',
        contributionAmount: '0',
        phoneNumber: '08123456789',
        emailAddress: 'customer@email.com',
        occupation: 'Private',
        residentialAddress: 'Jakarta',
        customerAgreed: isPositive,
        loanAmount: '0',
        monthlyInstallment: '0',
        installmentDuration: '0',
        adminFee: '0',
        interestRate: '0',
        crossSellProduct: 'None'
      },
      conversationStats: {
        agentTalkTimePct: 60,
        customerTalkTimePct: 40,
        wordsPerMinute: 130,
        interruptionCount: 0,
        effectivenessRating: 'OPTIMAL',
        feedback: 'Bot followed flow perfectly.'
      },
      agentPerformance: {
        empathyScore: 85,
        clarityScore: 100,
        persuasionScore: 90,
        productKnowledgeScore: 100,
        closingSkillScore: 80,
        verdict: 'STAR_PERFORMER',
        strengths: ['Script Adherence', 'Clarity'],
        weaknesses: ['Lack of emotional nuance']
      },
      genderProfile: {
        agentGender: 'UNKNOWN',
        customerGender: 'MALE',
        reasoning: 'Bot synthetic voice.'
      }
    };
  };

  // Initial State Data (Historical)
  const [calls, setCalls] = useState<BotCall[]>([
    {
      id: '1',
      customerName: 'Bapak Ahmad',
      phoneNumber: '+62 812 5555 0001',
      topic: 'Credit Card Limit Increase',
      scheduledTime: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'COMPLETED',
      duration: '02:14',
      result: generateLiveAnalysis('Bapak Ahmad', 'Credit Card Limit Increase')
    },
    {
      id: '2',
      customerName: 'Ibu Maya',
      phoneNumber: '+62 812 5555 0002',
      topic: 'Loan Payment Reminder',
      scheduledTime: new Date(Date.now() + 1800000), // In 30 mins
      status: 'SCHEDULED'
    },
    {
      id: '3',
      customerName: 'Bapak Kevin',
      phoneNumber: '+62 812 5555 0003',
      topic: 'Promo Offer',
      scheduledTime: new Date(Date.now() + 7200000), // In 2 hours
      status: 'SCHEDULED'
    },
    // Add some completed calls for the dashboard data
    {
        id: '4', customerName: 'Siti Rahma', phoneNumber: '+62 813 5555 0004', topic: 'Promo Offer',
        scheduledTime: new Date(Date.now() - 7200000), status: 'COMPLETED', duration: '01:20',
        result: { ...generateLiveAnalysis('Siti Rahma', 'Promo Offer'), sentiment: 'NEGATIVE', sentimentReasoning: 'Customer hung up immediately' }
    },
    {
        id: '5', customerName: 'Budi Hartono', phoneNumber: '+62 811 5555 0005', topic: 'Promo Offer',
        scheduledTime: new Date(Date.now() - 10800000), status: 'COMPLETED', duration: '03:45',
        result: { ...generateLiveAnalysis('Budi Hartono', 'Promo Offer'), sentiment: 'POSITIVE', sentimentReasoning: 'Customer interested in low interest rate' }
    }
  ]);

  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedResult, setSelectedResult] = useState<CallAnalysis | null>(null);
  
  const [newCustomer, setNewCustomer] = useState('');
  const [newTopic, setNewTopic] = useState('Payment Reminder');
  const [newTime, setNewTime] = useState('');

  // ANALYTICS DATA CALCULATION
  const completedCalls = calls.filter(c => c.status === 'COMPLETED' && c.result);
  const successfulCalls = completedCalls.filter(c => c.result?.sentiment === 'POSITIVE');
  const failedCalls = completedCalls.filter(c => c.result?.sentiment !== 'POSITIVE');
  
  const successCount = successfulCalls.length;
  const failCount = failedCalls.length;
  const successRate = completedCalls.length > 0 ? Math.round((successCount / completedCalls.length) * 100) : 0;
  
  const chartData = [
    { name: 'Successful Acquisition', value: successCount },
    { name: 'Failed/Rejected', value: failCount },
  ];
  const COLORS = ['#10b981', '#f43f5e'];

  const handleSchedule = () => {
    if (!newCustomer || !newTime) return;
    const cust = customers.find(c => c.id === newCustomer);
    const newCall: BotCall = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: cust ? cust.name : 'Unknown',
      phoneNumber: '+62 812 0000 0000',
      topic: newTopic,
      scheduledTime: new Date(newTime),
      status: 'SCHEDULED'
    };
    setCalls(prev => [...prev, newCall]);
    setIsScheduling(false);
    setNewCustomer('');
    setNewTime('');
  };

  const simulateCall = (callId: string) => {
    setCalls(prev => prev.map(c => c.id === callId ? { ...c, status: 'DIALING' } : c));
    setTimeout(() => {
        setCalls(prev => prev.map(c => {
            if (c.id === callId) {
                return {
                    ...c,
                    status: 'COMPLETED',
                    duration: '01:45',
                    result: generateLiveAnalysis(c.customerName, c.topic)
                };
            }
            return c;
        }));
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      
      {/* RESULT MODAL */}
      {selectedResult && (
        <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex justify-center items-end sm:items-center p-4">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
                <div className="bg-slate-900 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500 rounded-xl">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-lg">Bot Interaction Analysis</h3>
                            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Automated Call Audit</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedResult(null)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50">
                    <Dashboard data={selectedResult} />
                </div>
            </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {isScheduling && (
          <div className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-800">Schedule Bot Call</h3>
                      <button onClick={() => setIsScheduling(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-black text-slate-500 uppercase mb-2">Customer</label>
                          <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                            value={newCustomer}
                            onChange={(e) => setNewCustomer(e.target.value)}
                          >
                              <option value="">Select Customer</option>
                              {customers.map(c => (
                                  <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-black text-slate-500 uppercase mb-2">Topic</label>
                          <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                          >
                              <option>Payment Reminder</option>
                              <option>Credit Card Limit Increase</option>
                              <option>Promo Offer</option>
                              <option>KYC Update</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-black text-slate-500 uppercase mb-2">Time</label>
                          <input 
                            type="datetime-local" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                          />
                      </div>
                      <button 
                        onClick={handleSchedule}
                        className="w-full py-4 bg-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 mt-4"
                      >
                          Confirm Schedule
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* HEADER WITH TABS */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="p-4 bg-cyan-500 text-white rounded-2xl shadow-lg shadow-cyan-200">
                    <Bot className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">TalkBot AI Manager</h1>
                    <p className="text-slate-500 font-medium text-sm">Automated Outbound Calling & Compliance</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="px-5 py-2 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-lg font-black leading-none">{calls.filter(c => c.status === 'COMPLETED').length}</span>
                    <span className="text-[8px] font-bold uppercase text-slate-400">Completed</span>
                </div>
                <button 
                  onClick={() => setIsScheduling(true)}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cyan-100 transition-all"
                >
                    <Plus className="w-4 h-4" /> Schedule Call
                </button>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('SCHEDULE')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === 'SCHEDULE' 
                    ? 'bg-white text-cyan-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                 <LayoutList className="w-4 h-4" /> Call Schedule
              </button>
              <button 
                onClick={() => setActiveTab('ANALYTICS')}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === 'ANALYTICS' 
                    ? 'bg-white text-cyan-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                 <PieChartIcon className="w-4 h-4" /> Outcome Analysis
              </button>
          </div>
      </div>

      {/* TAB CONTENT: ANALYTICS */}
      {activeTab === 'ANALYTICS' && (
        completedCalls.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
              {/* Chart Section */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                              <PieChartIcon className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-black text-slate-800">Acquisition Rate</h3>
                      </div>
                      <span className={`text-xl font-black ${successRate >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>{successRate}%</span>
                  </div>
                  
                  <div className="h-48 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={chartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                              >
                                  {chartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip contentStyle={{borderRadius: '12px', border:'none', boxShadow:'0 5px 15px rgba(0,0,0,0.1)'}} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pb-8">
                          <span className="text-3xl font-black text-slate-800">{completedCalls.length}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase">Total Calls</span>
                      </div>
                  </div>
              </div>

              {/* Reasons Breakdown */}
              <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                          <ListFilter className="w-5 h-5" />
                      </div>
                      <div>
                          <h3 className="text-lg font-black text-slate-800">Acquisition Performance Resume</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Customer outcome analysis</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                      {/* Success Reasons */}
                      <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 flex flex-col">
                          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-emerald-100">
                              <ThumbsUp className="w-4 h-4 text-emerald-600" />
                              <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">Successful Leads</h4>
                              <span className="ml-auto bg-emerald-200 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full">{successCount}</span>
                          </div>
                          <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                              {successfulCalls.length > 0 ? successfulCalls.map((call, idx) => (
                                  <div key={idx} className="flex gap-2 items-start p-2 bg-white/60 rounded-lg border border-emerald-100/50">
                                      <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-black flex-shrink-0">
                                          {call.customerName.charAt(0)}
                                      </div>
                                      <div>
                                          <p className="text-xs font-black text-slate-800 leading-snug">{call.customerName}</p>
                                          <p className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">{call.result?.sentimentReasoning || "Successful Acquisition"}</p>
                                      </div>
                                  </div>
                              )) : (
                                  <p className="text-xs text-slate-400 italic">No successful calls yet.</p>
                              )}
                          </div>
                      </div>

                      {/* Failure Reasons */}
                      <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 flex flex-col">
                          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-rose-100">
                              <ThumbsDown className="w-4 h-4 text-rose-500" />
                              <h4 className="text-xs font-black text-rose-700 uppercase tracking-widest">Missed Opportunities</h4>
                              <span className="ml-auto bg-rose-200 text-rose-700 text-[9px] font-black px-2 py-0.5 rounded-full">{failCount}</span>
                          </div>
                           <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                              {failedCalls.length > 0 ? failedCalls.map((call, idx) => (
                                  <div key={idx} className="flex gap-2 items-start p-2 bg-white/60 rounded-lg border border-rose-100/50">
                                      <div className="mt-1 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-[10px] font-black flex-shrink-0">
                                          {call.customerName.charAt(0)}
                                      </div>
                                      <div>
                                          <p className="text-xs font-black text-slate-800 leading-snug">{call.customerName}</p>
                                          <p className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">{call.result?.sentimentReasoning || "Failed Acquisition"}</p>
                                      </div>
                                  </div>
                              )) : (
                                  <p className="text-xs text-slate-400 italic">No failed calls yet.</p>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[32px] border border-dashed border-slate-200 animate-fade-in">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <PieChartIcon className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-400">No Outcome Data</h3>
              <p className="text-xs text-slate-300 font-bold mt-1">Wait for calls to complete to view analysis.</p>
          </div>
        )
      )}

      {/* TAB CONTENT: SCHEDULE */}
      {activeTab === 'SCHEDULE' && (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-slide-up">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-800">Call Schedule</h3>
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search schedule..." className="bg-transparent text-sm font-bold outline-none w-48" />
                </div>
            </div>
            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar min-h-[400px]">
                {calls.sort((a,b) => b.scheduledTime.getTime() - a.scheduledTime.getTime()).map((call) => (
                    <div key={call.id} className="p-6 hover:bg-slate-50 transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                call.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                                call.status === 'DIALING' ? 'bg-cyan-100 text-cyan-600' :
                                'bg-slate-100 text-slate-400'
                            }`}>
                                {call.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> :
                                call.status === 'DIALING' ? <PhoneForwarded className="w-6 h-6 animate-pulse" /> :
                                <CalendarClock className="w-6 h-6" />
                                }
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-sm font-black text-slate-800">{call.customerName}</h4>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                                        call.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        call.status === 'DIALING' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                                        'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>{call.status}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {call.phoneNumber}</span>
                                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {call.topic}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {call.scheduledTime.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {call.status === 'DIALING' && (
                                <div className="flex items-center gap-2 text-cyan-600 text-xs font-black uppercase tracking-widest animate-pulse">
                                    <Signal className="w-4 h-4" /> Dialing Now...
                                </div>
                            )}
                            
                            {call.status === 'SCHEDULED' && (
                                <button 
                                  onClick={() => simulateCall(call.id)}
                                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all flex items-center gap-2"
                                >
                                    <Play className="w-3 h-3" /> Force Start
                                </button>
                            )}

                            {call.status === 'COMPLETED' && (
                                <button 
                                  onClick={() => setSelectedResult(call.result!)}
                                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                                >
                                    View Audit <ArrowRight className="w-3 h-3" />
                                </button>
                            )}
                            
                            <button className="p-2 text-slate-300 hover:text-slate-500"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
