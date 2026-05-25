import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SurveyResponses } from '../types';
import { SUCCESS_STORIES } from '../data';
import { Scale, HeartHandshake, PhoneCall, CheckCircle, ArrowRight, ShieldCheck, Award, MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';

interface ResultDashboardProps {
  responses: SurveyResponses;
  onRestart: () => void;
}

export default function ResultDashboard({ responses, onRestart }: ResultDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stepMsg, setStepMsg] = useState('가입 심사 데이터 확인 중...');

  useEffect(() => {
    // Elegant Multi-stage analytic loaders
    const msgs = [
      '가입 심사 데이터 확인 중...',
      '보건복지부 고시 부양가족 생계비 매칭 중...',
      '관할 회생법원 금지명령 심판 데이터 대조 중...',
      '개인회생 최대 탕감 한도 가용 시뮬레이션 중...',
      '법무사 여환동 자격 진단 보고서 작성 완료!'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < msgs.length - 1) {
        current += 1;
        setStepMsg(msgs[current]);
      } else {
        setLoading(false);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Compute calculated estimations based on response parameters
  const getEstimationDetails = () => {
    let mockTotalDebt = 48000000;
    let originalDebtStr = '4,800만 원';
    
    switch (responses.debtAmount) {
      case 'under_10m':
        mockTotalDebt = 8500000;
        originalDebtStr = '850만 원';
        break;
      case '10m_30m':
        mockTotalDebt = 22000000;
        originalDebtStr = '2,200만 원';
        break;
      case '30m_50m':
        mockTotalDebt = 44000000;
        originalDebtStr = '4,400만 원';
        break;
      case '50m_100m':
        mockTotalDebt = 78000000;
        originalDebtStr = '7,800만 원';
        break;
      case 'over_100m':
        mockTotalDebt = 145000000;
        originalDebtStr = '1억 4,500만 원';
        break;
    }

    // Determine basic reduction rate starting point
    let reductionRate = 75; // Average baseline

    // Occupation adjustments
    if (responses.occupation === 'regular_employee') {
      reductionRate += 5; // Premium steady jobs are easy
    } else if (responses.occupation === 'no_income') {
      reductionRate -= 15; // Low/no income might require specialized adjustment
    }

    // Asset checks
    let warningMsg = '';
    let eligibilityGrade = '우수 (A등급)';
    let progressColor = 'bg-emerald-500';
    let textColor = 'text-emerald-700';
    let ringColor = 'ring-emerald-100';

    if (responses.hasMoreDebtThanAssets === 'no') {
      reductionRate = 0; // Asset greater than debt is legally blocked
      warningMsg = '※ 주의: 보유 자산 가치 총합이 채무액보다 큰 경우, 개인회생 자격이 제한되거나 청산가치 보장 원칙에 따라 매월 상환액이 조정되어 탕감폭이 없거나 기각될 위험이 높습니다. 다만 재산 산정에서 무이자 담보 채무 및 임차보증금 면제 한도가 적용되므로 전문 변호인과 특별 감액 보정을 상담하시는 것이 안전합니다.';
      eligibilityGrade = '기각 우려 (상담 필히 요망)';
      progressColor = 'bg-amber-500';
      textColor = 'text-amber-700';
      ringColor = 'ring-amber-100';
    } else if (responses.hasMoreDebtThanAssets === 'similar') {
      reductionRate -= 10;
      warningMsg = '※ 안내: 재산과 빚이 비슷한 수준이면, 청산가치 평가 보정 내용에 따라 탕감율이 낮아질 수 있습니다. 재산 보정을 최소화하는 법리 전개로 탕감율을 끌어올려야 합니다.';
      eligibilityGrade = '검토 가능 (B등급)';
      progressColor = 'bg-blue-500';
      textColor = 'text-blue-700';
      ringColor = 'ring-blue-100';
    } else {
      // Best case
      if (mockTotalDebt >= 50000000) {
        eligibilityGrade = '최우수 (S등급)';
        progressColor = 'bg-indigo-600';
        textColor = 'text-indigo-700';
        ringColor = 'ring-indigo-100';
        reductionRate += 5;
      }
    }

    // Debt range hard block check
    if (responses.debtAmount === 'under_10m') {
      reductionRate = 0;
      warningMsg = '※ 주의: 총 채무금액이 1,000만 원 미만인 경우, 전형적인 개인회생 자격 미달에 속해 비용 대비 실익이 낮을 수 있습니다. 신용회복위원회의 프리워크아웃이나 개인워크아웃 절차가 보다 효율적일 수 있으니, 무리한 진행 전 자매 프로그램 연동 무상 컨설팅을 꼭 점검받으십시오.';
      eligibilityGrade = '보류 (진단 경고)';
      progressColor = 'bg-rose-500';
      textColor = 'text-rose-700';
      ringColor = 'ring-rose-100';
    }

    // Enforce bound limit
    reductionRate = Math.max(10, Math.min(90, reductionRate));

    const mockReducedDebt = Math.round(mockTotalDebt * (1 - reductionRate / 100));
    const mockMonthlyPayment = Math.round(mockReducedDebt / 36);

    const formatWon = (num: number) => {
      if (num >= 100000000) {
        const eok = Math.floor(num / 100000000);
        const man = Math.round((num % 100000000) / 10000);
        return `${eok}억 ${man > 0 ? man + '만' : ''} 원`;
      }
      return `${Math.round(num / 10000).toLocaleString()}만 원`;
    };

    return {
      originalDebtStr,
      mockTotalDebt,
      reductionRate,
      mockReducedDebt,
      reducedDebtStr: formatWon(mockReducedDebt),
      savingsDebtStr: formatWon(mockTotalDebt - mockReducedDebt),
      monthlyPaymentStr: formatWon(mockMonthlyPayment),
      warningMsg,
      eligibilityGrade,
      progressColor,
      textColor,
      ringColor
    };
  };

  const est = getEstimationDetails();

  // Pick suitable story
  const getMatchedStory = () => {
    if (responses.difficulties.includes('investment_losses') || responses.occupation === 'freelancer_parttime') {
      return SUCCESS_STORIES[0]; // Crypto / Freelancer
    }
    if (responses.occupation === 'business_owner') {
      return SUCCESS_STORIES[2]; // Business fail
    }
    return SUCCESS_STORIES[1]; // Employee household debt
  };

  const matchedStory = getMatchedStory();

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 animate-pulse" />
          
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-600 border-r-violet-600 animate-spin" />
              <Scale className="absolute inset-0 m-auto w-7 h-7 text-emerald-600 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800">법무사 여환동 자가 시뮬레이션 작동 중</h3>
              <p className="text-sm font-semibold text-slate-500 h-6">
                {stepMsg}
              </p>
            </div>

            <div className="w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 animate-pulse" style={{ width: '100%' }} />
            </div>

            <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>개인정보 256bit 대칭형 SSL 암호화 적용</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6">
      
      {/* Celebration Header Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-black">
              <Award className="w-3.5 h-3.5" />
              <span>진단 분석 통과</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {responses.name} 님의 자격요건 검토서
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-bold">
              현재 상황에 최적화된 회생 요율 시뮬레이션을 완료했습니다.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-300 font-bold block leading-3">자가 승인 등급</span>
              <span className="text-base font-black text-white">{est.eligibilityGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Simulation Visualization Block */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-8">
        
        {/* SVG reduction Visualization Row */}
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            최대 탕감율 및 채무 변화량 예측
          </h3>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Circular Gauge with SVG */}
            <div className="col-span-1 md:col-span-4 flex flex-col items-center justify-center text-center">
              <div className="relative w-36 h-36">
                {/* SVG circular progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-slate-200"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-emerald-500 transition-all duration-1000 ease-out"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - est.reductionRate / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                {/* Text centered inside circular progress */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-800">{est.reductionRate}%</span>
                  <span className="text-[10px] font-black text-slate-400 tracking-wide uppercase">예상 탕감율</span>
                </div>
              </div>
            </div>

            {/* Direct comparative indicators */}
            <div className="col-span-1 md:col-span-8 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>총 기존 채무 원금</span>
                  <span className="font-semibold text-slate-700">{est.originalDebtStr}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Reduced Debt Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-emerald-600">
                  <span>개인회생 완료 후 변제해야 하는 채무액</span>
                  {est.reductionRate > 0 ? (
                    <span className="font-extrabold text-emerald-700">약 {est.reducedDebtStr} (이자 100% 전액 탕감)</span>
                  ) : (
                    <span className="font-extrabold text-amber-700">심층 정밀 법률 재산 조율 필요</span>
                  )}
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    style={{ width: `${Math.max(10, 100 - est.reductionRate)}%` }}
                  />
                </div>
              </div>

              {/* Bullet savings block */}
              {est.reductionRate > 0 && (
                <div className="p-3.5 bg-emerald-100/40 rounded-xl border border-emerald-500/10 flex items-center justify-between text-xs">
                  <span className="font-black text-emerald-800">합법적으로 탕감받는 부채액:</span>
                  <span className="font-black text-emerald-600">총 약 {est.savingsDebtStr} 소멸 기각 구조</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlighted Monthly Plan Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-100 bg-linear-to-b from-white to-slate-50/50 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">36개월 월 예상 변제금</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {est.reductionRate > 0 ? `월 약 ${est.monthlyPaymentStr}` : '진단 보정 필요'}
            </p>
            <p className="text-[11px] text-slate-400 font-semibold">
              ※ 법률 제휴를 통한 부양가족 생계비 공제(본인 포함 최소 125만원 보장) 후 가용 범위
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-violet-100 bg-violet-50/40 space-y-2">
            <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wide">법무사 여환동의 직접 안심 보호 프로토콜</span>
            <ul className="text-xs text-violet-950 font-bold space-y-1">
              <li className="flex items-center gap-1.5">• 3일 내 채무추심 원천차단 금지명령신청</li>
              <li className="flex items-center gap-1.5">• 주식/코인 거주지역 맞춤 보전 준칙 적용</li>
              <li className="flex items-center gap-1.5">• 일체 자택/회사 우편 보장 안심 송달</li>
            </ul>
          </div>
        </div>

        {/* Warn msg block */}
        {est.warningMsg && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 flex gap-3 text-xs text-amber-800 font-semibold leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>{est.warningMsg}</div>
          </div>
        )}
      </div>

      {/* Matched Real Success Story Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            의뢰인과 유사한 실제 법원 면책 선례
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-slate-200">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[10px] font-extrabold mr-2">
                {matchedStory.category}
              </span>
              <h4 className="font-black text-slate-800 text-base inline-block mt-1 sm:mt-0">
                {matchedStory.title}
              </h4>
            </div>
            <span className="text-xs text-slate-500 font-bold">{matchedStory.age} | {matchedStory.job}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block">기존 총 부채</span>
              <span className="text-sm font-black text-slate-700">{matchedStory.originalDebt}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100/50">
              <span className="text-[10px] text-slate-400 font-bold block shrink-0">조정 후 부채</span>
              <span className="text-sm font-black text-violet-700">{matchedStory.reducedDebt}</span>
            </div>
            <div className="col-span-2 md:col-span-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-emerald-600 font-extrabold block">실제 탕감율</span>
              <span className="text-sm font-black text-emerald-700">{matchedStory.reductionRate}% 할인 면책</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed pt-2">
            "{matchedStory.description}"
          </p>
        </div>
      </div>

      {/* Recommended Live Compliment Call card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-black leading-snug">
            정밀 분석 및 법원 신청 패키지 무상 예약
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 font-bold">
            안내 결과를 바탕으로 1:1 전담 전문 법률 대리인이 정식 유선 진단을 바로 지원해 드립니다.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a
            href="tel:010-5410-5679"
            className="flex-1 sm:flex-initial px-5 py-3.5 bg-white text-slate-900 font-black text-sm rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600 animate-bounce" />
            010-5410-5679 연결
          </a>
          <button
            onClick={onRestart}
            className="px-5 py-3.5 bg-transparent border border-white/40 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            다시 진단하기
          </button>
        </div>
      </div>

    </div>
  );
}
