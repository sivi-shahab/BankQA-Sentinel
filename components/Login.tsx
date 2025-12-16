import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Loader2, Building2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate network authentication request
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header / Brand Area */}
        <div className="bg-blue-600 p-10 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-800 to-blue-500 opacity-90"></div>
             {/* Decorative circles */}
             <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>

             <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4 border border-white/20 shadow-lg">
                    <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">BankQA Sentinel</h1>
                <p className="text-blue-100 mt-2 text-sm font-medium tracking-wide opacity-90">Quality Control & Compliance Dashboard</p>
             </div>
        </div>
        
        {/* Form Area */}
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Enterprise ID / Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            placeholder="officer@bank-enterprise.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Secure Password</label>
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            placeholder="••••••••••••"
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                  <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full flex items-center justify-center py-3.5 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                  >
                      {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                          <>
                              Sign In to Workspace
                              <ArrowRight className="ml-2 w-4 h-4" />
                          </>
                      )}
                  </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span>256-bit SSL Encrypted Connection</span>
                  </div>
                  <p className="text-[10px] text-slate-300">Authorized personnel only. Access is monitored.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};