import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, UploadCloud, Shield, Lock, EyeOff } from 'lucide-react';
import { AnalysisStatus } from '../types';

interface AudioRecorderProps {
  onAudioReady: (base64Audio: string, redactPII: boolean) => void;
  status: AnalysisStatus;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, status }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [redactPII, setRedactPII] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove data:audio/wav;base64, prefix
          const base64Data = base64String.split(',')[1];
          onAudioReady(base64Data, redactPII);
        };
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
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

  if (status === AnalysisStatus.PROCESSING) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white p-4 rounded-full border-4 border-blue-500">
             <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-slate-800">Analyzing Call Quality</h3>
        <p className="mt-2 text-slate-500 text-center max-w-md">
          Gemini is transcribing conversation, checking compliance, and generating the quality report...
        </p>
        <div className="mt-6 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-xs font-medium">
            <Lock className="w-3 h-3" />
            Processing in Secure Enclave
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-b from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200 relative overflow-hidden">
      {/* Security Badge */}
      <div className="absolute top-4 right-4 group">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full cursor-help">
            <Shield className="w-3 h-3" />
            <span>Secure Mode</span>
        </div>
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <p className="font-semibold mb-1 flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-400" /> 
                Data Privacy Guardrail
            </p>
            <p className="opacity-90">Audio data is processed statelessly via Gemini API. Data is not stored or used to train public models.</p>
        </div>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">New Quality Audit</h2>
        <p className="text-slate-500 mt-1">Record a live call segment or upload audio</p>
      </div>

      <div className="relative group">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-300 shadow-xl ring-4 ring-red-100 animate-pulse"
          >
            <Square className="w-10 h-10 fill-current" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-300 shadow-xl ring-4 ring-blue-100 hover:scale-105"
          >
            <Mic className="w-10 h-10" />
          </button>
        )}
      </div>

      <div className="mt-6 font-mono text-2xl text-slate-700 tabular-nums">
        {isRecording ? (
          <span className="text-red-500 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce" />
            {formatTime(duration)}
          </span>
        ) : (
          <span className="text-slate-400">0:00</span>
        )}
      </div>
      
      {/* PII Toggle */}
      <div className="mt-8 flex items-center justify-center">
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${redactPII ? 'bg-indigo-600' : 'bg-slate-300'}`} onClick={() => setRedactPII(!redactPII)}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${redactPII ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    PII Redaction
                    {redactPII && <EyeOff className="w-3 h-3 text-indigo-600" />}
                </span>
                <span className="text-xs text-slate-500">Automatically mask sensitive customer data</span>
            </div>
        </label>
      </div>

      {!isRecording && (
        <div className="mt-8 pt-6 border-t border-slate-100 w-full text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4">Or upload file</p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm text-sm font-medium">
                <UploadCloud className="w-4 h-4" />
                <span>Select Audio File</span>
                <input type="file" className="hidden" accept="audio/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64String = reader.result as string;
                            const base64Data = base64String.split(',')[1];
                            onAudioReady(base64Data, redactPII);
                        };
                        reader.readAsDataURL(file);
                    }
                }} />
            </label>
        </div>
      )}
    </div>
  );
};