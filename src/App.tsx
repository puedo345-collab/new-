import React, { useState, useRef } from 'react';
import { SurveyResponses } from './types';
import Header from './components/Header';
import MainHero from './components/MainHero';
import QualificationCheck from './components/QualificationCheck';
import ResultDashboard from './components/ResultDashboard';
import EligibilityNotes from './components/EligibilityNotes';
import Footer from './components/Footer';
import SuccessCaseMatcher from './components/SuccessCaseMatcher';
import RepaymentPlanBuilder from './components/RepaymentPlanBuilder';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, HeartHandshake, ShieldCheck, Info, X, Sparkles } from 'lucide-react';

export default function App() {
  const [surveyActive, setSurveyActive] = useState(false);
  const [surveyMode, setSurveyMode] = useState<string>('general');
  const [caseMatcherActive, setCaseMatcherActive] = useState(false);
  const [planSimulatorActive, setPlanSimulatorActive] = useState(false);
  const [userResponses, setUserResponses] = useState<SurveyResponses | null>(null);
  const [brandPopupActive, setBrandPopupActive] = useState(false);

  // References for scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'hero') {
      setSurveyActive(false);
      setCaseMatcherActive(false);
      setPlanSimulatorActive(false);
      setUserResponses(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'brand' || sectionId === 'service') {
      setBrandPopupActive(true);
    } else if (sectionId === 'stories' || sectionId === 'our-spirit') {
      eligibilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (sectionId === 'faq') {
      const faqEl = document.getElementById('faq');
      if (faqEl) {
        faqEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleStartSurvey = (mode?: string) => {
    setUserResponses(null); // Reset past scores
    if (mode === 'case') {
      setCaseMatcherActive(true);
      setPlanSimulatorActive(false);
      setSurveyActive(false);
    } else if (mode === 'plan') {
      setPlanSimulatorActive(false);
      setCaseMatcherActive(false);
      setSurveyActive(false);
      setTimeout(() => {
        calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return; // Skip standard scrolling
    } else {
      setSurveyActive(true);
      setSurveyMode(mode || 'general');
      setCaseMatcherActive(false);
      setPlanSimulatorActive(false);
    }
    // Scroll smoothly to target survey zone
    setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSurveyComplete = (responses: SurveyResponses) => {
    setUserResponses(responses);
    // Smooth scroll back up to results dashboard
    setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRestartSurvey = () => {
    setUserResponses(null);
    setSurveyActive(true);
    setSurveyMode('general');
    setCaseMatcherActive(false);
    setPlanSimulatorActive(false);
    setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCancelSurvey = () => {
    setSurveyActive(false);
    setCaseMatcherActive(false);
    setPlanSimulatorActive(false);
    setUserResponses(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white" id="main-landing-wrap">
      {/* Universal Sticky Header */}
      <Header
        onNavClick={handleNavClick}
        onStartSurvey={() => handleStartSurvey('general')}
      />

      {/* Main Container */}
      <main className="flex-1 w-full flex flex-col" id="landing-main-stage">
        
        {/* Dynamic Display Anchor Area */}
        <div ref={heroRef} className="scroll-mt-20">
          <AnimatePresence mode="wait">
            {!surveyActive && !caseMatcherActive && !planSimulatorActive && !userResponses ? (
              // Case 1: Standard Homepage Intro Hero Area
              <motion.div
                key="home-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <MainHero onStartSurvey={handleStartSurvey} />

                {/* Direct display of RepaymentPlanBuilder on the main page */}
                <div ref={calculatorRef} className="scroll-mt-24 bg-slate-100/40 py-16 border-t border-slate-200/50 relative">
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-sky-400/5 blur-3xl pointer-events-none" />
                  
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center mb-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-extrabold text-emerald-800 shadow-3xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                        <span>추가 특화 서비스 단독 탑재</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        맞춤형 월 변제 상환계획기
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-500 font-bold max-w-lg mx-auto leading-relaxed">
                        법무사 여환동 자격진단 특별 환산 기준을 적용하여, 본인의 소득과 최소 생계비 기준에 맞는 실시간 월 환산 변제금을 직접 편리하게 변경하며 설계해 보세요.
                      </p>
                    </div>

                    <RepaymentPlanBuilder
                      onSubmitPlan={(answers) => {
                        handleSurveyComplete(answers);
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : surveyActive && !userResponses ? (
              // Case 2: Survey Qualification Wizard in progress
              <motion.div
                key="survey-flow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-radial from-slate-55 to-slate-105/50 py-10 md:py-16"
              >
                <div className="text-center mb-6 px-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {surveyMode === 'debt' 
                      ? '법무사 여환동 채무 탕감 시뮬레이션 계산기' 
                      : '법무사 여환동 개인회생 자격 정밀 진단'}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1.5 max-w-sm mx-auto">
                    {surveyMode === 'debt'
                      ? '국세청 소득 가이드라인 및 회생 특별 기준을 적용하여 예상 원금 면제액을 즉시 계산합니다.'
                      : '법률 실무 준칙 및 기각 선례 분석 알고리즘에 기초하여 실시간 탕감 한도를 산출합니다.'}
                  </p>
                </div>
                <QualificationCheck
                  mode={surveyMode}
                  onComplete={handleSurveyComplete}
                  onCancel={handleCancelSurvey}
                />
              </motion.div>
            ) : caseMatcherActive && !userResponses ? (
              // Case 3: Success Case Matcher
              <motion.div
                key="case-matcher"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <SuccessCaseMatcher
                  onBack={handleCancelSurvey}
                  onSelectPlan={({ occupation, debtAmount }) => {
                    // pre-fill and start the survey!
                    setSurveyActive(true);
                    setSurveyMode('general');
                    setCaseMatcherActive(false);
                    setPlanSimulatorActive(false);
                  }}
                />
              </motion.div>
            ) : planSimulatorActive && !userResponses ? (
              // Case 4: 1:1 Repayment Plan Builder
              <motion.div
                key="plan-builder"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <RepaymentPlanBuilder
                  onBack={handleCancelSurvey}
                  onSubmitPlan={(answers) => {
                    handleSurveyComplete(answers);
                  }}
                />
              </motion.div>
            ) : (
              // Case 3: Simulation Diagnostic report result dashboard
              <motion.div
                key="report-dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-100/50 py-10 md:py-16"
              >
                <div className="text-center mb-4 px-4">
                  <span className="text-emerald-600 font-extrabold text-xs tracking-wider uppercase bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full">
                    ANALYSIS REPORT
                  </span>
                  <p className="text-xs text-slate-400 font-semibold mt-2">
                    작성일: {new Date().toLocaleDateString('ko-KR')} | 보안등급: 기밀 안심 보고
                  </p>
                </div>
                {userResponses && (
                  <ResultDashboard
                    responses={userResponses}
                    onRestart={handleRestartSurvey}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Permanent Premium Guidelines and Stories (Scroll Trigger Point) */}
        <div ref={eligibilityRef} className="scroll-mt-16" id="brand">
          <EligibilityNotes />
        </div>

      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Brand & Service introduction Modal Portal (Fallback for un-implemented subdomains) */}
      <AnimatePresence>
        {brandPopupActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur clickoff */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setBrandPopupActive(false)}
              className="absolute inset-0 bg-slate-950"
            />
            
            {/* Modal Body card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 overflow-hidden"
            >
              {/* Top Accent Light decoration */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 to-violet-600" />
              
              <button
                onClick={() => setBrandPopupActive(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                aria-label="Close brand popup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-emerald-600" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    법무사 여환동 사무소 및 서비스 소개
                  </h3>
                  <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    신속하고 정확한 고품격 법률 조력의 약속
                  </p>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  <p>
                    <strong>법무사 여환동 사무소</strong>는 과도한 부채의 힘겨운 굴레로부터 벗어나, 평온한 일상과 떳떳하고 안전한 사회 경제인으로 신속하게 복귀할 수 있도록 정성을 다해 돕습니다.
                  </p>
                  <p>
                    법무사 여환동 사무소가 의뢰자 한 분 한 분의 소득 구간, 자산 비율, 거주 지역 회생 법원의 최신 면책 실무 기준을 정교하게 분석하여, 독촉 중단과 높은 부채 원금 탕감을 이끌어 냅니다.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2.5">
                  <button
                    onClick={() => setBrandPopupActive(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    소개 닫기
                  </button>
                  <button
                    onClick={() => {
                      setBrandPopupActive(false);
                      handleStartSurvey('direct');
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-100 transition-colors cursor-pointer text-center"
                  >
                    지금 바로 진단하기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

