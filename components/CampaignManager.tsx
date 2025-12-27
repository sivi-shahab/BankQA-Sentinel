
import React, { useState, useRef } from 'react';
import { 
  Megaphone, UploadCloud, FileText, X, 
  CheckCircle2, Clock, CalendarRange, 
  Loader2, Sparkles, FileSpreadsheet,
  AlertCircle, Trash2, Rocket
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignManagerProps {
  campaigns: Campaign[];
  onCampaignsChange: (campaigns: Campaign[]) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, onCampaignsChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate AI Parsing Delay
    setTimeout(() => {
      const newCampaign: Campaign = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        fileName: file.name,
        uploadDate: new Date(),
        status: campaigns.length === 0 ? 'ACTIVE' : 'SCHEDULED', // First one active, others scheduled
        productType: file.name.toLowerCase().includes('loan') ? 'Consumer Loan' : 
                     file.name.toLowerCase().includes('card') ? 'Credit Card' : 'Wealth Management'
      };

      onCampaignsChange([newCampaign, ...campaigns]);
      setIsProcessing(false);
      setIsDragging(false);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeCampaign = (id: string) => {
    onCampaignsChange(campaigns.filter(c => c.id !== id));
  };

  const toggleStatus = (id: string) => {
    onCampaignsChange(campaigns.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' };
      }
      // If we activate one, we might want to archive others of same type, but for now just toggle
      return c;
    }));
  };

  const activeCampaign = campaigns.find(c => c.status === 'ACTIVE');
  const scheduledCampaigns = campaigns.filter(c => c.status !== 'ACTIVE');

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl shadow-sm border border-pink-100">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Campaign Product Manager</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Weekly Promo Configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
           <Clock className="w-3.5 h-3.5 text-slate-400" />
           <span className="text-[10px] font-bold text-slate-500 uppercase">Cycle: Weekly</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left: Upload Zone */}
        <div className="flex flex-col gap-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 border-3 border-dashed rounded-[28px] flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer relative overflow-hidden ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' 
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.xlsx,.csv,.docx"
              onChange={handleFileSelect} 
            />
            
            {isProcessing ? (
               <div className="flex flex-col items-center z-10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                  <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest animate-pulse">Parsing Campaign Rules...</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-2">Extracting interest rates & eligibility</p>
               </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-white rounded-[24px] shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
                <h4 className="text-lg font-black text-slate-700 tracking-tight mb-2">Drag & Drop Promo Document</h4>
                <p className="text-xs text-slate-400 font-medium max-w-[200px] leading-relaxed">
                   Support for PDF, Excel, or Word. System auto-extracts product parameters.
                </p>
                <button className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                   Browse Files
                </button>
              </>
            )}

            {/* Decorative Background Elements */}
            {!isProcessing && (
              <>
                <FileSpreadsheet className="absolute top-10 left-10 w-12 h-12 text-slate-100 -rotate-12 pointer-events-none" />
                <FileText className="absolute bottom-10 right-10 w-16 h-16 text-slate-100 rotate-6 pointer-events-none" />
              </>
            )}
          </div>
        </div>

        {/* Right: Active & Scheduled List */}
        <div className="flex flex-col h-full bg-slate-50/50 rounded-[28px] border border-slate-100 p-6 overflow-hidden">
           
           {/* Active Campaign Card */}
           <div className="mb-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Rocket className="w-3.5 h-3.5 text-emerald-500" /> Currently Live
              </h4>
              {activeCampaign ? (
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   </div>
                   <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                         <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                         <h5 className="font-black text-slate-800 text-sm">{activeCampaign.name}</h5>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{activeCampaign.productType}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Active since {activeCampaign.uploadDate.toLocaleDateString()}
                   </div>
                   <button 
                      onClick={() => toggleStatus(activeCampaign.id)}
                      className="mt-3 w-full py-2 text-[10px] font-black text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg uppercase tracking-widest transition-colors"
                   >
                      Deactivate Campaign
                   </button>
                </div>
              ) : (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                   <p className="text-xs font-bold text-slate-400">No Active Campaign</p>
                </div>
              )}
           </div>

           {/* Scheduled List */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <CalendarRange className="w-3.5 h-3.5 text-indigo-500" /> Queue & History
              </h4>
              <div className="space-y-3">
                 {scheduledCampaigns.length === 0 ? (
                    <p className="text-[10px] text-slate-300 italic text-center py-4">Queue is empty</p>
                 ) : (
                    scheduledCampaigns.map(campaign => (
                       <div key={campaign.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between group hover:border-indigo-200 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                                <FileText className="w-4 h-4" />
                             </div>
                             <div>
                                <div className="font-bold text-slate-700 text-xs truncate max-w-[120px]">{campaign.name}</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">{campaign.status}</div>
                             </div>
                          </div>
                          <div className="flex items-center gap-1">
                             <button 
                                onClick={() => toggleStatus(campaign.id)}
                                className="p-1.5 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Set Active"
                             >
                                <Rocket className="w-3.5 h-3.5" />
                             </button>
                             <button 
                                onClick={() => removeCampaign(campaign.id)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                             >
                                <Trash2 className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
