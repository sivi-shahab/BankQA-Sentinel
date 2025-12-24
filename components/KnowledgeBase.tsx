
import React, { useRef, useState } from 'react';
import { BookText, Upload, FileText, X, CheckCircle2, FileSpreadsheet, FileArchive, Loader2, Trash2, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';
import { KnowledgeDocument } from '../types';

// Initialize PDF.js worker
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

interface KnowledgeBaseProps {
  onDocumentsChange: (docs: KnowledgeDocument[]) => void;
  documents: KnowledgeDocument[];
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onDocumentsChange, documents }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);

  const extractPdfText = async (data: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';
    }
    return fullText;
  };

  const extractExcelText = (data: ArrayBuffer): string => {
    const workbook = XLSX.read(data, { type: 'array' });
    let fullText = '';
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      fullText += `Sheet: ${sheetName}\n${JSON.stringify(json, null, 2)}\n\n`;
    });
    return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = '';

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractPdfText(arrayBuffer);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        text = extractExcelText(arrayBuffer);
      } else {
        text = new TextDecoder().decode(arrayBuffer);
      }

      const newDoc: KnowledgeDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || 'text/plain',
        content: text,
        size: file.size,
        uploadDate: new Date()
      };

      onDocumentsChange([...documents, newDoc]);
    } catch (err) {
      console.error("Parsing Error:", err);
      alert("Failed to parse document. Please ensure it's a valid PDF or Excel file.");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  };

  const totalSizeKB = Math.round(documents.reduce((acc, d) => acc + d.content.length, 0) / 1024);

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shadow-sm border border-indigo-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase">Multiple RAG Library</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Multi-source SOP Intelligence</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-indigo-600">{documents.length} Source(s)</span>
            <span className="text-[9px] text-slate-400 font-bold">{totalSizeKB} KB Active Context</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
          onClick={() => !isParsing && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-100 rounded-[24px] p-6 text-center transition-all group relative mb-6 ${
            isParsing ? 'bg-slate-50 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-200'
          }`}
      >
        {isParsing ? (
           <div className="flex flex-col items-center justify-center animate-pulse">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mb-2" />
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Parsing Structure...</p>
           </div>
        ) : (
          <>
            <div className="flex justify-center gap-4 mb-3">
              <FileArchive className="w-6 h-6 text-slate-200 group-hover:text-red-400 transition-colors" />
              <FileSpreadsheet className="w-6 h-6 text-slate-200 group-hover:text-emerald-500 transition-colors" />
              <FileText className="w-6 h-6 text-slate-200 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Add Reference Document</p>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">PDF, Excel, CSV, or Text</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.xlsx,.xls,.csv,.txt,.md"
          onChange={handleFileUpload}
        />
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {documents.length === 0 && !isParsing ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-200 opacity-50 border border-dashed border-slate-100 rounded-2xl">
            <BookText className="w-10 h-10 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">Library is empty</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="group p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex-shrink-0">
                  {doc.name.endsWith('.pdf') ? (
                    <FileText className="w-4 h-4 text-rose-500" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-slate-800 truncate leading-none mb-1">{doc.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      {Math.round(doc.size / 1024)} KB
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Synchronized</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeDocument(doc.id)}
                className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Context Active</span>
          </div>
          <button 
            onClick={() => onDocumentsChange([])}
            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
          >
            Clear All
          </button>
      </div>
    </div>
  );
};
