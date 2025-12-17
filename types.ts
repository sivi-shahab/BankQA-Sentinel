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
  dateOfBirth: string;
  identityNumber: string;
  motherMaidenName: string;
  bankAccountNumber: string;
  targetBankName: string;
  contributionAmount: string;
  phoneNumber: string;
  emailAddress: string;
  occupation: string;
  residentialAddress: string;
}

export interface ConversationStats {
  agentTalkTimePct: number; // e.g. 60
  customerTalkTimePct: number; // e.g. 40
  wordsPerMinute: number; // Estimated pace
  interruptionCount: number;
  effectivenessRating: 'OPTIMAL' | 'AGENT_DOMINATED' | 'CUSTOMER_DOMINATED';
  feedback: string;
}

export interface AgentPerformance {
  empathyScore: number; // 0-100
  clarityScore: number; // 0-100
  persuasionScore: number; // 0-100
  productKnowledgeScore: number; // 0-100
  closingSkillScore: number; // 0-100
  verdict: 'STAR_PERFORMER' | 'SOLID_PERFORMER' | 'AVERAGE' | 'NEEDS_COACHING';
  strengths: string[];
  weaknesses: string[];
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
  conversationStats: ConversationStats;
  agentPerformance: AgentPerformance;
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
