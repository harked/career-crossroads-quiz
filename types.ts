export interface Question {
  id: number;
  text: string;
}

export interface AnswerOption {
  value: number;
  label: string;
}

export interface GeminiAnalysis {
  title: string;
  analysis: string;
  nextSteps: string[];
}

export type QuizState = 'welcome' | 'quiz' | 'loading' | 'results';
