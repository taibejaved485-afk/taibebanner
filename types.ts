export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface PromptOption {
  id: string;
  label: string;
  text: string;
}