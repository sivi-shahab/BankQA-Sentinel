
import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Login } from './components/Login';
import { KnowledgeBase } from './components/KnowledgeBase';
import { analyzeTelemarketingAudio } from './services/geminiService';
import { AnalysisStatus, CallAnalysis } from './types';
import { ShieldCheck, LayoutDashboard, ArrowLeft, Lock, LogOut, Settings2, Sparkles, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group transition-transform hover:scale-105">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                BANKQA SENTINEL
                <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest font-black">Workbench v2</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Lock className="w-2.5 h-2.5" /> Secure Environment
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {status === AnalysisStatus.COMPLETE && (
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

      {/* Unified Main Interface */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-6 gap-6 overflow-hidden">
        
        {/* Left Control Panel - Inputs */}
        <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6 flex flex-col">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> Input Controls
                </h3>
                {status === AnalysisStatus.PROCESSING && (
                   <span className="text-[10px] font-bold text-indigo-600 animate-pulse">ANALYZING...</span>
                )}
              </div>
              <div className="p-5 space-y-6">
                 <AudioRecorder onAudioReady={handleAudioReady} status={status} />
                 <KnowledgeBase 
                    referenceText={referenceText} 
                    onContextChange={setReferenceText} 
                 />
              </div>
           </div>

           {/* AI Capability Badges */}
           <div className="hidden lg:grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-center">
                  <Wand2 className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-indigo-800 uppercase">Auto Diarization</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
                  <Sparkles className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-emerald-800 uppercase">RAG Analysis</p>
              </div>
           </div>
        </div>

        {/* Right Dashboard Area - Results */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar pr-2">
           {status === AnalysisStatus.IDLE ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <LayoutDashboard className="w-16 h-16 text-slate-200" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ready for Audit</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                  Start recording or upload a call recording to begin the automated Quality Control process.
                  Enhance results by providing context in the Knowledge Base.
                </p>
                <div className="mt-8 flex gap-4">
                  <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100">
                    BANKING COMPLIANCE
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100">
                    TALK TIME ANALYTICS
                  </div>
                </div>
             </div>
           ) : status === AnalysisStatus.PROCESSING ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6 p-12 bg-white rounded-3xl border border-slate-200">
                 <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    </div>
                 </div>
                 <div className="text-center">
                    <h2 className="text-xl font-black text-slate-800">Processing Intelligence</h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                      Extracting diarized transcript, evaluating compliance, and calculating metrics...
                    </p>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
           ) : status === AnalysisStatus.ERROR ? (
              <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center">
                 <h2 className="text-red-800 font-bold">Analysis Failed</h2>
                 <p className="text-red-600 text-sm mt-2">Check your credentials or try a different file format.</p>
                 <button onClick={handleReset} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold">Retry</button>
              </div>
           ) : (
             analysisResult && <Dashboard data={analysisResult} />
           )}
        </div>
      </main>

      {/* Floating Chat Assistant Overlay */}
      {status === AnalysisStatus.COMPLETE && analysisResult && (
        <ChatAssistant contextData={analysisResult} referenceText={referenceText} />
      )}
    </div>
  );
};

export default App;
