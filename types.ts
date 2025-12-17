
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
  agentTalkTimePct: number; 
  customerTalkTimePct: number;
  wordsPerMinute: number;
  interruptionCount: number;
  effectivenessRating: 'OPTIMAL' | 'AGENT_DOMINATED' | 'CUSTOMER_DOMINATED';
  feedback: string;
}

export interface AgentPerformance {
  empathyScore: number;
  clarityScore: number;
  persuasionScore: number;
  productKnowledgeScore: number;
  closingSkillScore: number;
  verdict: 'STAR_PERFORMER' | 'SOLID_PERFORMER' | 'AVERAGE' | 'NEEDS_COACHING';
  strengths: string[];
  weaknesses: string[];
}

export interface CallAnalysis {
  transcriptSegments: TranscriptSegment[];
  summary: string;
  qualityScore: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  nextBestActions: string[];
  complianceChecklist: ComplianceItem[];
  glossaryUsed: GlossaryTerm[];
  extractedInfo: ExtractedInfo;
  conversationStats: ConversationStats;
  agentPerformance: AgentPerformance;
}

// New types for Team View
export interface AgentSummary {
  id: string;
  name: string;
  avatar: string;
  avgScore: number;
  callsCount: number;
  complianceRate: number;
  topSkill: string;
  status: 'Active' | 'In Training' | 'Probation';
}

export interface TeamStats {
  avgQualityScore: number;
  totalCalls: number;
  complianceTargetMet: number; // percentage
  sentimentDistribution: { name: string; value: number }[];
  competencyAverages: { subject: string; A: number; fullMark: number }[];
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

export type AppView = 'WORKBENCH' | 'TEAM_ANALYTICS';
