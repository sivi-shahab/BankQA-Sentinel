
import React, { useRef, useState } from 'react';
import { BookText, Upload, FileText, X, CheckCircle2, FileSpreadsheet, FileArchive, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

// Initialize PDF.js worker
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

interface KnowledgeBaseProps {
  onContextChange: (text: string) => void;
  referenceText: string;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onContextChange, referenceText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
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

    setFileName(file.name);
    setIsParsing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = '';

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractPdfText(arrayBuffer);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        text = extractExcelText(arrayBuffer);
      } else {
        // Fallback for text files
        text = new TextDecoder().decode(arrayBuffer);
      }

      onContextChange(text);
    } catch (err) {
      console.error("Parsing Error:", err);
      alert("Failed to parse document. Please ensure it's a valid PDF or Excel file.");
    } finally {
      setIsParsing(false);
    }
  };

  const clearFile = () => {
    onContextChange('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
            <BookText className="w-5 h-5" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800 text-sm">RAG Knowledge Base</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Support: PDF, Excel, CSV, Text</p>
        </div>
      </div>

      {!referenceText && !isParsing ? (
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
        >
          <div className="flex justify-center gap-3 mb-3">
            <FileArchive className="w-6 h-6 text-slate-300 group-hover:text-red-400 transition-colors" />
            <FileSpreadsheet className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            <FileText className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase">Drop Reference Document</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.xlsx,.xls,.csv,.txt,.md"
            onChange={handleFileUpload}
          />
        </div>
      ) : isParsing ? (
        <div className="border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">Extracting content...</p>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                         {fileName.endsWith('.pdf') ? <FileText className="w-4 h-4 text-red-500" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate">{fileName}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-1" />
                </div>
                <button 
                    onClick={clearFile}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 max-h-32 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] text-slate-500 font-mono whitespace-pre-wrap leading-relaxed">{referenceText.substring(0, 1000)}...</p>
            </div>
            <div className="mt-2 flex justify-between items-center">
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">READY FOR ANALYSIS</span>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {Math.round(referenceText.length / 1024)} KB Loaded
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
