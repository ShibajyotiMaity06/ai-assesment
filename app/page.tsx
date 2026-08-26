'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UploadState from '@/components/UploadState';
import LoadingState from '@/components/LoadingState';
import MappingView from '@/components/MappingView';
import { Question, UnmatchedAnswer, ExamDocument } from '@/lib/types';
import { INITIAL_EXAM_DOCUMENT, MOCK_QUESTIONS, MOCK_UNMATCHED_ANSWERS } from '@/lib/sampleData';
import { processUploadedFile } from '@/lib/fileUtils';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('exams');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Core Flow State: 'upload' | 'extracting' | 'mapping'
  const [workflowStep, setWorkflowStep] = useState<'upload' | 'extracting' | 'mapping'>('upload');
  const [apiStatusMessage, setApiStatusMessage] = useState<string>('');

  // Document metadata state
  const [examDoc, setExamDoc] = useState<ExamDocument>(INITIAL_EXAM_DOCUMENT);
  const [hasQuestionPaper, setHasQuestionPaper] = useState<boolean>(true);
  const [hasAnswerSheet, setHasAnswerSheet] = useState<boolean>(true);

  // Uploaded base64 image data states
  const [qpImages, setQpImages] = useState<string[]>([]);
  const [asImages, setAsImages] = useState<string[]>([]);

  // Questions and unmatched answers result state
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [unmatchedAnswers, setUnmatchedAnswers] = useState<UnmatchedAnswer[]>(MOCK_UNMATCHED_ANSWERS);

  // File Upload handlers
  const handleQuestionPaperUpload = async (file?: File) => {
    if (file) {
      try {
        const processed = await processUploadedFile(file);
        setExamDoc((prev) => ({
          ...prev,
          questionPaperName: processed.name,
          questionPaperSize: processed.size,
          questionPaperPages: processed.pages,
        }));
        setQpImages(processed.dataUrls);
      } catch (e) {
        console.error('Error reading QP file:', e);
      }
    }
    setHasQuestionPaper(true);
  };

  const handleAnswerSheetUpload = async (file?: File) => {
    if (file) {
      try {
        const processed = await processUploadedFile(file);
        setExamDoc((prev) => ({
          ...prev,
          answerSheetName: processed.name,
          answerSheetSize: processed.size,
          answerSheetPages: processed.pages,
        }));
        setAsImages(processed.dataUrls);
      } catch (e) {
        console.error('Error reading AS file:', e);
      }
    }
    setHasAnswerSheet(true);
  };

  const handleRemoveQuestionPaper = () => {
    setHasQuestionPaper(false);
    setQpImages([]);
  };

  const handleRemoveAnswerSheet = () => {
    setHasAnswerSheet(false);
    setAsImages([]);
  };

  const handleLoadDemoSample = () => {
    setExamDoc(INITIAL_EXAM_DOCUMENT);
    setHasQuestionPaper(true);
    setHasAnswerSheet(true);
    setQpImages([]);
    setAsImages([]);
    setQuestions(MOCK_QUESTIONS);
    setUnmatchedAnswers(MOCK_UNMATCHED_ANSWERS);
  };

  // Trigger MiniMax AI vision analysis pipeline
  const handleStartMapping = async () => {
    setWorkflowStep('extracting');
    setApiStatusMessage('Connecting to MiniMax-M2.5 API model...');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionPaperImages: qpImages,
          answerSheetImages: asImages,
          questionPaperName: examDoc.questionPaperName,
          answerSheetName: examDoc.answerSheetName,
        }),
      });

      const resData = await response.json();
      console.log('[MiniMax API Response Received]:', resData);

      if (resData.success && resData.data) {
        if (resData.data.questions && resData.data.questions.length > 0) {
          setQuestions(resData.data.questions);
        }
        if (resData.data.unmatchedAnswers) {
          setUnmatchedAnswers(resData.data.unmatchedAnswers);
        }
      }
    } catch (err) {
      console.error('API call error:', err);
    } finally {
      setWorkflowStep('mapping');
    }
  };

  const handleBackToUpload = () => {
    setWorkflowStep('upload');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Container Wrapper */}
      <div className="flex-1 flex flex-col h-full bg-slate-100 p-0 md:p-4 md:pl-0">
        <div className="flex-1 flex flex-col bg-white rounded-none md:rounded-3xl shadow-xl overflow-hidden border-0 md:border border-slate-200/80 relative">
          {/* Top Header */}
          <Header
            title="Exams"
            onBack={workflowStep !== 'upload' ? handleBackToUpload : undefined}
            showBack={workflowStep !== 'upload'}
            onOpenMobileMenu={() => setMobileOpen(true)}
          />

          {/* Workflow Step Views */}
          {workflowStep === 'upload' && (
            <UploadState
              examDoc={examDoc}
              hasQuestionPaper={hasQuestionPaper}
              hasAnswerSheet={hasAnswerSheet}
              onQuestionPaperUpload={handleQuestionPaperUpload}
              onAnswerSheetUpload={handleAnswerSheetUpload}
              onRemoveQuestionPaper={handleRemoveQuestionPaper}
              onRemoveAnswerSheet={handleRemoveAnswerSheet}
              onStartMapping={handleStartMapping}
              onLoadDemoSample={handleLoadDemoSample}
            />
          )}

          {workflowStep === 'extracting' && (
            <LoadingState
              apiStatusMessage={apiStatusMessage}
              isRealApiActive={true}
            />
          )}

          {workflowStep === 'mapping' && (
            <MappingView
              questions={questions}
              unmatchedAnswers={unmatchedAnswers}
              examDoc={examDoc}
              customAnswerSheetImages={asImages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
