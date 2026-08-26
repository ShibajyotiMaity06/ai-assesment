'use client';

import React, { useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { Question, UnmatchedAnswer } from '@/lib/types';

interface AnswerSheetViewerProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
  questions: Question[];
  unmatchedAnswers: UnmatchedAnswer[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  customAnswerSheetImages?: string[];
}

export default function AnswerSheetViewer({
  currentPage,
  totalPages,
  onPageChange,
  questions = [],
  unmatchedAnswers = [],
  selectedQuestionId,
  onSelectQuestion,
  zoomLevel,
  setZoomLevel,
  customAnswerSheetImages = [],
}: AnswerSheetViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBoxRef = useRef<HTMLDivElement>(null);

  // Selected question object
  const selectedQuestion = (questions || []).find((q) => q.id === selectedQuestionId);
  const selectedAnswerPages = selectedQuestion?.answerPages || [];
  const isUnanswered = selectedQuestion?.status === 'unanswered' || selectedAnswerPages.length === 0;

  // Check if selected question's answer is on another page
  const isSelectedQuestionOnOtherPage =
    selectedQuestion &&
    !isUnanswered &&
    selectedAnswerPages.length > 0 &&
    !selectedAnswerPages.includes(currentPage);

  const targetPageForSelectedQuestion =
    selectedAnswerPages.length > 0
      ? selectedAnswerPages[0]
      : null;

  // Auto-scroll to active box when selected question changes
  useEffect(() => {
    if (activeBoxRef.current && containerRef.current) {
      activeBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedQuestionId, currentPage]);

  const customPageImage = customAnswerSheetImages[currentPage];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden relative border-l border-slate-700 w-full">
      {/* Top Toolbar Bar */}
      <div className="h-12 bg-slate-800 text-white px-3 md:px-4 flex items-center justify-between z-10 shrink-0 border-b border-slate-700 select-none text-xs">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-semibold text-xs text-slate-200 tracking-wide hidden sm:inline">
            Answer Sheet Viewer
          </span>
          {customPageImage && (
            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
              Uploaded Mode
            </span>
          )}
          {selectedQuestion && (
            <span
              className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full truncate max-w-[160px] sm:max-w-none ${
                isUnanswered
                  ? 'bg-red-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isUnanswered
                ? `Q${selectedQuestion.number} (Unanswered)`
                : `Highlighting Q${selectedQuestion.number}`}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
              className="p-1 hover:text-orange-400 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-medium text-slate-300 text-[11px]">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="p-1 hover:text-orange-400 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1 disabled:opacity-30 hover:text-orange-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-200 text-[11px]">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="p-1 disabled:opacity-30 hover:text-orange-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Banner for UNANSWERED Questions */}
      {selectedQuestion && isUnanswered && (
        <div className="bg-red-500 text-white px-3 md:px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md z-20">
          <div className="flex items-center space-x-2 truncate">
            <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />
            <span className="truncate">
              Question {selectedQuestion.number} was left blank by the student.
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold bg-red-700 px-2 py-0.5 rounded shrink-0">
            0 / {selectedQuestion.maxMarks} Marks
          </span>
        </div>
      )}

      {/* Banner if selected answer is on another page */}
      {isSelectedQuestionOnOtherPage && targetPageForSelectedQuestion !== null && (
        <div className="bg-orange-500 text-white px-3 md:px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md z-20 animate-pulse">
          <div className="flex items-center space-x-2 truncate">
            <Info className="w-4 h-4 shrink-0" />
            <span className="truncate">
              Answer for Question {selectedQuestion.number} is on Page{' '}
              {targetPageForSelectedQuestion + 1}.
            </span>
          </div>
          <button
            onClick={() => onPageChange(targetPageForSelectedQuestion)}
            className="flex items-center space-x-1 bg-white text-orange-700 px-2.5 py-1 rounded-md font-bold text-[11px] hover:bg-orange-50 transition-colors shadow-xs shrink-0"
          >
            <span>Page {targetPageForSelectedQuestion + 1}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Canvas Document Area - Fully responsive canvas container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 flex justify-center items-start bg-slate-950 scrollbar-thin scrollbar-thumb-slate-700"
      >
        <div
          className="relative bg-[#f7f9f6] shadow-2xl rounded-sm transition-transform duration-200 origin-top overflow-hidden border border-slate-300 max-w-full"
          style={{
            width: '680px',
            minHeight: '880px',
            transform: `scale(${zoomLevel / 100})`,
            backgroundImage: !customPageImage
              ? 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, transparent 48px, #f87171 49px, #f87171 50px, transparent 51px)'
              : undefined,
            backgroundSize: !customPageImage ? '100% 28px, 100% 100%' : undefined,
          }}
        >
          {/* Custom Uploaded Page Image or Default Demo Content */}
          {customPageImage ? (
            <div className="w-full h-full min-h-[880px] relative">
              <img
                src={customPageImage}
                alt={`Uploaded Answer Sheet Page ${currentPage + 1}`}
                className="w-full h-auto object-contain block select-none"
              />
            </div>
          ) : (
            <HandwrittenPageContent pageIndex={currentPage} />
          )}

          {/* Bounding Box Overlay */}
          {(questions || []).map((q) => {
            const boxes = q.boundingBoxes || [];
            const ansPages = q.answerPages || [];

            return boxes
              .filter((box) => box.pageIndex === currentPage)
              .map((box) => {
                const isSelected = q.id === selectedQuestionId;

                if (!isSelected) {
                  return (
                    <div
                      key={box.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectQuestion(q.id);
                      }}
                      className="absolute cursor-pointer hover:border-2 hover:border-slate-300 hover:bg-slate-500/5 transition-all rounded-md z-10"
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={box.id}
                    ref={activeBoxRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectQuestion(q.id);
                    }}
                    className="absolute cursor-pointer transition-all duration-300 rounded-lg border-3 border-emerald-500 bg-emerald-500/15 ring-4 ring-emerald-500/30 shadow-xl z-30 animate-pulse"
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                  >
                    {/* Bounding Box Green Label Tag Badge */}
                    <div className="absolute -top-3.5 -left-1.5 flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-black shadow-lg bg-emerald-600 text-white ring-2 ring-white z-40">
                      <span>{box.label || `Q${q.number}`}</span>
                      {ansPages.length > 1 && (
                        <span className="text-[9px] bg-emerald-800 px-1 rounded font-normal">
                          Multi-Page
                        </span>
                      )}
                    </div>
                  </div>
                );
              });
          })}

          {/* Unmatched Answers Overlay */}
          {(unmatchedAnswers || [])
            .filter((u) => u.pageIndex === currentPage)
            .map((u) => (
              <div
                key={u.id}
                className="absolute border-2 border-dashed border-amber-500/60 bg-amber-500/5 hover:border-amber-500 hover:bg-amber-500/15 rounded-md p-1 z-20 transition-all cursor-pointer"
                style={{
                  left: `${u.boundingBox?.x ?? 0}%`,
                  top: `${u.boundingBox?.y ?? 0}%`,
                  width: `${u.boundingBox?.width ?? 90}%`,
                  height: `${u.boundingBox?.height ?? 10}%`,
                }}
              >
                <div className="absolute -top-3 -left-1 bg-amber-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow">
                  Unmatched Note
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Subcomponent rendering realistic handwriting & biology diagrams for default demo page
function HandwrittenPageContent({ pageIndex }: { pageIndex: number }) {
  if (pageIndex === 0) {
    return (
      <div className="p-8 sm:p-12 font-serif text-slate-800 leading-relaxed text-sm space-y-7 select-none">
        {/* Q1 Answer */}
        <div className="min-h-[180px]">
          <p className="font-bold text-slate-900 text-base">
            Q1.{' '}
            <span className="font-serif text-slate-800 italic font-normal">
              Photosynthesis is the process used by green plants and some other
              organisms to convert light energy into chemical energy.
            </span>
          </p>

          <div className="my-2.5 pl-6 py-1.5 border-l-2 border-slate-400 font-mono text-xs text-slate-900 bg-slate-100/60 rounded">
            6CO₂ + 6H₂O &nbsp; ─── Light / Chlorophyll ───► &nbsp; C₆H₁₂O₆ +
            6O₂
          </div>

          <div className="my-2 flex items-center justify-center p-2 bg-white/80 rounded-xl border border-slate-200 shadow-xs">
            <svg className="w-52 h-28" viewBox="0 0 240 120">
              <circle cx="190" cy="25" r="12" fill="#fbbf24" />
              <path
                d="M 170 25 L 160 25 M 190 10 L 190 2 M 205 18 L 213 10"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text x="140" y="38" fontSize="10" fill="#d97706" fontWeight="bold">
                Sunlight ➔
              </text>
              <path
                d="M 120 110 C 120 80, 118 60, 120 40"
                stroke="#15803d"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 120 70 C 80 50, 60 60, 80 80 C 100 90, 120 70, 120 70"
                fill="#22c55e"
                stroke="#15803d"
              />
              <text x="15" y="60" fontSize="10" fill="#334155" fontWeight="bold">
                Carbon dioxide ➔
              </text>
              <text x="150" y="65" fontSize="10" fill="#0284c7" fontWeight="bold">
                ➔ Oxygen
              </text>
            </svg>
          </div>
        </div>

        {/* Q2 Answer */}
        <div className="min-h-[190px] pt-4">
          <p className="font-bold text-slate-900 text-base">
            Q2.{' '}
            <span className="font-serif text-slate-800 italic font-normal">
              The process mainly occurs in the chloroplast of the plant cell.
              It has two main stages:
            </span>
          </p>
          <ol className="list-decimal pl-6 mt-1.5 space-y-1 font-serif text-slate-700 text-sm">
            <li>Light reaction - Captures light energy in thylakoid membranes.</li>
            <li>Dark reaction - Uses ATP/NADPH energy to make glucose in stroma.</li>
          </ol>
        </div>

        {/* Q3 Answer */}
        <div className="min-h-[220px] pt-6">
          <p className="font-bold text-slate-900 text-base">
            Q3.{' '}
            <span className="font-serif text-slate-800 italic font-normal">
              Chloroplasts contain chlorophyll pigments (chlorophyll a and b)
              located in the thylakoid membranes. Solar light absorption
              drives photolysis of water.
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-600 italic">
            Light dependent reaction splits water into oxygen and hydrogen ions.
            The Calvin cycle subsequently fixes carbon dioxide into sugar molecules.
          </p>
        </div>
      </div>
    );
  }

  if (pageIndex === 1) {
    return (
      <div className="p-8 sm:p-12 font-serif text-slate-800 leading-relaxed text-sm space-y-8 select-none">
        {/* Q5 Answer */}
        <div className="min-h-[240px]">
          <p className="font-bold text-slate-900 text-base">
            Q5. Alveolus Structure & Gas Exchange Diagram
          </p>
          <div className="my-3 flex items-center justify-center p-4 bg-white/90 rounded-xl border border-slate-200">
            <svg className="w-64 h-32" viewBox="0 0 260 130">
              <circle
                cx="130"
                cy="65"
                r="40"
                fill="#fecdd3"
                stroke="#e11d48"
                strokeWidth="2"
              />
              <text x="105" y="67" fontSize="10" fill="#9f1239" fontWeight="bold">
                Air Space
              </text>
              <path
                d="M 60 65 A 65 65 0 0 0 200 65"
                fill="none"
                stroke="#2563eb"
                strokeWidth="5"
                strokeDasharray="4 2"
              />
              <text x="25" y="60" fontSize="10" fill="#1d4ed8" fontWeight="bold">
                Capillary ➔
              </text>
            </svg>
          </div>
        </div>

        {/* Q6 Answer */}
        <div className="min-h-[250px] pt-4">
          <p className="font-bold text-slate-900 text-base">
            Q6. Human Digestive System Diagram
          </p>
          <p className="italic text-slate-700 mt-2">
            Stomach initiates protein breakdown. Small intestine is the main site
            where most absorption occurs (villi increase surface area).
          </p>
        </div>

        {/* Q2 Continued on Page 2 */}
        <div className="pt-6 border-t border-slate-300">
          <p className="font-bold text-slate-900 text-sm">
            Q2 (contd.). Summary of Calvin cycle & stroma enzyme action.
          </p>
        </div>
      </div>
    );
  }

  if (pageIndex === 2) {
    return (
      <div className="p-8 sm:p-12 font-serif text-slate-800 leading-relaxed text-sm space-y-8 select-none">
        {/* Q7 Answer */}
        <div className="min-h-[300px]">
          <p className="font-bold text-slate-900 text-base">
            Q7. Structure of a Nephron
          </p>
          <div className="my-4 p-4 bg-white/90 rounded-xl border border-slate-200 flex justify-center">
            <svg className="w-64 h-36" viewBox="0 0 260 140">
              <path
                d="M 30 40 C 60 20, 70 70, 100 70 L 140 70 L 150 120 L 170 120 L 180 40 L 220 40"
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
              />
              <circle cx="30" cy="40" r="12" fill="#fef3c7" stroke="#b45309" />
              <text x="10" y="20" fontSize="9" fill="#92400e" fontWeight="bold">
                Bowman&apos;s Capsule
              </text>
              <text x="130" y="135" fontSize="9" fill="#92400e" fontWeight="bold">
                Loop of Henle
              </text>
            </svg>
          </div>
        </div>

        {/* Q8 Answer */}
        <div className="min-h-[240px] pt-4">
          <p className="font-bold text-slate-900 text-base">
            Q8. Palisade vs Spongy Mesophyll
          </p>
          <p className="italic text-slate-700 mt-2">
            Palisade cells are vertically elongated and packed with chloroplasts
            to maximize light trapping. Spongy mesophyll cells are loosely
            arranged with air channels for rapid diffusion of gases.
          </p>
        </div>

        {/* Unmatched Note */}
        <div className="pt-6 border-t border-slate-300">
          <p className="text-xs italic text-slate-600 font-sans">
            Note: Photosynthetic Quotient PQ = CO₂ evolved / O₂ absorbed = 1.0
            for carbohydrates.
          </p>
        </div>
      </div>
    );
  }

  // Page 4 (index 3)
  return (
    <div className="p-6 sm:p-10 font-serif text-slate-800 leading-relaxed text-xs space-y-7 select-none">
      {/* Q9 Answer */}
      <div className="min-h-[90px] pt-1">
        <p className="font-bold text-slate-900 text-sm">
          Q9. Transpiration Process
        </p>
        <p className="italic text-slate-700 mt-1">
          Transpiration is the evaporation of water vapor from leaf stomata.
          Factors increasing rate: 1. Higher temperature 2. Increased wind velocity.
        </p>
      </div>

      {/* Q10 Answer */}
      <div className="min-h-[90px] pt-2">
        <p className="font-bold text-slate-900 text-sm">
          Q10. Xylem Vessel Structure
        </p>
        <p className="italic text-slate-700 mt-1">
          Lignified walls provide mechanical strength preventing vessel collapse
          under high transpiration pull.
        </p>
      </div>

      {/* Q11 (a) Answer */}
      <div className="min-h-[95px] pt-2">
        <p className="font-bold text-slate-900 text-sm">
          Q11 (a). Etiolation in Plant B
        </p>
        <p className="italic text-slate-700 mt-1">
          Plant B shows etiolation because in dim light plants elongate stems to
          reach light and cannot synthesize chlorophyll efficiently.
        </p>
      </div>

      {/* Q11 (b) Answer */}
      <div className="min-h-[95px] pt-2">
        <p className="font-bold text-slate-900 text-sm">
          Q11 (b). Recovery Measure
        </p>
        <p className="italic text-slate-700 mt-1">
          Move Plant B back into direct sunlight location.
        </p>
      </div>

      {/* Q12 Answer */}
      <div className="min-h-[90px] pt-2">
        <p className="font-bold text-slate-900 text-sm">
          Q12. Minute Ventilation Calculation
        </p>
        <p className="font-mono text-xs text-slate-800 mt-1">
          Minute Ventilation = Tidal Volume × Respiratory Rate = 0.5 L × 12 = 6.0 L/min.
        </p>
      </div>

      {/* Q13 Answer */}
      <div className="min-h-[90px] pt-2">
        <p className="font-bold text-slate-900 text-sm">
          Q13. Alveolar Ventilation Calculation
        </p>
        <p className="font-mono text-xs text-slate-800 mt-1">
          Alveolar Ventilation = (Tidal Volume - Dead Space) × Rate = (0.5 - 0.15) L × 12 = 4.2 L/min.
        </p>
      </div>
    </div>
  );
}
