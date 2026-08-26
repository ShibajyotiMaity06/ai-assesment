export interface BoundingBox {
  id: string;
  pageIndex: number; // 0-indexed page
  x: number; // percentage from left 0-100
  y: number; // percentage from top 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label?: string;
}

export type QuestionStatus = 'correct' | 'partial' | 'incorrect' | 'unanswered';

export interface Question {
  id: string;
  number: string; // e.g. "1", "2", "11 (a)", "11 (b)"
  mainNumber?: string; // e.g. "11" for grouping
  subPart?: string; // e.g. "a", "b"
  text: string;
  maxMarks: number;
  scoredMarks: number;
  status: QuestionStatus;
  aiFeedback: string;
  studentAnswerText?: string;
  answerPages: number[]; // e.g. [0] or [0, 1] for multi-page answers
  boundingBoxes: BoundingBox[];
  isOutOfOrder?: boolean;
}

export interface UnmatchedAnswer {
  id: string;
  pageIndex: number;
  boundingBox: BoundingBox;
  transcript: string;
  note: string;
}

export interface ProcessingState {
  step: 'upload' | 'extracting' | 'mapping';
  progress: number;
  statusMessage: string;
}

export interface ExamDocument {
  questionPaperName: string;
  questionPaperSize: string;
  questionPaperPages: number;
  answerSheetName: string;
  answerSheetSize: string;
  answerSheetPages: number;
}
