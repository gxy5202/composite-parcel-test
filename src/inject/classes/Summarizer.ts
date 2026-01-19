export interface SummaryOptions {
  context?: string;
  sharedContext?: string;
  length?: "short" | "medium" | "long";
  format?: "text" | "markdown" | "html";
  type?: "key-points" | "summary";
  outputLanguage?: string; // 输出语言
}

export interface SummarizerProgress {
  loaded: number;
  total?: number;
}

export interface SummaryResult {
  text: string;
  metadata?: {
    length: number;
    keywords?: string[];
  };
}

export interface ISummarizer {
  availability(): Promise<"available" | "downloading" | "unavailable">;
  create(options: SummaryOptions): Promise<ISummarizer>;
  summarizeStreaming(
    text: string,
    options: SummaryOptions
  ): Promise<ReadableStream<string>>;
  ready: Promise<void>;
  addEventListener(
    event: string,
    handler: (e: SummarizerProgress) => void
  ): void;
}

// 声明全局 Summarizer API
declare global {
  interface Window {
    Summarizer: {
      availability(): Promise<"available" | "downloadable" | "unavailable">;
      create(options: SummaryOptions): Promise<ISummarizer>;
    };
  }
}

import { ActionType } from "src/types/type.d";
import { sendRuntimeMessage } from "src/util";

/**
 * Summarizer service for generating summaries from video transcripts
 */
export default class VideoSummarizer {
  private summarizer: ISummarizer | null;
  private isInitialized: boolean;
  private initializationPromise: Promise<void> | null;

  constructor() {
    this.summarizer = null;
    this.isInitialized = false;
    this.initializationPromise = null;
  }
  
}
