import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Scale } from 'lucide-react';

interface HeaderProps {
  onNavClick: (section: string) => void;
  onStartSurvey: () => void;
}

export default function Header({ onNavClick, onStartSurvey }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'brand', label: '법무사 소개' },
    { id: 'stories', label: '당신의 이야기' },
    { id: 'our-spirit', label: '우리의 이야기' },
    { id: 'faq', label: '자주 묻는 질문' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Brand area */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-emerald-100">
              <Scale className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-violet-700 bg-clip-text text-transparent">
                법무사 여환동
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors duration-200 cursor-pointer py-2"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Button Area */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>법무사 여환동</span>
            </div>
            <button
              onClick={onStartSurvey}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-200 hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              1분 자격진단 시작
            </button>
          </div>

          {/* Mobile hamburger icon */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onStartSurvey}
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              자가진단
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-50 bg-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavClick(item.id);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-100 pt-4 mt-2">
              <button
                onClick={() => {
                  onStartSurvey();
                  setIsOpen(false);
                }}
                className="w-full py-3.5 text-center bg-gradient-to-r from-emerald-600 to-violet-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-100 tracking-wide cursor-pointer flex justify-center items-center gap-2"
              >
                <Scale className="w-5 h-5 text-white" />
                신청자격 무료 알아보기 (약 1분)
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-400 font-medium">
              ※ 법무사 여환동 직접 검토 및 철저한 개인정보 보호 보장
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
