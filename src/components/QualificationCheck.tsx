import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS } from '../data';
import { SurveyResponses } from '../types';
import { ShieldCheck, ChevronLeft, ArrowRight, User, Phone, CheckSquare, Calendar, HelpCircle, Lock } from 'lucide-react';

interface QualificationCheckProps {
  onComplete: (responses: SurveyResponses) => void;
  onCancel: () => void;
  mode?: string;
}

export default function QualificationCheck({ onComplete, onCancel, mode = 'general' }: QualificationCheckProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<SurveyResponses>>({
    occupation: '',
    debtAmount: '',
    hasMoreDebtThanAssets: '',
    region: '',
    difficulties: [],
    name: '',
    ageGroup: '',
    phone: ''
  });

  const [formError, setFormError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const totalSteps = QUESTIONS.length + 1; // 5 questions + User form
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handleSingleSelect = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    
    // Auto-advance for single-choice steps (Step 0 to 3)
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 250);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const toggleDifficulty = (value: string) => {
    const prevDifficulties = answers.difficulties || [];
    let updated: string[];
    if (prevDifficulties.includes(value)) {
      updated = prevDifficulties.filter((d) => d !== value);
    } else {
      updated = [...prevDifficulties, value];
    }
    setAnswers((prev) => ({ ...prev, difficulties: updated }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      // Validation for difficulties: recommended to select at least one
      if (currentStep === QUESTIONS.length - 1 && (!answers.difficulties || answers.difficulties.length === 0)) {
        setFormError('최소 한 가지 이상 고민을 선택해 주세요.');
        return;
      }
      setFormError('');
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setFormError('');
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel();
    }
  };

  // Submit the entire survey
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!answers.name || answers.name.trim().length === 0) {
      setFormError('성함을 입력해 주세요.');
      return;
    }
    if (!answers.ageGroup) {
      setFormError('연령대를 선택해 주세요.');
      return;
    }
    const phonePattern = /^(010|011|016|017|018|019)[- ]?\d{3,4}[- ]?\d{4}$/;
    if (!answers.phone || !phonePattern.test(answers.phone.replace(/[^0-9]/g, ''))) {
      setFormError('올바른 한국 핸드폰 번호(예: 010-1234-5678)를 입력해 주세요.');
      return;
    }
    if (!agreeTerms) {
      setFormError('개인정보 수집 및 자격 진단용 활용 약관에 동의해 주세요.');
      return;
    }

    // Call success handler
    onComplete(answers as SurveyResponses);
  };

  // Auto hyphen for phone
  const formatPhone = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  // Check if current question's option is selected
  const getSelectedValue = (key: string) => {
    return answers[key as keyof SurveyResponses] as string;
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        
        {/* Top bar progress indicators */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              안전 암호화 자가진단 시스템
            </span>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400">
            {progressPercent}% 완료
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Content Box */}
        <div className="p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {currentStep < QUESTIONS.length ? (
              // Quiz Step layout
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Step indicator */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <span>질문 {currentStep + 1} / {QUESTIONS.length}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-extrabold">
                    {mode === 'debt' 
                      ? '📊 [계산기] 실시간 채무 탕감 시뮬레이션' 
                      : mode === 'qualification' 
                      ? '🔒 [자격확인] 개인회생 신청자격 무료 심사' 
                      : '개인회생 자격 요건'}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {QUESTIONS[currentStep].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    {QUESTIONS[currentStep].subtitle}
                  </p>
                </div>

                {/* Multiple Options Choice list */}
                {QUESTIONS[currentStep].id !== 'difficulties' ? (
                  // Single selection questions (Occupation, Debt, Asset, Region)
                  <div className="space-y-3 pt-2">
                    {QUESTIONS[currentStep].options.map((opt) => {
                      const isSelected = getSelectedValue(QUESTIONS[currentStep].id) === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSingleSelect(QUESTIONS[currentStep].id, opt.value)}
                          className={`w-full p-4 rounded-2xl border text-left font-bold text-sm sm:text-base tracking-tight transition-all duration-200 cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50/50 hover:border-slate-300'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <div
                            className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // Multi select question (Difficulties)
                  <div className="space-y-3 pt-2">
                    {QUESTIONS[currentStep].options.map((opt) => {
                      const isSelected = (answers.difficulties || []).includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleDifficulty(opt.value)}
                          className={`w-full p-4 rounded-xl border text-left font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-violet-600 bg-violet-50/60 text-violet-950'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <div
                            className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-violet-600 bg-violet-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckSquare className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              // Final Step form
              <motion.div
                key="form-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <span className="text-violet-600 font-extrabold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-violet-600" />
                    마지막 단계
                  </span>
                  <span>•</span>
                  <span>분석 결과 수령처 입력</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    상황별 탕감 플랜을 어디로 보낼까요?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    회생 법원 공식 요율표 상 맞춤 탕감 가능 비율과 월 예상 변제금을 안전하게 시뮬레이션하여 보여 드립니다.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  {/* Name field */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">신청인 이름</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="실명명을 입력해 주세요"
                        value={answers.name || ''}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-violet-500 focus:bg-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Age Group */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">연령대 선택</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['20대', '30대', '40대', '50대이상'].map((age) => (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, ageGroup: age }))}
                          className={`py-2 px-3 rounded-xl border text-center font-bold text-xs tracking-tight transition-all duration-200 cursor-pointer ${
                            answers.ageGroup === age
                              ? 'border-violet-600 bg-violet-50 text-violet-950 text-emerald-800'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">결과 전송 휴대폰 번호</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={answers.phone || ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))
                        }
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-violet-500 focus:bg-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Privacy checkbox */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4.5 h-4.5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="terms" className="text-xs font-semibold text-slate-500 leading-snug cursor-pointer select-none">
                      개인정보 수집 및 자격 진단용 상담 활용 동의 (필수)
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        상담 및 탕감 통보 목적 외에 상업 광고나 무분별한 3자 유출은 절대 없습니다. (철저 보안 보장)
                      </span>
                    </label>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation/Submit Controls */}
          <div className="space-y-3 pt-6 border-t border-slate-100 mt-6 shrink-0">
            {formError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2 text-center rounded-xl animate-bounce">
                ⚠️ {formError}
              </p>
            )}

            <div className="flex gap-3">
              {/* Back button */}
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-500 font-bold hover:bg-slate-50 transition-colors flex items-center gap-1 shrink-0 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
                뒤로
              </button>

              {currentStep < QUESTIONS.length ? (
                // Only show "Next" for difficulties multi-select
                QUESTIONS[currentStep].id === 'difficulties' ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm tracking-wide shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    다음 단계 질문으로
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <div className="flex-1 text-center py-3.5 text-xs text-slate-400 font-semibold flex items-center justify-center select-none bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    선택하시면 다음 질문으로 자동 이동됩니다.
                  </div>
                )
              ) : (
                // Finish button
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-emerald-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-violet-200 hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  진단 결과 및 탕감 플랜 확인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
