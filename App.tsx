
import React, { useState, useEffect } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Login } from './components/Login';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ComplianceAudit } from './components/ComplianceAudit';
import { TeamAnalytics } from './components/TeamAnalytics';
import { ConversationResume } from './components/ConversationResume';
import { CRMDashboard } from './components/CRMDashboard';
import { AuditTrail } from './components/AuditTrail';
import { analyzeTelemarketingAudio } from './services/geminiService';
import { AnalysisStatus, CallAnalysis, AppView, PiiSettings, DictionaryItem, AuditLog, FullDashboardContext, KnowledgeDocument } from './types';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Users2, 
  ChevronRight,
  User,
  Menu,
  BookOpen,
  EyeOff,
  UserCheck,
  Plus,
  Trash2,
  BookMarked,
  VenetianMask,
  Database,
  Briefcase,
  Activity,
  ShieldAlert,
  Lock as LockIcon,
  ArrowUpRight,
  Globe,
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';

// Shared Mock Data for Context Injection
const MOCK_LEADS = [
  { id: '1', name: 'Budi Santoso', source: 'Facebook Ads', score: 92, status: 'Proposal', category: 'Hot', kycStatus: 'Verified' },
  { id: '2', name: 'Lia Wijaya', source: 'Web Form', score: 78, status: 'Meeting', category: 'Warm', kycStatus: 'Pending' },
  { id: '3', name: 'Andi Pratama', source: 'Referral', score: 85, status: 'Prospect', category: 'Hot', kycStatus: 'Verified' },
  { id: '4', name: 'Santi Putri', source: 'Instagram', score: 45, status: 'Prospect', category: 'Cold', kycStatus: 'Rejected' },
  { id: '5', name: 'Rian Hidayat', source: 'LinkedIn', score: 65, status: 'Meeting', category: 'Warm', kycStatus: 'Verified' },
];

const MOCK_CUSTOMERS = [
  { 
    id: 'C001', name: 'Bapak Ahmad', tier: 'Priority', 
    portfolio: { savings: 150000000, deposits: 500000000, loans: 0, investment: 120000000, insurance: 50000000 },
    churnRisk: 12, riskTrend: 'DOWN', riskFactors: ['Stable Balance', 'Active Investment'],
    lastInteraction: '2 days ago', nba: 'Offer Reksadana Saham',
    persona: 'Wealth Builder', engagementScore: 94, walletSharePct: 65, moodTrend: ['POS', 'POS', 'POS'],
    lifeEventPrediction: 'Retirement (85%)', wealthVelocity: 'RISING'
  },
  { 
    id: 'C002', name: 'Ibu Maya', tier: 'Gold', 
    portfolio: { savings: 45000000, deposits: 0, loans: 250000000, investment: 0, insurance: 10000000 },
    churnRisk: 68, riskTrend: 'UP', riskFactors: ['Large Withdrawal', 'Account Inactivity', 'Loan Delinquency'],
    lastInteraction: '1 month ago', nba: 'Loan Restructuring Call',
    persona: 'Over-leveraged', engagementScore: 24, walletSharePct: 15, moodTrend: ['NEG', 'NEG'],
    lifeEventPrediction: 'Downsizing (60%)', wealthVelocity: 'DECLINING'
  },
  { 
    id: 'C003', name: 'Bapak Kevin', tier: 'Silver', 
    portfolio: { savings: 12000000, deposits: 10000000, loans: 0, investment: 0, insurance: 0 },
    churnRisk: 35, riskTrend: 'STABLE', riskFactors: ['Minimal Activity', 'Competitor Interest Detected'],
    lastInteraction: '1 week ago', nba: 'Credit Card Cross-sell',
    persona: 'Young Saver', engagementScore: 45, walletSharePct: 40, moodTrend: ['NEU', 'POS'],
    lifeEventPrediction: 'Education Loan (75%)', wealthVelocity: 'STABLE'
  },
];

const CRM_STATS = {
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

const TEAM_STATS = {
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

const MOCK_AGENTS = [
  { id: '1', name: 'Sarah Jenkins', avatar: 'SJ', avgScore: 94, callsCount: 128, complianceRate: 99, topSkill: 'Empathy', status: 'Active' },
  { id: '2', name: 'Michael Chen', avatar: 'MC', avgScore: 88, callsCount: 142, complianceRate: 96, topSkill: 'Product Knowledge', status: 'Active' },
  { id: '3', name: 'Aria Stark', avatar: 'AS', avgScore: 82, callsCount: 96, complianceRate: 92, topSkill: 'Persuasion', status: 'Active' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('WORKBENCH');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<CallAnalysis | null>(null);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  
  const [piiSettings, setPiiSettings] = useState<PiiSettings>({
    redactEmail: true,
    redactNIK: true,
    redactMotherName: true,
    redactCustomerName: false,
    redactPhone: true,
    redactDOB: true,
    redactAddress: true,
    enableDiarization: true,
    enableGenderDetection: true
  });
  const [dictionary, setDictionary] = useState<DictionaryItem[]>([]);
  const [newDictItem, setNewDictItem] = useState({ term: '', definition: '', context: '' });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', timestamp: new Date(), user: 'Enterprise Officer', action: 'SYSTEM_LOGIN', resource: 'Secure Portal', status: 'SUCCESS', ipAddress: '192.168.1.104' },
    { id: '2', timestamp: new Date(Date.now() - 500000), user: 'Enterprise Officer', action: 'PII_CONFIG_UPDATE', resource: 'Data Privacy Policy', status: 'WARNING', ipAddress: '192.168.1.104' }
  ]);

  const aggregatedContext = knowledgeDocs.map(doc => `[DOCUMENT: ${doc.name}]\n${doc.content}`).join('\n\n---\n\n');

  const dashboardContext: FullDashboardContext = {
    leads: MOCK_LEADS as any,
    customers: MOCK_CUSTOMERS as any,
    crmStats: CRM_STATS as any,
    teamStats: TEAM_STATS as any,
    agents: MOCK_AGENTS as any,
    currentCallAnalysis: analysisResult,
    piiSettings
  };

  const addAuditLog = (action: string, resource: string, status: 'SUCCESS' | 'WARNING' | 'CRITICAL' = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      user: 'Enterprise Officer',
      action,
      resource,
      status,
      ipAddress: '192.168.1.104'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAudioReady = async (base64Audio: string, mimeType?: string) => {
    setStatus(AnalysisStatus.PROCESSING);
    addAuditLog('CALL_ANALYSIS_STARTED', 'Voice Recording Binary');
    try {
      const result = await analyzeTelemarketingAudio(
        base64Audio, 
        piiSettings, 
        aggregatedContext, 
        dictionary,
        mimeType || 'audio/webm'
      );
      setAnalysisResult(result);
      setStatus(AnalysisStatus.COMPLETE);
      addAuditLog('CALL_ANALYSIS_COMPLETE', `Audit Score: ${result.qualityScore}`);
    } catch (error) {
      setStatus(AnalysisStatus.ERROR);
      addAuditLog('CALL_ANALYSIS_FAILED', 'Service Error', 'CRITICAL');
    }
  };

  const togglePii = (key: keyof PiiSettings) => {
    const newVal = !piiSettings[key];
    setPiiSettings(prev => ({ ...prev, [key]: newVal }));
    addAuditLog('PRIVACY_SETTING_TOGGLED', `${key} -> ${newVal}`, 'WARNING');
  };

  const addDictionaryItem = () => {
    if (!newDictItem.term || !newDictItem.definition) return;
    const newItem: DictionaryItem = { id: Date.now().toString(), ...newDictItem };
    setDictionary(prev => [...prev, newItem]);
    setNewDictItem({ term: '', definition: '', context: '' });
    addAuditLog('DICTIONARY_TERM_ADDED', newItem.term);
  };

  const removeDictionaryItem = (id: string) => {
    const term = dictionary.find(t => t.id === id)?.term;
    setDictionary(prev => prev.filter(item => item.id !== id));
    addAuditLog('DICTIONARY_TERM_REMOVED', term || id, 'WARNING');
  };

  const handleLogout = () => {
    addAuditLog('SYSTEM_LOGOUT', 'Secure Portal');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <Login onLogin={() => setIsAuthenticated(true)} />;

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${currentView === view ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500 transition-colors'}`} />
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      {currentView === view && <ChevronRight className="w-4 h-4 text-indigo-200" />}
    </button>
  );

  const getHeaderTitle = () => {
    switch(currentView) {
      case 'WORKBENCH': return 'Audit Workbench';
      case 'TEAM_ANALYTICS': return 'Team Intelligence';
      case 'CRM_DASHBOARD': return 'CRM Intelligence';
      case 'MANAGEMENT': return 'Management Center';
      case 'AUDIT_TRAIL': return 'Compliance Audit Trail';
      default: return 'OmniAssure';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex overflow-hidden">
      <aside className={`w-72 bg-white border-r border-slate-200 flex flex-col fixed h-screen z-50 transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">OMNIASSURE</h1>
              <span className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest font-black">FinAI PRO</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem view="WORKBENCH" icon={LayoutDashboard} label="Audit Workbench" />
          <NavItem view="TEAM_ANALYTICS" icon={Users2} label="Team Intelligence" />
          <NavItem view="CRM_DASHBOARD" icon={Database} label="CRM Intelligence" />
          <div className="pt-8 px-4 mb-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management</h2>
          </div>
          <NavItem view="MANAGEMENT" icon={Settings} label="Management Center" />
          <NavItem view="AUDIT_TRAIL" icon={Activity} label="Audit Trail" />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600"><User /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">Enterprise Officer</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarVisible ? 'ml-72' : 'ml-0'}`}>
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {getHeaderTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Nodes Active</span>
          </div>
        </nav>

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {currentView === 'WORKBENCH' ? (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-[400px] flex-shrink-0 space-y-8">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-8">
                  <AudioRecorder onAudioReady={handleAudioReady} status={status} />
                </div>
                {status === AnalysisStatus.COMPLETE && analysisResult && (
                  <div className="space-y-6">
                    <ConversationResume summary={analysisResult.summary} />
                    <ComplianceAudit checklist={analysisResult.complianceChecklist} />
                    
                    {/* COACHING POINTS */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap className="w-16 h-16 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-yellow-300" />
                                <h3 className="text-sm font-black uppercase tracking-wider">Coaching Points</h3>
                            </div>
                            <ul className="space-y-3">
                                {analysisResult.nextBestActions.map((action, idx) => (
                                    <li key={idx} className="flex gap-3 text-xs bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                                        <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center font-bold text-[10px] text-yellow-300 border border-white/10">
                                            {idx + 1}
                                        </span>
                                        <span className="leading-snug opacity-95">{action}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {status === AnalysisStatus.COMPLETE && analysisResult ? <Dashboard data={analysisResult} /> : (
                  <div className="h-full flex flex-col items-center justify-center bg-white rounded-[40px] border border-dashed border-slate-200 p-12 text-center">
                    <LayoutDashboard className="w-16 h-16 text-slate-200 mb-6" />
                    <h2 className="text-2xl font-black text-slate-800">Ready to Audit</h2>
                    <p className="text-slate-500 mt-2 max-w-sm">Enterprise Voice Audit Engine is ready to process bank-grade recordings.</p>
                  </div>
                )}
              </div>
            </div>
          ) : currentView === 'CRM_DASHBOARD' ? (
             <CRMDashboard />
          ) : currentView === 'AUDIT_TRAIL' ? (
             <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] pb-10">
               <AuditTrail logs={auditLogs} />
             </div>
          ) : currentView === 'MANAGEMENT' ? (
            <div className="max-w-7xl mx-auto space-y-8 pb-10">
              <div className="grid grid-cols-1 gap-8">
                {/* SETTINGS & PRIVACY */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100">
                      <LockIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">Data Governance & Privacy</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Enterprise Compliance Control</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Email Redaction', key: 'redactEmail', icon: EyeOff },
                      { label: 'NIK/ID Masking', key: 'redactNIK', icon: ShieldAlert },
                      { label: 'Mother\'s Name Redact', key: 'redactMotherName', icon: LockIcon },
                      { label: 'Customer Name PII', key: 'redactCustomerName', icon: User },
                      { label: 'Phone Redaction', key: 'redactPhone', icon: Briefcase },
                      { label: 'DOB Masking', key: 'redactDOB', icon: Activity },
                      { label: 'Address Redaction', key: 'redactAddress', icon: Globe }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all group">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        </div>
                        <button 
                          onClick={() => togglePii(item.key as keyof PiiSettings)}
                          className={`w-12 h-6 rounded-full relative transition-all ${piiSettings[item.key as keyof PiiSettings] ? 'bg-indigo-600 shadow-md' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${piiSettings[item.key as keyof PiiSettings] ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1">
                  <KnowledgeBase documents={knowledgeDocs} onDocumentsChange={(docs) => {
                    setKnowledgeDocs(docs);
                    addAuditLog('KNOWLEDGE_BASE_UPDATE', 'Library Resource Change', 'SUCCESS');
                  }} />
                </div>

                <div className="xl:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col h-[500px]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shadow-sm">
                        <VenetianMask className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Internal Banking Glossary</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Training AI for Custom Lingo</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                    {dictionary.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-200 group transition-all">
                          <div className="flex-1 grid grid-cols-3 gap-6">
                            <div className="font-black text-amber-600 text-xs tracking-tight uppercase">{item.term}</div>
                            <div className="text-slate-600 text-[11px] font-bold leading-relaxed">{item.definition}</div>
                            <div className="text-slate-400 text-[10px] italic font-medium">Context: {item.context}</div>
                          </div>
                          <button onClick={() => removeDictionaryItem(item.id)} className="p-2.5 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1"><TeamAnalytics /></div>
          )}
        </main>
      </div>

      <ChatAssistant dashboardContext={dashboardContext} referenceText={aggregatedContext} />
    </div>
  );
};

export default App;
