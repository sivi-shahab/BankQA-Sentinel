
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
          const base64Data = base64String.split(',')[1];
          onAudioReady(base64Data, redactPII);
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

  const disabled = status === AnalysisStatus.PROCESSING;

  return (
    <div className="space-y-6">
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
              disabled={disabled}
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
        {/* PII Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Privacy Guard</span>
              <span className="text-xs font-bold text-slate-800">Redact PII Data</span>
          </div>
          <button 
            onClick={() => !disabled && setRedactPII(!redactPII)}
            className={`w-10 h-5 rounded-full relative transition-colors ${redactPII ? 'bg-indigo-600' : 'bg-slate-300'} ${disabled ? 'opacity-50' : ''}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${redactPII ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {/* Upload Trigger */}
        {!isRecording && (
          <label className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <UploadCloud className="w-4 h-4" />
              UPLOAD RECORDING
              <input type="file" className="hidden" accept="audio/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                          const base64Data = (reader.result as string).split(',')[1];
                          onAudioReady(base64Data, redactPII);
                      };
                      reader.readAsDataURL(file);
                  }
              }} />
          </label>
        )}
      </div>
    </div>
  );
};
