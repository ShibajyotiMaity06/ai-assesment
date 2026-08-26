'use client';

import React, { useState } from 'react';
import QuestionList from './QuestionList';
import AnswerSheetViewer from './AnswerSheetViewer';
import GradingSummaryModal from './GradingSummaryModal';
import { Question, UnmatchedAnswer, ExamDocument } from '@/lib/types';
import { Award, FileText, Eye } from 'lucide-react';

interface MappingViewProps {
  questions: Question[];
  unmatchedAnswers: UnmatchedAnswer[];
  examDoc: ExamDocument;
  customAnswerSheetImages?: string[];
}

export default function MappingView({
  questions = [],
  unmatchedAnswers = [],
  customAnswerSheetImages = [],
}: MappingViewProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    (questions || []).length > 0 ? questions[0].id : null
  );
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showGradingModal, setShowGradingModal] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'questions' | 'answersheet'>(
    'questions'
  );

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    const targetQ = (questions || []).find((q) => q.id === id);
    const targetAnsPages = targetQ?.answerPages || [];
    if (targetQ && targetAnsPages.length > 0) {
      setCurrentPage(targetAnsPages[0]);
    }
  };

  const totalPages = customAnswerSheetImages.length > 0 ? customAnswerSheetImages.length : 4;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative w-full">
      {/* Mobile Tab Switcher Bar - Shown on mobile & tablet screens */}
      <div className="lg:hidden bg-slate-900 text-white px-3 py-2 flex items-center justify-between shrink-0 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-1.5 flex-1 max-w-xs">
          <button
            onClick={() => setMobileTab('questions')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1 ${
              mobileTab === 'questions'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Questions ({(questions || []).length})</span>
          </button>

          <button
            onClick={() => setMobileTab('answersheet')}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1 ${
              mobileTab === 'answersheet'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Answer Sheet</span>
          </button>
        </div>

        <button
          onClick={() => setShowGradingModal(true)}
          className="p-2 bg-slate-800 text-orange-400 hover:bg-slate-700 rounded-xl flex items-center space-x-1 text-xs font-bold border border-slate-700"
          title="Grading Summary"
        >
          <Award className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </button>
      </div>

      {/* Main Split Layout View */}
      <div className="flex-1 flex overflow-hidden relative w-full">
        {/* Left Pane - Extracted Questions List */}
        <div
          className={`h-full ${
            mobileTab === 'questions' ? 'flex w-full' : 'hidden'
          } lg:flex lg:w-auto`}
        >
          <QuestionList
            questions={questions}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={handleSelectQuestion}
            onOpenGradingSummary={() => setShowGradingModal(true)}
          />
        </div>

        {/* Right Pane - Answer Sheet Visual Viewer */}
        <div
          className={`h-full flex-1 ${
            mobileTab === 'answersheet' ? 'flex w-full' : 'hidden'
          } lg:flex`}
        >
          <AnswerSheetViewer
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            questions={questions}
            unmatchedAnswers={unmatchedAnswers}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={handleSelectQuestion}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            customAnswerSheetImages={customAnswerSheetImages}
          />
        </div>
      </div>

      {/* Analytics Modal */}
      {showGradingModal && (
        <GradingSummaryModal
          questions={questions}
          unmatchedAnswers={unmatchedAnswers}
          onClose={() => setShowGradingModal(false)}
        />
      )}
    </div>
  );
}
