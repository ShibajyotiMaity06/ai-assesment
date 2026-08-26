'use client';

import React, { useRef } from 'react';
import {
  Upload,
  FileText,
  X,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ExamDocument } from '@/lib/types';

interface UploadStateProps {
  examDoc: ExamDocument;
  hasQuestionPaper: boolean;
  hasAnswerSheet: boolean;
  onQuestionPaperUpload: (file?: File) => void;
  onAnswerSheetUpload: (file?: File) => void;
  onRemoveQuestionPaper: () => void;
  onRemoveAnswerSheet: () => void;
  onStartMapping: () => void;
  onLoadDemoSample: () => void;
}

export default function UploadState({
  examDoc,
  hasQuestionPaper,
  hasAnswerSheet,
  onQuestionPaperUpload,
  onAnswerSheetUpload,
  onRemoveQuestionPaper,
  onRemoveAnswerSheet,
  onStartMapping,
  onLoadDemoSample,
}: UploadStateProps) {
  const qpInputRef = useRef<HTMLInputElement>(null);
  const asInputRef = useRef<HTMLInputElement>(null);

  const canStart = hasQuestionPaper && hasAnswerSheet;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* Top Title Section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Upload{' '}
          <span className="relative inline-block px-3 py-1 text-orange-600 bg-orange-100/80 rounded-2xl border border-orange-200">
            Question Paper & Answer Sheets
          </span>
        </h1>
        <p className="text-slate-500 font-medium text-base mt-3">
          Upload both files to get started
        </p>
      </div>

      {/* Central Illustration Badge */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-100 via-amber-50 to-orange-200 p-1 shadow-lg ring-8 ring-orange-50/50 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-inner relative overflow-hidden">
            <span className="text-3xl">👩‍🏫</span>
            <div className="absolute -bottom-1 w-full bg-orange-600 text-[9px] font-bold text-center py-0.5 tracking-tighter">
              VEDA AI
            </div>
          </div>
        </div>
        {/* Floating sparkles badges */}
        <div className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md border border-orange-100 animate-bounce">
          <Sparkles className="w-4 h-4 text-orange-500" />
        </div>
      </div>

      {/* Demo Preset Bar */}
      <div className="mb-6 flex items-center justify-center">
        <button
          onClick={onLoadDemoSample}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-orange-50 text-orange-600 text-xs font-semibold rounded-full border border-orange-200 shadow-sm transition-all hover:scale-105"
        >
          <BookOpen className="w-4 h-4" />
          <span>Load Standard Biology Unit Test Demo Files</span>
          <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            Instant Test
          </span>
        </button>
      </div>

      {/* Upload Dropzone Boxes */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Hidden Inputs */}
        <input
          ref={qpInputRef}
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onQuestionPaperUpload(e.target.files[0]);
            }
          }}
        />
        <input
          ref={asInputRef}
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onAnswerSheetUpload(e.target.files[0]);
            }
          }}
        />

        {/* Question Paper Dropzone */}
        {hasQuestionPaper ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-all">
            <button
              onClick={onRemoveQuestionPaper}
              className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <div className="pr-6 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-700">
                    Question Paper Ready
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 truncate mt-1">
                  {examDoc.questionPaperName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {examDoc.questionPaperSize} • {examDoc.questionPaperPages}{' '}
                  Pages
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => qpInputRef.current?.click()}
            className="bg-white rounded-2xl p-8 border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50/20 cursor-pointer transition-all flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Upload <span className="text-orange-600">Question Paper</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF or Images • Max 10MB</p>
          </div>
        )}

        {/* Answer Sheet Dropzone */}
        {hasAnswerSheet ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-all">
            <button
              onClick={onRemoveAnswerSheet}
              className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <div className="pr-6 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-700">
                    Answer Sheet Ready
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 truncate mt-1">
                  {examDoc.answerSheetName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {examDoc.answerSheetSize} • {examDoc.answerSheetPages} Pages
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => asInputRef.current?.click()}
            className="bg-white rounded-2xl p-8 border-2 border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50/20 cursor-pointer transition-all flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Upload <span className="text-orange-600">Answer Sheet</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF or Images • Max 10MB</p>
          </div>
        )}
      </div>

      {/* Start Mapping Action CTA */}
      <div className="flex flex-col items-center space-y-3">
        <button
          onClick={onStartMapping}
          disabled={!canStart}
          className={`flex items-center space-x-3 px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-md ${
            canStart
              ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer hover:scale-105 shadow-slate-900/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Start Mapping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-slate-400 font-medium">
          Once both files are uploaded, you&apos;ll be able to map answers with
          questions
        </p>
      </div>
    </div>
  );
}
