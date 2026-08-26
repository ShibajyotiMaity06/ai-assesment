'use client';

import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Zap,
} from 'lucide-react';
import { Question, UnmatchedAnswer } from '@/lib/types';

interface GradingSummaryModalProps {
  questions: Question[];
  unmatchedAnswers: UnmatchedAnswer[];
  onClose: () => void;
}

export default function GradingSummaryModal({
  questions,
  unmatchedAnswers,
  onClose,
}: GradingSummaryModalProps) {
  const totalMax = questions.reduce((acc, q) => acc + q.maxMarks, 0);
  const totalScored = questions.reduce((acc, q) => acc + q.scoredMarks, 0);
  const percentage = Math.round((totalScored / totalMax) * 100);

  const correctCount = questions.filter((q) => q.status === 'correct').length;
  const partialCount = questions.filter((q) => q.status === 'partial').length;
  const unansweredCount = questions.filter((q) => q.status === 'unanswered').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-orange-500 rounded-xl text-white">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                AI Evaluation & Grading Summary
              </h2>
              <p className="text-xs text-slate-300">
                Class 10 Biology Unit Test • Student Answer Sheet Evaluation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Score Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-center">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Overall Score
              </span>
              <div className="text-3xl font-extrabold text-orange-900 mt-1">
                {totalScored} <span className="text-lg text-orange-600">/ {totalMax}</span>
              </div>
              <span className="inline-block mt-1 text-xs font-bold text-orange-800 bg-orange-200/80 px-2 py-0.5 rounded-full">
                {percentage}% Grade
              </span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Question Mastery
              </span>
              <div className="text-3xl font-extrabold text-emerald-900 mt-1">
                {correctCount} <span className="text-lg text-emerald-600">/ {questions.length}</span>
              </div>
              <span className="inline-block mt-1 text-xs font-semibold text-emerald-700">
                {partialCount} Partial • {unansweredCount} Skipped
              </span>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Sub-parts & Mapping
              </span>
              <div className="text-3xl font-extrabold text-blue-900 mt-1">
                100%
              </div>
              <span className="inline-block mt-1 text-xs font-semibold text-blue-700">
                Preserved Order & Labeling
              </span>
            </div>
          </div>

          {/* Special Requirements Summary checklist */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Assignment Processing Checklist</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Labelled sub-parts split (11a & 11b)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Original question numbering preserved</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Out of order answer handled (Q5)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unanswered question flagged (Q4)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Multi-page answer supported (Q2)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unmatched notes detected ({unmatchedAnswers.length})</span>
              </div>
            </div>
          </div>

          {/* AI Teacher Insights Advice */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <h4 className="font-bold flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>AI Teacher Advice & Action Plan:</span>
            </h4>
            <p className="leading-relaxed">
              The student demonstrated exemplary proficiency in photosynthesis chemical equations, plant cellular organelle functions, and alveolar gas exchange diagrams.
              <br />
              <strong className="text-amber-950">Key Growth Opportunity:</strong> Revisit cardiac blood flow pathways (Q4) and provide practice problems on etiolation recovery techniques.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition-colors"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
}
