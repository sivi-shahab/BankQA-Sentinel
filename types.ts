
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
  timestamp?: string;
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

export interface GenderProfile {
  agentGender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  customerGender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  reasoning: string;
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
  genderProfile: GenderProfile;
}

export interface PiiSettings {
  redactEmail: boolean;
  redactNIK: boolean;
  redactMotherName: boolean;
  redactCustomerName: boolean;
  redactPhone: boolean;
  redactDOB: boolean;
  redactAddress: boolean;
  enableDiarization: boolean;
  enableGenderDetection: boolean;
}

export interface DictionaryItem {
  id: string;
  term: string;
  definition: string;
  context: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
  ipAddress: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: string;
  content: string;
  size: number;
  uploadDate: Date;
}

// CRM TYPES - ENHANCED FOR HYPER-INTELLIGENCE
export interface Lead {
  id: string;
  name: string;
  source: string;
  score: number;
  status: 'Prospect' | 'Meeting' | 'Proposal' | 'Closing';
  category: 'Hot' | 'Warm' | 'Cold';
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  productAffinity: string;
  propensityReason: string;
  bestTimeToCall: string;
  expectedValue: number;
  lastActivity: string;
  creditScore?: number;
}

export interface Customer360 {
  id: string;
  name: string;
  tier: 'Priority' | 'Gold' | 'Silver';
  portfolio: {
    savings: number;
    deposits: number;
    loans: number;
    investment: number;
    insurance: number;
  };
  churnRisk: number;
  riskTrend: 'UP' | 'DOWN' | 'STABLE';
  riskFactors: string[];
  lastInteraction: string;
  nba: string;
  persona: string;
  engagementScore: number;
  walletSharePct: number;
  moodTrend: ('POS' | 'NEU' | 'NEG')[];
  lifeEventPrediction: string;
  wealthVelocity: 'RISING' | 'STABLE' | 'DECLINING';
}

export interface SegmentGroup {
  name: string;
  count: number;
  avgValue: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  strategy: string;
}

export interface CRMStats {
  acquisition: {
    totalLeads: number;
    conversionRate: number;
    expectedRevenue: number;
    funnelData: { stage: string; count: number; dropOff: number }[];
  };
  retention: {
    avgCLV: number;
    churnRate: number;
    activeCampaigns: number;
    slaMet: number;
    segments: SegmentGroup[];
  };
}

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
  complianceTargetMet: number;
  sentimentDistribution: { name: string; value: number }[];
  competencyAverages: { subject: string; A: number; fullMark: number }[];
}

export interface FullDashboardContext {
  leads: Lead[];
  customers: Customer360[];
  crmStats: CRMStats;
  teamStats: TeamStats;
  agents: AgentSummary[];
  currentCallAnalysis: CallAnalysis | null;
  piiSettings: PiiSettings;
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

export type AppView = 'WORKBENCH' | 'TEAM_ANALYTICS' | 'CRM_DASHBOARD' | 'MANAGEMENT' | 'AUDIT_TRAIL';
