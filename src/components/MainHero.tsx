import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, TrendingDown, ClipboardCheck, Users, HelpCircle } from 'lucide-react';

interface MainHeroProps {
  onStartSurvey: (initialMode?: string) => void;
}

export default function MainHero({ onStartSurvey }: MainHeroProps) {
  // Config for the 3 interactive entry cards
  const entranceCards = [
    {
      title: '내 예상 채무 탕감액 조회',
      subtitle: '탕감 한도 & 예상 잔여금 계산',
      icon: <TrendingDown className="w-8 h-8 text-emerald-600" />,
      color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-300',
      actionKey: 'debt'
    },
    {
      title: '개인회생 신청 자격 확인',
      subtitle: '소득 및 재산 자격 심사',
      icon: <ClipboardCheck className="w-8 h-8 text-violet-600" />,
      color: 'from-violet-500/10 to-indigo-500/10 hover:border-violet-300',
      actionKey: 'qualification'
    },
    {
      title: '나와 비슷한 성공사례 매칭',
      subtitle: '실제 해방인의 면책사례 비교',
      icon: <Users className="w-8 h-8 text-amber-600" />,
      color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-300',
      actionKey: 'case'
    }
  ];

  const worrychips = [
    '최근 대출이 많아요',
    '독촉 스트레스가 심해요',
    '투자 및 코인 채무',
    '가족 몰래 은밀하게 진행'
  ];

  return (
    <section className="relative overflow-hidden bg-radial from-slate-50 to-slate-100/50 py-12 md:py-20 lg:py-24 border-b border-slate-100">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3.5xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-400/10 blur-3.5xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200 text-xs font-bold text-emerald-800 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
          <span>채무 탕감 보장제 자가 진단</span>
        </motion.div>

        {/* Master Titles */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="text-emerald-600 font-extrabold text-base md:text-lg tracking-wider uppercase">
            개인회생, 나도 가능할까?
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            신청자격 알아보기
          </h1>
        </motion.div>

        {/* Introduction Cards */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium leading-relaxed"
        >
          복잡한 절차 없이 1분만 시간내어 진단해 보세요.
        </motion.p>

        {/* Quick Highlight Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-emerald-600 mb-1">소득 기준 최소화</span>
            <p className="text-sm font-extrabold text-slate-800 leading-snug">
              어떤 직종이든<br />소득이 있다면 가능!
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-violet-600 mb-1">최소 채무 허들</span>
            <p className="text-sm font-extrabold text-slate-800 leading-snug">
              총 빚 합산금액이<br />천만 원 이상이면 가능!
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-amber-600 mb-1">재산 한계 범위</span>
            <p className="text-sm font-extrabold text-slate-800 leading-snug">
              소유 재산 가격보다<br />채무가 더 많다면 가능!
            </p>
          </div>
        </motion.div>

        {/* Worry chips area */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {worrychips.map((chip, index) => (
            <span
              key={index}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200/55 border border-slate-300/30 text-xs font-bold text-slate-600 shadow-3xs"
            >
              #{chip}
            </span>
          ))}
        </div>

        {/* Action Title Block */}
        <div className="mt-16 sm:mt-20 border-t border-slate-200/60 pt-12">
          <span className="text-xs font-extrabold text-violet-600 tracking-wider uppercase block mb-1">
            진단 질문지 무료 배포
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            나는 얼마나 탕감 받을까?
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-500 font-semibold max-w-lg mx-auto">
            개인회생이 가능한지, 6개월 뒤 나의 채무량 변화와 맞춤 변제 상환 보고서를 발송해 드립니다.
          </p>
        </div>

        {/* Entrance Interactive Selection Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {entranceCards.map((card, idx) => (
            <motion.div
              hover={{ scale: 1.02 }}
              key={idx}
              onClick={() => onStartSurvey(card.actionKey)}
              className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} border border-slate-200/50 shadow-xs text-left cursor-pointer transition-all duration-200 flex items-start gap-4 hover:shadow-md relative group`}
            >
              <div className="p-3 bg-white rounded-xl shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                  {card.title}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs text-slate-500 font-semibold">{card.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subtle timer warning */}
        <p className="mt-6 text-xs text-slate-400 font-medium tracking-wide">
          ⏱️ 약 1분 소요, 총 5개 간편 문항으로 정밀 설계
        </p>
      </div>
    </section>
  );
}
