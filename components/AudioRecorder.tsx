
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, UploadCloud, Shield, Lock as LockIcon, EyeOff, Cpu, Activity, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { AnalysisStatus } from '../types';

interface AudioRecorderProps {
  onAudioReady: (base64Audio: string, mimeType?: string) => void;
  status: AnalysisStatus;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, status }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [processStep, setProcessStep] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const processingSteps = [
    { label: "Neural Audio Mapping", icon: Activity, desc: "Cleaning frequency noise & normalizing gain" },
    { label: "Multimodal Transcription", icon: Cpu, desc: "Gemini 3 processing speech-to-intent" },
    { label: "Compliance Benchmarking", icon: ShieldCheck, desc: "Validating against OJK & BI protocols" },
    { label: "PII Redaction Layer", icon: LockIcon, desc: "Identifying and masking sensitive data" },
    { label: "Final Audit Synthesis", icon: Zap, desc: "Aggregating quality scores and insights" }
  ];

  useEffect(() => {
    let interval: any;
    if (status === AnalysisStatus.PROCESSING) {
      setProcessStep(0);
      interval = setInterval(() => {
        setProcessStep(prev => (prev < processingSteps.length - 1 ? prev + 1 : prev));
      }, 3000); // Change message every 3 seconds for better readability
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const supportedTypes = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/aac'];
      const mimeType = supportedTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          onAudioReady(base64Data, mimeType);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic Access Error:", err);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isProcessing = status === AnalysisStatus.PROCESSING;

  return (
    <div className="relative">
      {/* AI PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="absolute -inset-6 z-[60] flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl rounded-[40px] p-8 text-center animate-fade-in border border-indigo-100 shadow-2xl">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center animate-pulse">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">AI Intelligence Audit</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Analyzing call quality in real-time</p>
          </div>

          <div className="w-full space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
             <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                   {React.createElement(processingSteps[processStep].icon, { className: "w-5 h-5 text-indigo-600" })}
                </div>
                <div className="text-left flex-1 min-w-0">
                   <p className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">
                      {processingSteps[processStep].label}
                   </p>
                   <p className="text-[10px] text-slate-400 font-medium italic truncate">
                      {processingSteps[processStep].desc}
                   </p>
                </div>
             </div>
             <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
                  style={{ width: `${((processStep + 1) / processingSteps.length) * 100}%` }}
                ></div>
             </div>
          </div>

          <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Secure Node 104 Active</span>
          </div>
        </div>
      )}

      <div className={`space-y-6 transition-all duration-500 ${isProcessing ? 'blur-md opacity-20 pointer-events-none scale-95' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="relative group mb-4">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg ring-4 ring-red-100 animate-pulse"
              >
                <Square className="w-8 h-8 fill-current" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={isProcessing}
                className="w-20 h-20 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white flex items-center justify-center transition-all shadow-lg ring-4 ring-indigo-100 hover:scale-105 active:scale-95 group"
              >
                <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-black text-slate-800 tracking-tight">
              {isRecording ? 'LIVE RECORDING' : 'AUDIO SOURCE'}
            </p>
            <div className="mt-1 font-mono text-lg text-slate-400 tabular-nums">
              {isRecording ? <span className="text-red-500">{formatTime(duration)}</span> : '0:00'}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest leading-none">Global Privacy Rules Applied</span>
          </div>

          {!isRecording && (
            <label className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                <UploadCloud className="w-4 h-4" />
                UPLOAD RECORDING
                <input type="file" className="hidden" accept="audio/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64Data = (reader.result as string).split(',')[1];
                            onAudioReady(base64Data, file.type);
                        };
                        reader.readAsDataURL(file);
                    }
                }} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
