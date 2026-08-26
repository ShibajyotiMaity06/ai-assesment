'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Bot } from 'lucide-react';

interface LoadingStateProps {
  apiStatusMessage?: string;
  isRealApiActive?: boolean;
}

export default function LoadingState({
  apiStatusMessage,
  isRealApiActive = true,
}: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Reading uploaded PDF & image document pages...',
    'Invoking MiniMax AI Vision Engine (MiniMax-M2.5)...',
    'Extracting printed questions & sub-parts (11a, 11b)...',
    'Mapping answer sheet bounding box coordinates & scoring...',
  ];

  // Stage progress animation while waiting for actual API promise to resolve
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1500);
    const timer2 = setTimeout(() => setCurrentStep(2), 3500);
    const timer3 = setTimeout(() => setCurrentStep(3), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white relative overflow-hidden">
      {/* Animated Glowing Background Aura */}
      <div className="absolute w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -z-0 animate-pulse" />

      {/* Central Animated Orange Sparkles */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-orange-500 animate-bounce" />
            <Sparkles className="w-8 h-8 text-amber-500 absolute -top-2 -right-2 animate-ping" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Extracting with MiniMax AI</span>
          <Bot className="w-6 h-6 text-orange-600 animate-pulse" />
        </h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          {apiStatusMessage || 'Awaiting live response from MiniMax-M2.5 API...'}
        </p>

        {/* Dynamic Progress Indicator Bar */}
        <div className="mt-8 w-80 space-y-3">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 h-full transition-all duration-700 ease-out rounded-full animate-pulse"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>

          <div className="space-y-2 mt-4 text-left">
            {steps.map((stepText, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-2.5 text-xs transition-opacity duration-300 ${
                    isDone
                      ? 'text-emerald-600 font-semibold'
                      : isCurrent
                      ? 'text-slate-800 font-bold animate-pulse'
                      : 'text-slate-300'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                        isCurrent
                          ? 'border-orange-500 border-t-transparent animate-spin'
                          : 'border-slate-200'
                      }`}
                    />
                  )}
                  <span>{stepText}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live API Key Status Indicator */}
        <div className="mt-6 flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Active MiniMax HTTP Request in Progress</span>
        </div>
      </div>
    </div>
  );
}
