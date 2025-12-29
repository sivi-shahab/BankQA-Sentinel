
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs, StatusType } from '@datadog/browser-logs';

// NOTE: In a real production app, these should be environment variables.
// For this demo, we assume they are injected or placeholders.
const DD_CLIENT_TOKEN = process.env.DD_CLIENT_TOKEN || 'pub1234567890abcdef'; 
const DD_APPLICATION_ID = process.env.DD_APPLICATION_ID || 'app-123-456';
const DD_SITE = 'datadoghq.com';
const SERVICE_NAME = 'proofpoint-ai-gemini';

let isInitialized = false;

export const initDatadog = () => {
  if (isInitialized) return;

  // 1. Initialize RUM (Real User Monitoring) for Session Replay & UX Metrics
  datadogRum.init({
    applicationId: DD_APPLICATION_ID,
    clientToken: DD_CLIENT_TOKEN,
    site: DD_SITE,
    service: SERVICE_NAME,
    env: 'production',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });

  // 2. Initialize Logs for LLM Telemetry
  datadogLogs.init({
    clientToken: DD_CLIENT_TOKEN,
    site: DD_SITE,
    service: SERVICE_NAME,
    env: 'production',
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
  });

  isInitialized = true;
};

// Interface for Structured LLM Log
export interface LLMTelemetry {
  model: string;
  operation: 'audio_analysis' | 'chat_query' | 'avatar_generation';
  durationMs: number;
  tokensInputEstimate: number;
  tokensOutputEstimate: number;
  status: 'success' | 'error';
  errorType?: string;
  // Quality Metrics (Specific to your app)
  qualityScore?: number;
  sentiment?: string;
  compliancePassRate?: number;
}

export const logLLMTelemetry = (data: LLMTelemetry) => {
  if (!isInitialized) return;

  // Define alert rules based on thresholds
  let level: StatusType = 'info';
  let message = `LLM Operation: ${data.operation}`;

  // DETECTION RULE 1: High Latency
  if (data.durationMs > 8000) {
    level = 'warn';
    message = `[ALERT] LLM Latency High (${data.durationMs}ms): ${data.operation}`;
  }

  // DETECTION RULE 2: Quality Drop (Incident)
  if (data.qualityScore !== undefined && data.qualityScore < 70) {
    level = 'error'; // Elevate to error to trigger PagerDuty/Slack via Datadog
    message = `[INCIDENT] Low Quality Score Detected (${data.qualityScore}): ${data.operation}`;
  }

  // DETECTION RULE 3: API Errors
  if (data.status === 'error') {
    level = 'error';
    message = `[FAILURE] LLM API Error: ${data.errorType}`;
  }

  datadogLogs.logger.log(message, {
    llm: {
        model: data.model,
        provider: 'vertex-ai-gemini',
        temperature: 0.1, // Captured from config
    },
    performance: {
        duration_ms: data.durationMs,
        tokens_total: data.tokensInputEstimate + data.tokensOutputEstimate,
    },
    business_metrics: {
        quality_score: data.qualityScore,
        sentiment: data.sentiment,
        compliance_score: data.compliancePassRate
    },
    context: {
        operation: data.operation,
    }
  }, level);
};

export const startTrace = () => performance.now();
export const endTrace = (start: number) => performance.now() - start;

// Helper to estimate tokens (rough approx 4 chars = 1 token)
export const estimateTokens = (text: string) => Math.ceil(text.length / 4);
