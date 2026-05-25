import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SUCCESS_STORIES } from '../data';
import { Users, Filter, ArrowRight, CheckCircle2, Award, ChevronLeft, ShieldCheck, PhoneCall } from 'lucide-react';

interface SuccessCaseMatcherProps {
  onBack: () => void;
  onSelectPlan: (answers: { occupation: string; debtAmount: string }) => void;
}

export default function SuccessCaseMatcher({ onBack, onSelectPlan }: SuccessCaseMatcherProps) {
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedDebt, setSelectedDebt] = useState<string>('all');
  const [matchingStep, setMatchingStep] = useState<'filter' | 'result'>('filter');

  const jobs = [
    { value: 'all', label: '전체 보기' },
    { value: 'employee', label: '일반 직장인' },
    { value: 'freelancer', label: '프리랜서 / 일용직' },
    { value: 'business', label: '개인사업자' }
  ];

  const debts = [
    { value: 'all', label: '전체 금액' },
    { value: 'under_50m', label: '5천만 원 미만' },
    { value: 'over_50m', label: '5천만 원 이상' }
  ];

  const getFilteredStories = () => {
    return SUCCESS_STORIES.filter((story) => {
      // Filter by job category
      let matchJob = true;
      if (selectedJob !== 'all') {
        if (selectedJob === 'employee') {
          matchJob = story.job.includes('직장인');
        } else if (selectedJob === 'freelancer') {
          matchJob = story.job.includes('프리랜서');
        } else if (selectedJob === 'business') {
          matchJob = story.job.includes('사업자');
        }
      }

      // Filter by debt amount
      let matchDebt = true;
      if (selectedDebt !== 'all') {
        // Parse originalDebt string e.g., '6,400만 원', '1억 2,000만 원'
        const isEok = story.originalDebt.includes('억');
        const numPart = parseFloat(story.originalDebt.replace(/[^0-9.]/g, ''));
        const debtVal = isEok ? numPart * 10000 : numPart; // in man-won

        if (selectedDebt === 'under_50m') {
          matchDebt = debtVal < 5000;
        } else if (selectedDebt === 'over_50m') {
          matchDebt = debtVal >= 5000;
        }
      }

      return matchJob && matchDebt;
    });
  };

  const filteredStories = getFilteredStories();

  const handleApplyMatch = (story: typeof SUCCESS_STORIES[0]) => {
    // Map story parameters to equivalent survey options to pre-set survey
    let occOpt = 'regular_employee';
    if (story.job.includes('프리랜서')) occOpt = 'freelancer_parttime';
    if (story.job.includes('사업자')) occOpt = 'business_owner';

    let debtOpt = '30m_50m';
    if (story.originalDebt.includes('1억') || story.originalDebt.includes('2억')) {
      debtOpt = 'over_100m';
    } else {
      const num = parseInt(story.originalDebt.replace(/[^0-9]/g, ''));
      if (num < 1000) debtOpt = 'under_10m';
      else if (num <= 3000) debtOpt = '10m_30m';
      else if (num <= 5000) debtOpt = '30m_50m';
      else debtOpt = '50m_100m';
    }

    onSelectPlan({
      occupation: occOpt,
      debtAmount: debtOpt
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Header decoration */}
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            메인으로
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              인공지능 성공사례 스마트 대조
            </span>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase bg-amber-50 border border-amber-200/50 px-3.5 py-1.5 rounded-full inline-block">
              SUCCESS DEBT STORY MATCHING
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              나와 유사한 회생 해방사례 찾기
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              본인의 현재 직업 형태와 채무 범위 조건에 맞는 법원 판례 및 탕감 성공 데이터를 직접 탐색하고 매칭 받아보세요.
            </p>
          </div>

          {/* Filters section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            {/* Job Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">1단계: 본인의 현재 직업</label>
              <div className="grid grid-cols-2 gap-2">
                {jobs.map((job) => (
                  <button
                    key={job.value}
                    onClick={() => setSelectedJob(job.value)}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs tracking-tight transition-all cursor-pointer ${
                      selectedJob === job.value
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    {job.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Debt Filter */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">2단계: 부채 수준</label>
              <div className="grid grid-cols-2 gap-2">
                {debts.map((debt) => (
                  <button
                    key={debt.value}
                    onClick={() => setSelectedDebt(debt.value)}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs tracking-tight transition-all cursor-pointer ${
                      selectedDebt === debt.value
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    {debt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Story List Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>조건 충족 맞춤 성공 선례 ({filteredStories.length}건 검색됨)</span>
            </h3>

            <AnimatePresence mode="wait">
              {filteredStories.length > 0 ? (
                <div className="space-y-4">
                  {filteredStories.map((story) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-3xs hover:border-amber-300 hover:shadow-sm transition-all duration-200 space-y-4"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black mr-2">
                            {story.category}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-base inline-block">
                            {story.title}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">{story.age} • {story.job}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold block leading-relaxed">기존 총 부채</span>
                          <span className="text-xs sm:text-sm font-black text-slate-700">{story.originalDebt}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold block leading-relaxed">조정 후 변제총액</span>
                          <span className="text-xs sm:text-sm font-black text-violet-700">{story.reducedDebt}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                          <span className="text-[9px] text-emerald-600 font-extrabold block leading-relaxed">실제 탕감 비율</span>
                          <span className="text-xs sm:text-sm font-black text-emerald-700">{story.reductionRate}% 탕감 면책</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          "{story.description}"
                        </p>
                        
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>법무사 여환동 보정 성공 선례</span>
                          </div>
                          
                          <button
                            onClick={() => handleApplyMatch(story)}
                            className="px-4 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 group"
                          >
                            <span>나도 이 한도로 플랜 진단하기</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-500 font-medium text-xs space-y-1"
                >
                  <p>선택하신 조건의 성공 사례가 아직 시뮬레이터에 등록되어 있지 않습니다.</p>
                  <p>필터를 완화하여 법인/일반 탕감 면책 성공 데이터들을 확인해 보세요.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Consultation Call Panel */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-extrabold text-sm sm:text-base flex items-center justify-center md:justify-start gap-1">
                <Award className="w-4 h-4 text-amber-400" />
                나의 맞춤 사례 1:1 디렉팅 서비스
              </h4>
              <p className="text-[11px] text-slate-300 font-medium">
                회생법원 경향 정보와 최신 면책 실무 기준에 입각한 100% 무상 전화를 안내 드립니다.
              </p>
            </div>
            
            <a
              href="tel:010-5410-5679"
              className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md shadow-amber-900/30 transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              010-5410-5679 전화 진단
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
