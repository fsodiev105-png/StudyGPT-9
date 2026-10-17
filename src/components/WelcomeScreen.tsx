import React from 'react';
import { StudyMode, SubjectId } from '../types';
import { Sparkles, Camera, FileText, CheckCircle2, Atom, Flame, Languages, BookOpen, Compass, Calculator } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectAction: (mode: StudyMode, subject: SubjectId, initialPrompt?: string) => void;
  onOpenCamera: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectAction,
  onOpenCamera,
}) => {
  const primaryCards = [
    {
      title: 'Сфотографировать задание',
      desc: 'Распознать формулы, чертежи и условие с камеры',
      icon: <Camera className="w-6 h-6 text-emerald-500" />,
      bg: 'hover:border-emerald-400/80 dark:hover:border-emerald-500/80',
      action: () => onOpenCamera(),
    },
    {
      title: 'Контрольная работа',
      desc: 'Разбор вариантов: короткие ответы + полные решения',
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      bg: 'hover:border-amber-400/80 dark:hover:border-amber-500/80',
      action: () => onSelectAction('exam', 'auto'),
    },
    {
      title: 'Домашняя работа',
      desc: 'Пошаговый разбор номеров из учебника',
      icon: <CheckCircle2 className="w-6 h-6 text-indigo-500" />,
      bg: 'hover:border-indigo-400/80 dark:hover:border-indigo-500/80',
      action: () => onSelectAction('homework', 'auto'),
    },
    {
      title: 'Объяснить тему',
      desc: 'Простое объяснение, правила, примеры и тест',
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      bg: 'hover:border-blue-400/80 dark:hover:border-blue-500/80',
      action: () => onSelectAction('explain_topic', 'auto'),
    },
  ];

  const subjectCards = [
    {
      title: 'Алгебра',
      sub: 'Квадратные уравнения, системы, прогрессии',
      icon: '📐',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-200/60 dark:border-blue-900/40',
      action: () => onSelectAction('homework', 'algebra', 'Помоги решить квадратное уравнение: 2x² - 5x + 2 = 0'),
    },
    {
      title: 'Физика',
      sub: 'Законы Ньютона, импульс, работа и энергия',
      icon: '⚡',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 dark:border-amber-900/40',
      action: () => onSelectAction('homework', 'physics', 'Тело массой 2 кг движется со скоростью 10 м/с. Найти импульс тела.'),
    },
    {
      title: 'Химия',
      sub: 'Реакции, коэффициенты, диссоциация',
      icon: '🧪',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/60 dark:border-emerald-900/40',
      action: () => onSelectAction('homework', 'chemistry', 'Расставь коэффициенты и укажи тип реакции: Al + O₂ → Al₂O₃'),
    },
    {
      title: 'Английский',
      sub: 'Present Perfect, Past Simple, Passive Voice',
      icon: '🇬🇧',
      color: 'from-rose-500/10 to-pink-500/10 border-rose-200/60 dark:border-rose-900/40',
      action: () => onSelectAction('explain_topic', 'english', 'Объясни разницу между Present Perfect и Past Simple с примерами.'),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center animate-in fade-in duration-300">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Твой умный AI-репетитор для 9 класса</span>
      </div>

      {/* Greeting Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white text-center tracking-tight">
        Привет 👋
      </h1>
      <p className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300 text-center mt-1 mb-8">
        Что будем делать?
      </p>

      {/* Primary 4 Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
        {primaryCards.map((card, idx) => (
          <button
            key={idx}
            onClick={card.action}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-start gap-3.5 ${card.bg}`}
          >
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0">
              {card.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                {card.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Subject Quick Starters */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Популярные предметы 9 класса
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400">
            12 предметов + автоопределение
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {subjectCards.map((s, idx) => (
            <button
              key={idx}
              onClick={s.action}
              className={`p-3 rounded-2xl bg-gradient-to-b ${s.color} bg-white dark:bg-slate-900 border text-left transition-all duration-150 hover:shadow-xs hover:scale-[1.02] cursor-pointer`}
            >
              <div className="text-2xl mb-1.5">{s.icon}</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {s.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                {s.sub}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
