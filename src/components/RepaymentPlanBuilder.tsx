import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronLeft, Calendar, ArrowRight, ShieldCheck, PhoneCall, Wallet, Calculator, Info } from 'lucide-react';

import { SurveyResponses } from '../types';

interface RepaymentPlanBuilderProps {
  onBack?: () => void;
  onSubmitPlan: (answers: SurveyResponses) => void;
}

export default function RepaymentPlanBuilder({ onBack, onSubmitPlan }: RepaymentPlanBuilderProps) {
  // Simulator input parameters state
  const [totalDebt, setTotalDebt] = useState<number>(45000000); // in Won
  const [monthlyIncome, setMonthlyIncome] = useState<number>(2500000); // in Won
  const [dependents, setDependents] = useState<number>(1); // Dependents count
  const [netAsset, setNetAsset] = useState<number>(10000000); // 보유 순자산 (청산가치)
  
  // Safe contact form state
  const [uName, setUName] = useState('');
  const [uPhone, setUPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // 2026 Statutory minimum living cost index guideline (60% of median income)
  const getMinLivingCost = (count: number) => {
    switch (count) {
      case 1: return 1538543;
      case 2: return 2519575;
      case 3: return 3215422;
      case 4: return 3896843;
      case 5: return 4534031;
      case 6: return 5133571;
      case 7: return 5709090;
      default: return 5709090 + (count - 7) * 575519;
    }
  };

  const livingCost = getMinLivingCost(dependents);

  // --- 개인회생 실무 법리 계산법 고도화 (청산가치 보장 및 최소 가용소득) ---
  // 1) 순수 잉여소득 (조정 전 가용소득)
  const surplusIncome = monthlyIncome - livingCost;

  // 2) 청산가치(순자산) 보장을 위한 최소 월 변제기준선 (총 변제액은 재산가치보다 많아야 함)
  const monthlyRequiredByAsset = Math.ceil(netAsset / 36);

  // 3) 개인회생 최소 보증 월 변제 기본금액 (현실상 0원/극소액 변제를 막는 하한)
  const absoluteMinRepayment = 150000;

  // 4) 최종 월 예상 변제금의 산정 (부양 보정이 가해진 결과물)
  // 가용소득이 0원 이하인 경우, 생계비를 보정 차출(삭감 축소)하여 법상 15만원 혹은 (재산/36) 중 큰 금액으로 납입하게 설계됩니다.
  const availableRepayment = Math.max(
    surplusIncome,
    monthlyRequiredByAsset,
    absoluteMinRepayment
  );

  // 변제금이 소득 자체를 넘어서는 경우 감지 (회생 미성립 예방)
  const isIncomeTooLow = availableRepayment >= monthlyIncome;

  // 최종 예상 36개월 총 변제량
  const totalRepaymentRaw = availableRepayment * 36;
  const totalRepayment = Math.min(totalDebt, totalRepaymentRaw);
  const estimatedPaymentMonthly = Math.round(totalRepayment / 36);

  // 감면 탕감 수치
  const totalSavings = Math.max(0, totalDebt - totalRepayment);
  const reductionPercent = totalDebt > 0 ? Math.round((totalSavings / totalDebt) * 100) : 0;

  // 소득이 생계비에 못 미치는 '생계비 조정 대상' 가구 검출
  const isLivingCostAdjusted = monthlyIncome <= livingCost;

  const formatManWon = (won: number) => {
    return `${Math.round(won / 10000).toLocaleString()}만원`;
  };

  const phonePattern = /^(010|011|016|017|018|019)[- ]?\d{3,4}[- ]?\d{4}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!uName || uName.trim().length === 0) {
      setFormError('성함을 입력해 주세요.');
      return;
    }
    if (!uPhone || !phonePattern.test(uPhone.replace(/[^0-9]/g, ''))) {
      setFormError('올바른 한국 핸드폰 번호(예: 010-1234-5678)를 입력해 주세요.');
      return;
    }
    if (!agreeTerms) {
      setFormError('개인정보 수집 및 자격 진단 상담 활용 요건에 동의해 주세요.');
      return;
    }

    setSubmitting(true);

    // Map the sliders state into a SurveyResponse profile to trigger completion with high accuracy
    let debtOpt = '30m_50m';
    if (totalDebt < 10000000) debtOpt = 'under_10m';
    else if (totalDebt <= 30000000) debtOpt = '10m_30m';
    else if (totalDebt <= 50000000) debtOpt = '30m_50m';
    else if (totalDebt <= 100000000) debtOpt = '50m_100m';
    else debtOpt = 'over_100m';

    setTimeout(() => {
      onSubmitPlan({
        name: uName,
        phone: uPhone,
        occupation: 'regular_employee',
        debtAmount: debtOpt,
        hasMoreDebtThanAssets: 'yes',
        region: 'seoul_metropolitan',
        difficulties: ['high_interest'],
        ageGroup: '30대'
      });
      setSubmitting(false);
    }, 600);
  };

  // Fast Auto-formatter for cellphones
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    if (raw.length <= 3) return setUPhone(raw);
    if (raw.length <= 7) return setUPhone(`${raw.slice(0, 3)}-${raw.slice(3)}`);
    return setUPhone(`${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Header bar */}
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-center text-white">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              메인으로
            </button>
          ) : (
            <div className="text-xs font-bold text-sky-400">
              법무사 여환동 자격진단
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calculator className="w-4.5 h-4.5 text-sky-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1:1 초정밀 부채상환 시뮬레이터
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Intro text */}
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-sky-600 font-extrabold text-xs tracking-wider uppercase bg-sky-50 border border-sky-200/50 px-3.5 py-1.5 rounded-full inline-block">
              1:1 PORTFOLIO PLAN DESIGN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              맞춤형 월 변제 상환 계획기
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              본인의 월 소득과 법정 최저생계비를 대조하여 매달 갚아 나갈 월 변제금과 최종 면책받는 탕감율을 즉시 산출해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            
            {/* Left Column: Sliders Controllers */}
            <div className="col-span-1 md:col-span-7 space-y-6">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Wallet className="w-4 h-4 text-sky-500" />
                <span>시뮬레이션 조절기</span>
              </h3>

              {/* Slider 1: Total Debt */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">총 기존 채무액</span>
                  <span className="text-sm font-black text-slate-900">{formatManWon(totalDebt)}</span>
                </div>
                <input
                  type="range"
                  min={10000000}
                  max={200000000}
                  step={5000000}
                  value={totalDebt}
                  onChange={(e) => {
                    const newDebt = Number(e.target.value);
                    setTotalDebt(newDebt);
                    if (netAsset > newDebt - 5000000) {
                      setNetAsset(Math.max(0, newDebt - 5000000));
                    }
                  }}
                  className="w-full accent-sky-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>1,000만원</span>
                  <span>1억원</span>
                  <span>2억원</span>
                </div>
              </div>

              {/* Slider 1-2: Net Asset (Liquidation value) */}
              <div className="space-y-2 p-3 bg-gradient-to-r from-indigo-50/40 to-sky-50/40 rounded-xl border border-indigo-100/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-700">보유 총 순자산 가치 (청산가치)</span>
                    <span className="text-[10px] text-indigo-500 font-semibold bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-sm">법리 수합</span>
                  </div>
                  <span className="text-sm font-black text-indigo-700">{formatManWon(netAsset)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.max(10000000, totalDebt - 5000000)}
                  step={1000000}
                  value={netAsset}
                  onChange={(e) => setNetAsset(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold items-center">
                  <span>0원 (재산 무관)</span>
                  <span className="text-indigo-600 font-black text-[9px]">※ 청산가치 보장 원칙 준수</span>
                  <span>자격 한계선 ({formatManWon(Math.max(10000000, totalDebt - 5000000))})</span>
                </div>
              </div>

              {/* Slider 2: Monthly Income */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">나의 본인 월 평균 소득</span>
                  <span className="text-sm font-black text-slate-900">{formatManWon(monthlyIncome)}</span>
                </div>
                <input
                  type="range"
                  min={1200000}
                  max={6000000}
                  step={100000} // 10만원단위
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-sky-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>120만원</span>
                  <span>350만원</span>
                  <span>600만원</span>
                </div>
              </div>

              {/* Selector 3: Dependents count */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-slate-700">부양가족 수 (본인 포함)</span>
                  <span className="text-xs text-sky-600 font-extrabold">2026 법정 기본생계 보호 반영</span>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 animate-fade-in">
                  {[1, 2, 3, 4, 5, 6, 7].map((count) => (
                    <button
                      key={count}
                      onClick={() => setDependents(count)}
                      className={`py-2 px-1 rounded-lg border text-center font-bold text-[11px] tracking-tight transition-all cursor-pointer ${
                        dependents === count
                          ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold'
                      }`}
                    >
                      {count}인
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-150 flex items-start gap-2 text-xs text-slate-500 font-medium font-sans">
                  <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 animate-fade-in">
                    <span className="font-extrabold text-slate-700">2026 보건복지부 법정 생계비: {livingCost.toLocaleString()}원 (약 {formatManWon(livingCost)})</span>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      월 소득에서 본인 및 부양가족의 2026 법정 기본생계비 전액을 1순위로 공제 보장받은 후, 남은 소득(월 가용소득)으로만 변제금을 납부하게 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visualizer Output & Submit Form */}
            <div className="col-span-1 md:col-span-5 space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-5 shadow-lg border border-slate-850">
                <span className="text-[10px] font-black tracking-widest uppercase text-sky-400 block border-b border-white/10 pb-2">
                  실시간 월 변제 계획
                </span>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-350 font-bold block">36개월 납입 월 변제금</span>
                    <p className="text-2xl sm:text-3xl font-black text-sky-300 leading-tight">
                      월 {estimatedPaymentMonthly.toLocaleString()}원
                    </p>
                    <span className="text-[10px] text-sky-200/80 font-bold block mt-0.5 animate-fade-in">
                      (실제 상환액: 약 {formatManWon(estimatedPaymentMonthly)})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-400 block">3년 총 상환원금</span>
                      <span className="text-xs font-black text-slate-200">{formatManWon(totalRepayment)}</span>
                    </div>
                    <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[9px] text-emerald-400 block">원금 예상 탕감액</span>
                      <span className="text-xs font-black text-emerald-300">{formatManWon(totalSavings)}</span>
                    </div>
                  </div>
                </div>

                {isIncomeTooLow ? (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/20 text-[10px] text-rose-300 font-bold leading-normal space-y-1">
                    <p className="font-extrabold text-rose-200">⚠️ 변제 불능 경고</p>
                    <p className="text-slate-300">
                      월 최소 필수 변제금({formatManWon(estimatedPaymentMonthly)})이 본인 소득({formatManWon(monthlyIncome)})을 넘거나 같아 회생 기각 위험이 매우 높습니다. 추가 소득원 신고 보정이나, 가용 재산의 세부 청산 가치 감축 보정안이 결합되어야 합니다.
                    </p>
                  </div>
                ) : isLivingCostAdjusted ? (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/20 text-[10px] text-amber-300 font-bold leading-normal space-y-1 animate-fade-in">
                    <p className="font-extrabold text-amber-200">※ 사안 특별 보정 설계안 적용</p>
                    <p className="text-slate-300/90 leading-relaxed font-sans">
                      월 소득이 100% 보장 법정 최저생계비 이하지만, 법원 실무 준정상 변제금 0원 책정은 불가능합니다. 이에 최저생계비를 정해진 비율만큼 하향 보정(생계 축소 보증)하고 청산가치 한계를 극복하기 위해 매월 최소 15만원(또는 재산 비분할 보증금액)에 맞춰 부양가족을 조율한 우회 상환 플랜을 탑재했습니다.
                    </p>
                  </div>
                ) : reductionPercent > 0 ? (
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex flex-col gap-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs text-slate-300 font-bold">합법 원금 감면 비율:</span>
                      <span className="text-sm font-black text-emerald-400">{reductionPercent}% 삭감 승인</span>
                    </div>
                    {estimatedPaymentMonthly * 36 >= netAsset && surplusIncome < monthlyRequiredByAsset && (
                      <p className="text-[9px] text-indigo-300 leading-normal font-semibold border-t border-white/5 pt-1 mt-1">
                        💡 청산가치 보장의 장벽 적용: 자산({formatManWon(netAsset)})을 보장하기 위해 월 법정 기준 변제금이 상향 차출 조율되었습니다.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/20 text-[11px] text-amber-300 font-bold leading-normal">
                    ※ 소득과 부양가족 감안 시 가용 소득이 부족하여, 특별 감액 보정으로 회생 자격 기준선 성사 여부를 검증해야 합니다.
                  </div>
                )}
              </div>

              {/* Action Form inside right-rail column */}
              <form onSubmit={handleSubmit} className="p-4.5 rounded-2xl border border-slate-200 bg-white space-y-3">
                <span className="text-xs font-black text-slate-800 block">이 플랜으로 정밀 보고서 예약하기</span>
                
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="성함 입력"
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl font-bold text-xs focus:outline-hidden focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="tel"
                    required
                    placeholder="결과 통보 휴대폰 번호 (010-0000-0000)"
                    value={uPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 focus:bg-white"
                  />
                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-1.5 pt-1">
                  <input
                    type="checkbox"
                    id="plan-term"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-sky-600 cursor-pointer"
                  />
                  <label htmlFor="plan-term" className="text-[10px] font-bold text-slate-400 cursor-pointer select-none">
                    개인정보 수집 및 자격 진단용 활용 동의 (필수, 철저 보안)
                  </label>
                </div>

                {formError && (
                  <p className="text-[10px] font-bold text-rose-500 bg-rose-50 p-1.5 text-center rounded-lg">
                    ⚠️ {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-100 hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-200" />
                  <span>{submitting ? '플랜 정보 송신 중...' : '맞춤 상환 플랜 잠금 예약'}</span>
                </button>
              </form>

            </div>

          </div>

          {/* Direct call center support */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold">도움말이 필요하신가요?</span>
            <a href="tel:010-5410-5679" className="text-sky-600 font-black flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              010-5410-5679 유선 통화
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
