import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { Dashboard } from './components/Dashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { Login } from './components/Login';
import { analyzeTelemarketingAudio } from './services/geminiService';
import { AnalysisStatus, CallAnalysis } from './types';
import { ShieldCheck, LayoutDashboard, ArrowLeft, Lock, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<CallAnalysis | null>(null);

  const handleAudioReady = async (base64Audio: string, redactPII: boolean) => {
    setStatus(AnalysisStatus.PROCESSING);
    try {
      const result = await analyzeTelemarketingAudio(base64Audio, redactPII);
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
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg relative overflow-hidden group">
                <ShieldCheck className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">BankQA Sentinel</h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 font-medium">Quality Control Dashboard</p>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-slate-200">
                    <Lock className="w-2.5 h-2.5" />
                    Enterprise Secure
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {status === AnalysisStatus.COMPLETE && (
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Analysis
                </button>
              )}
              <div className="h-6 w-px bg-slate-200"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {status === AnalysisStatus.ERROR && (
           <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    An error occurred during analysis. Please check your API Key and internet connection.
                  </p>
                </div>
              </div>
            </div>
        )}

        {status === AnalysisStatus.IDLE || status === AnalysisStatus.PROCESSING ? (
          <div className="max-w-2xl mx-auto mt-12">
            <AudioRecorder onAudioReady={handleAudioReady} status={status} />
            
            {status === AnalysisStatus.IDLE && (
              <div className="mt-12 grid grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Auto-Scoring</h3>
                  <p className="text-sm text-slate-500 mt-1">Instant quality assurance scoring (0-100)</p>
                </div>
                <div className="p-4">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Compliance</h3>
                  <p className="text-sm text-slate-500 mt-1">Automatic regulatory checks & warnings</p>
                </div>
                 <div className="p-4">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-800">Next Action</h3>
                  <p className="text-sm text-slate-500 mt-1">AI-driven recommendations for agents</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          analysisResult && <Dashboard data={analysisResult} />
        )}
      </main>

      {/* Chat Assistant Overlay (Only visible when analysis is done) */}
      {status === AnalysisStatus.COMPLETE && analysisResult && (
        <ChatAssistant contextData={analysisResult} />
      )}
    </div>
  );
};

export default App;