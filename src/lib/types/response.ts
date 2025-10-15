// Response types for the AI Agent API

export interface AgentResponse {
  success: boolean;
  data: {
    message: string;
    htmlContent?: string; // Safe HTML content for styling
    toolUsed?: string;
    metadata: {
      timestamp: string;
      query: string;
      responseType: 'text' | 'structured' | 'html' | 'error';
      confidence?: 'high' | 'medium' | 'low';
    };
    structuredData?: StructuredData;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface StructuredData {
  category: 'personal' | 'technical' | 'projects' | 'contact' | 'education' | 'general';
  highlights?: string[];
  relatedTopics?: string[];
}

export interface AgentRequest {
  message: string;
}

// Error codes for better error handling
export enum ErrorCodes {
  INVALID_INPUT = 'INVALID_INPUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  AGENT_ERROR = 'AGENT_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

// Response categories for frontend UI
export enum ResponseCategories {
  PERSONAL = 'personal',
  TECHNICAL = 'technical', 
  PROJECTS = 'projects',
  CONTACT = 'contact',
  EDUCATION = 'education',
  GENERAL = 'general'
}

// Confidence levels for response quality
export enum ConfidenceLevels {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}
