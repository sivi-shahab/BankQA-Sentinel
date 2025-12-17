
import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Login } from './components/Login';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ComplianceAudit } from './components/ComplianceAudit';
import { TeamAnalytics } from './components/TeamAnalytics';
import { analyzeTelemarketingAudio } from './services/geminiService';
import { AnalysisStatus, CallAnalysis, AppView } from './types';
import { ShieldCheck, LayoutDashboard, ArrowLeft, Lock, LogOut, Settings2, Sparkles, Wand2, Users2, LineChart } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('WORKBENCH');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<CallAnalysis | null>(null);
  const [referenceText, setReferenceText] = useState<string>('');

  const handleAudioReady = async (base64Audio: string, redactPII: boolean) => {
    setStatus(AnalysisStatus.PROCESSING);
    try {
      const result = await analyzeTelemarketingAudio(base64Audio, redactPII, referenceText);
      setAnalysisResult(result);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
      alert("Failed to analyze audio. Please try again.");
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setAnalysisResult(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleReset();
    setReferenceText('');
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      {/* Top Professional Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group transition-transform hover:scale-105">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                BANKQA SENTINEL
              </h1>
            </div>

            {/* View Tabs */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
               <button 
                  onClick={() => setCurrentView('WORKBENCH')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentView === 'WORKBENCH' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
               >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Audit Workbench
               </button>
               <button 
                  onClick={() => setCurrentView('TEAM_ANALYTICS')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentView === 'TEAM_ANALYTICS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
               >
                  <Users2 className="w-3.5 h-3.5" />
                  Team Analytics
               </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {currentView === 'WORKBENCH' && status === AnalysisStatus.COMPLETE && (
               <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100 uppercase tracking-widest"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  New Session
                </button>
            )}
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main View Port */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-6 gap-6 overflow-hidden">
        
        {currentView === 'WORKBENCH' ? (
          <>
            {/* Workbench Sidebars and Dashboard - Existing logic */}
            <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6 flex flex-col overflow-y-auto custom-scrollbar pr-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Settings2 className="w-3.5 h-3.5" /> Input Controls
                    </h3>
                  </div>
                  <div className="p-5 space-y-6">
                    <AudioRecorder onAudioReady={handleAudioReady} status={status} />
                    <KnowledgeBase referenceText={referenceText} onContextChange={setReferenceText} />
                  </div>
              </div>

              {status === AnalysisStatus.COMPLETE && analysisResult && (
                  <ComplianceAudit checklist={analysisResult.complianceChecklist} />
              )}
            </div>

            <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar pr-2">
              {status === AnalysisStatus.IDLE ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
                    <LayoutDashboard className="w-16 h-16 text-slate-200 mb-6" />
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ready for Audit</h2>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                      Start recording or upload a call recording to begin.
                    </p>
                </div>
              ) : status === AnalysisStatus.PROCESSING ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 p-12 bg-white rounded-3xl border border-slate-200">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                    <h2 className="text-xl font-black text-slate-800">Processing Intelligence...</h2>
                  </div>
              ) : (
                analysisResult && <Dashboard data={analysisResult} />
              )}
            </div>
          </>
        ) : (
          /* TEAM ANALYTICS VIEW */
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Department Performance</h2>
                    <p className="text-slate-500 font-medium">Monitoring quality and compliance across all telemarketing staff.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
                        <LineChart className="w-4 h-4" /> Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                        Quarterly Review
                    </button>
                </div>
            </div>
            <TeamAnalytics />
          </div>
        )}
      </main>

      {/* Floating Chat Assistant Overlay */}
      {currentView === 'WORKBENCH' && status === AnalysisStatus.COMPLETE && analysisResult && (
        <ChatAssistant contextData={analysisResult} referenceText={referenceText} />
      )}
    </div>
  );
};

export default App;
