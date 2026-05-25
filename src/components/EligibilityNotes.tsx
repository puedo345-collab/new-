import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FAQ_ITEMS } from '../data';
import { Scale, CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronUp, Lock, Target, HelpCircle, Landmark } from 'lucide-react';

export default function EligibilityNotes() {
  const [activeChip, setActiveChip] = useState<number | null>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const chipContent = [
    {
      title: '최근 대출이 많아요',
      tag: '최근 신규 대출 및 고금리 다중채무',
      desc: '신규 채무 비중이 크더라도(예: 1년 이내 50% 이상) 이자를 수속 상환하고 있었다면 진행이 충분히 가능합니다. 고 이자 채무를 온전히 법적 조정하여 원금 감축과 납입이자 전액 탕감을 동시에 보장해 드립니다.',
      points: ['고이율 대부업 채무도 원금 탕감 가능', '돌려막기를 통한 채무 고착 상태 중단', '법원 특별 보정을 통해 최근 대출 소명']
    },
    {
      title: '독촉 스트레스가 심해요',
      tag: '전화 독촉, 자택 방문, 급여 가압류 중단',
      desc: '법원에 개인회생 절차 개시 신청서를 접수할 때 \'금지명령\'과 \'중지명령\'을 즉각 병합 신청합니다. 법원 결정서가 채권사(은행, 카드사 등)에 도달하면 모든 전화, 문자 추심 및 재산 압류가 법적으로 전면 봉쇄됩니다.',
      points: ['접수 후 영업일 기준 3~5일 내 독촉 전면 금지', '이미 개시된 유선/자택 방문 추심 효력 소멸', '급여 및 통장 압류 진행 건 즉시 집행 해제 신청']
    },
    {
      title: '투자 채무가 있어요',
      tag: '주식, 가상화폐(코인), 선물옵션, 사설도박',
      desc: '서울회생법원을 비롯한 각급 회생법원의 실무 준칙 개정으로, 투자 실패로 인한 손실액을 채무자의 청산가치(보유재산)에 산입하지 않는 판결 선례가 이어지고 있습니다. 이로 인해 과거 대비 현격히 많은 탕감 수혜를 누리실 수 있습니다.',
      points: ['코인/주식 투자가 원인이라도 도덕성 결함 기각 불가', '투자로 소진된 법원 청산가치 합산율 면제 보정', '도박 채무 역시 법원 안심 요율 적용 대상에 부합']
    },
    {
      title: '가족 몰래 진행하고 싶어요',
      tag: '1:1 비밀 수임 보장 및 전담 대리 송달',
      desc: '법원에서 송달하는 일체의 진행사항 고지서, 회생서류 및 우편물은 의뢰인 본가의 주소지가 아닌, 법무사 여환동 사무소의 주소지로 100% 안전하게 대리 송달됩니다. 이에 따라 개인적인 상황이 외부에 노출되는 불상사를 완벽히 사전에 차단합니다.',
      points: ['모든 부채 확인 수집 절차 비대면 대리 처리', '직장 통지나 회사 내규 불이익 원천 방지', '배우자 및 가족 몰래 정기 우편 가리개 주소지 적용']
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Eligibility Header Area */}
        <div className="text-center space-y-3">
          <span className="text-emerald-600 font-extrabold text-xs tracking-widest uppercase block">
            회생 가이드
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            개인회생 신청 자격 안내
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            4대 보험 등록 우무, 계약직, 아르바이트 관계없이 기본 3가지 요건만 부합하면 법적 면책을 개시할 수 있습니다.
          </p>
        </div>

        {/* 3 Core Eligibility Rule cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              01
            </div>
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-800 text-base">직업 무관 및 소득 여부</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                4대 보험 미가입 대표자, 프리랜서, 신용회복 지원 중인 청년도 반복적 소득이 최저생계비 이상 있다면 신청 가능합니다.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between space-y-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-black text-lg">
              02
            </div>
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-800 text-base">총 채무액 규모 (1,000만원 이상)</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                무담보 채무(신용 대출, 카드 연체) 10억 이하, 담보 채무(아파트 담보 대출) 15억 이하로 1천만 원 이상이면 진행 실익이 아주 높습니다.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg">
              03
            </div>
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-800 text-base">보유 재산보다 채무 초과</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                채무자가 지닌 주택 보증금, 자동차 시세 등 보유 중인 순자산 감정액 총합이 총 빚의 가치보다 적을 경우에 대상이 됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Accordions for Key Concerns Chips */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              핵심 상황별 집중 클리닉 케어
            </span>
          </div>

          {/* Tab buttons / Chips selector */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {chipContent.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChip(idx)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                  activeChip === idx
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Expandable Chip Details Panel */}
          {activeChip !== null && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-50/50 border border-slate-200/50 max-w-2xl mx-auto space-y-4"
            >
              <div>
                <span className="text-[10px] text-violet-600 font-extrabold tracking-wide uppercase">
                  {chipContent[activeChip].tag}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-0.5">
                  {chipContent[activeChip].title} 걱정, 법무사의 해답은?
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                {chipContent[activeChip].desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {chipContent[activeChip].points.map((pt, pidx) => (
                  <div key={pidx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-3xs flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] text-slate-700 font-extrabold tracking-tight">{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Accordion FAQ Area ("세상의 이야기") */}
        <div id="faq" className="space-y-4 pt-12 border-t border-slate-100">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">자주 묻는 질문</h3>
            <p className="text-xs text-slate-500 font-bold">법무사 여환동 사무소에 의뢰하시는 많은 분들이 가장 먼저 확인하시는 핵심 질의응답입니다.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((faq) => {
              const isSelected = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isSelected ? null : faq.id)}
                    className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50 flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                      {faq.question}
                    </span>
                    {isSelected ? <ChevronUp className="w-4.5 h-4.5 text-slate-550 shrink-0" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-450 shrink-0" />}
                  </button>

                  {isSelected && (
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-100/50 bg-slate-50/30">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
