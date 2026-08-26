'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { Question } from '@/lib/types';

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onOpenGradingSummary: () => void;
}

export default function QuestionList({
  questions = [],
  selectedQuestionId,
  onSelectQuestion,
  onOpenGradingSummary,
}: QuestionListProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    q2: true, // Q2 expanded by default
  });
  const [filter, setFilter] = useState<'all' | 'correct' | 'partial' | 'unanswered'>('all');

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    (questions || []).forEach((q) => {
      if (q.id) allExpanded[q.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  const filteredQuestions = (questions || []).filter((q) => {
    if (filter === 'correct') return q.status === 'correct';
    if (filter === 'partial') return q.status === 'partial';
    if (filter === 'unanswered') return q.status === 'unanswered';
    return true;
  });

  const totalMax = (questions || []).reduce((acc, q) => acc + (q.maxMarks || 0), 0);
  const totalScored = (questions || []).reduce((acc, q) => acc + (q.scoredMarks || 0), 0);

  return (
    <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col h-full bg-slate-50 border-r border-slate-200 shrink-0">
      {/* Header Bar */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="font-bold text-slate-800 text-sm tracking-tight">
            Extracted Questions <span className="text-slate-400 font-normal">(from question paper)</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Total Score: <span className="font-bold text-emerald-600">{totalScored}</span> / {totalMax} Marks
          </p>
        </div>

        <button
          onClick={Object.keys(expandedIds).length > 0 ? collapseAll : expandAll}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-lg transition-colors border border-slate-200"
        >
          {Object.keys(expandedIds).length > 0 ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Analytics Banner CTA */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-xs font-semibold text-orange-900">
            AI Grading Insights & Detailed Report
          </span>
        </div>
        <button
          onClick={onOpenGradingSummary}
          className="text-xs font-bold text-orange-600 hover:text-orange-800 underline flex items-center space-x-1"
        >
          <span>View Analytics</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({questions.length})
        </button>
        <button
          onClick={() => setFilter('correct')}
          className={`px-3 py-1.5 rounded-full transition-colors ${
            filter === 'correct'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          Correct ({questions.filter((q) => q.status === 'correct').length})
        </button>
        <button
          onClick={() => setFilter('partial')}
          className={`px-3 py-1.5 rounded-full transition-colors ${
            filter === 'partial'
              ? 'bg-amber-600 text-white font-bold'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          Partial ({questions.filter((q) => q.status === 'partial').length})
        </button>
        <button
          onClick={() => setFilter('unanswered')}
          className={`px-3 py-1.5 rounded-full transition-colors ${
            filter === 'unanswered'
              ? 'bg-red-600 text-white font-bold'
              : 'text-red-700 hover:bg-red-50'
          }`}
        >
          Unanswered ({questions.filter((q) => q.status === 'unanswered').length})
        </button>
      </div>

      {/* Questions Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-300">
        {filteredQuestions.map((q, idx) => {
          const isSelected = q.id === selectedQuestionId;
          const isExpanded = !!expandedIds[q.id];
          const answerPagesList = q.answerPages || [];

          // Score Badge Color Styling
          let badgeBg = 'bg-emerald-100 text-emerald-700 border-emerald-300';
          if (q.status === 'unanswered' || q.scoredMarks === 0) {
            badgeBg = 'bg-red-100 text-red-700 border-red-300';
          } else if (q.status === 'partial') {
            badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
          }

          // Clean sub-part text to prevent double parentheses
          const cleanSubpart = q.subPart ? q.subPart.replace(/[()]/g, '') : null;

          // Unique React key for every question item
          const uniqueKey = q.id ? `${q.id}-${idx}` : `q-item-${idx}`;

          return (
            <div
              key={uniqueKey}
              onClick={() => onSelectQuestion(q.id)}
              className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Question Item Card Top Row */}
              <div className="p-4 flex items-start space-x-3">
                {/* Question Number Badge */}
                <div
                  className={`min-w-[28px] h-7 px-2.5 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs whitespace-nowrap ${
                    isSelected
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {q.number || `${idx + 1}`}
                </div>

                {/* Question Body */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {q.text || `Question ${q.number || idx + 1}`}
                  </p>

                  {/* Badges Bar */}
                  <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    {cleanSubpart && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        Sub-part ({cleanSubpart})
                      </span>
                    )}

                    {q.isOutOfOrder && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        Answered Out of Order
                      </span>
                    )}

                    {answerPagesList.length > 1 && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                        <Layers className="w-3 h-3" />
                        <span>Multi-Page Answer ({answerPagesList.length} Pages)</span>
                      </span>
                    )}

                    {q.status === 'unanswered' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Unanswered / Blank</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Badge Pill & Accordion Expand Button */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${badgeBg}`}
                  >
                    {q.scoredMarks ?? 0}/{q.maxMarks ?? 0}
                  </span>

                  <button
                    onClick={(e) => toggleExpand(q.id, e)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Accordion: AI Feedback */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 bg-slate-50 border-t border-slate-100 space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      <span>AI Feedback</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5">
                      {q.aiFeedback || 'Evaluation complete.'}
                    </p>
                  </div>

                  {q.studentAnswerText && (
                    <div className="p-2.5 bg-slate-100/80 rounded-lg text-[11px] font-mono text-slate-700 border border-slate-200/60">
                      <span className="font-bold text-slate-900">Transcript: </span>
                      {q.studentAnswerText}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
