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

export interface CallAnalysis {
  transcriptSegments: TranscriptSegment[];
  summary: string;
  qualityScore: number; // 0-100
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  nextBestActions: string[];
  complianceChecklist: ComplianceItem[];
  glossaryUsed: GlossaryTerm[];
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
