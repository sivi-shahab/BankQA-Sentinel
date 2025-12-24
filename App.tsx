
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
import { AnalysisStatus, CallAnalysis, AppView, PiiSettings, DictionaryItem, AuditLog } from './types';
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
  Lock,
  ArrowUpRight,
  Globe,
  FileText
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('WORKBENCH');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<CallAnalysis | null>(null);
  const [referenceText, setReferenceText] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState(true);

  // Management States
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
        referenceText, 
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
                  <>
                    <ConversationResume summary={analysisResult.summary} />
                    <ComplianceAudit checklist={analysisResult.complianceChecklist} />
                  </>
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
                      <Lock className="w-6 h-6" />
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
                      { label: 'Mother\'s Name Redact', key: 'redactMotherName', icon: Lock },
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

                  <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-black text-emerald-800">Advanced Diarization</h4>
                        <button 
                          onClick={() => togglePii('enableDiarization')}
                          className={`w-10 h-5 rounded-full relative transition-all ${piiSettings.enableDiarization ? 'bg-emerald-500 shadow-sm' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${piiSettings.enableDiarization ? 'left-5.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight leading-relaxed">Splits Agent vs Customer audio streams automatically.</p>
                    </div>
                    <div className="flex-1 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-black text-blue-800">Gender Intelligence</h4>
                        <button 
                          onClick={() => togglePii('enableGenderDetection')}
                          className={`w-10 h-5 rounded-full relative transition-all ${piiSettings.enableGenderDetection ? 'bg-blue-500 shadow-sm' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${piiSettings.enableGenderDetection ? 'left-5.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight leading-relaxed">Bio-metric voice detection for customer identification.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* KNOWLEDGE BASE & GLOSSARY */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1">
                  <KnowledgeBase referenceText={referenceText} onContextChange={(txt) => {
                    setReferenceText(txt);
                    addAuditLog('KNOWLEDGE_BASE_UPLOAD', 'Document Resource', 'SUCCESS');
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
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {dictionary.length} Terms Defined
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-6 rounded-[24px] border border-slate-100 shadow-inner">
                    <input 
                      value={newDictItem.term}
                      onChange={(e) => setNewDictItem(prev => ({ ...prev, term: e.target.value }))}
                      placeholder="Term (e.g., KPR_FIX_5Y)"
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input 
                      value={newDictItem.definition}
                      onChange={(e) => setNewDictItem(prev => ({ ...prev, definition: e.target.value }))}
                      placeholder="Definition"
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex gap-2">
                      <input 
                        value={newDictItem.context}
                        onChange={(e) => setNewDictItem(prev => ({ ...prev, context: e.target.value }))}
                        placeholder="Usage Context"
                        className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button 
                        onClick={addDictionaryItem} 
                        className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-black transition-colors shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                    {dictionary.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 py-10">
                        <BookMarked className="w-12 h-12 mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">Glossary is empty</p>
                      </div>
                    ) : (
                      dictionary.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-200 group transition-all">
                          <div className="flex-1 grid grid-cols-3 gap-6">
                            <div className="font-black text-amber-600 text-xs tracking-tight uppercase">{item.term}</div>
                            <div className="text-slate-600 text-[11px] font-bold leading-relaxed">{item.definition}</div>
                            <div className="text-slate-400 text-[10px] italic font-medium truncate">Context: {item.context}</div>
                          </div>
                          <button 
                            onClick={() => removeDictionaryItem(item.id)} 
                            className="p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1"><TeamAnalytics /></div>
          )}
        </main>
      </div>

      {(currentView === 'WORKBENCH' || currentView === 'CRM_DASHBOARD') && (status === AnalysisStatus.COMPLETE || currentView === 'CRM_DASHBOARD') && (
        <ChatAssistant contextData={analysisResult} referenceText={referenceText} />
      )}
    </div>
  );
};

export default App;
