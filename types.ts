export interface ComplianceItem {
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  details: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  contextInCall: string;
}

export interface TranscriptSegment {
  speaker: string;
  text: string;
}

export interface ExtractedInfo {
  productName: string;
  customerName: string;
  parentName: string; // Nama Orang Tua / Ibu Kandung
  identityNumber: string; // NIK
  contributionAmount: string; // Iuran / Premi
  contactInfo: string;
  otherDetails: string;
}

export interface CallAnalysis {
  transcriptSegments: TranscriptSegment[];
  summary: string;
  qualityScore: number; // 0-100
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  nextBestActions: string[];
  complianceChecklist: ComplianceItem[];
  glossaryUsed: GlossaryTerm[];
  extractedInfo: ExtractedInfo;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
