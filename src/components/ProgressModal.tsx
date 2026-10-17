import React from 'react';
import { X, Award, CheckCircle2, AlertOctagon, Flame, BookMarked, Sparkles, ArrowRight } from 'lucide-react';
import { StudentProgress, StudyMode, SubjectId } from '../types';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: StudentProgress;
  onStartPractice: (mode: StudyMode, subject: SubjectId, topic: string) => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  onStartPractice,
}) => {
  if (!isOpen) return null;

  const subjectPercentages = [
    { name: 'Алгебра', percent: progress.subjectMastery['algebra'] ?? 78, color: 'bg-blue-500' },
    { name: 'Физика', percent: progress.subjectMastery['physics'] ?? 64, color: 'bg-amber-500' },
    { name: 'Химия', percent: progress.subjectMastery['chemistry'] ?? 82, color: 'bg-emerald-500' },
    { name: 'Геометрия', percent: progress.subjectMastery['geometry'] ?? 71, color: 'bg-sky-500' },
    { name: 'Русский язык', percent: progress.subjectMastery['russian'] ?? 88, color: 'bg-rose-500' },
    { name: 'Английский язык', percent: progress.subjectMastery['english'] ?? 85, color: 'bg-red-500' },
    { name: 'Биология', percent: progress.subjectMastery['biology'] ?? 76, color: 'bg-green-600' },
    { name: 'Информатика', percent: progress.subjectMastery['informatics'] ?? 90, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Мой прогресс
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Успеваемость, статистика занятий и рекомендации для 9 класса
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* 4 Key Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {progress.solvedTasks}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Решено заданий
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-center">
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {progress.errorsChecked}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Разобрано ошибок
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {progress.examTrainingsCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Контрольных работ
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {progress.sessionsCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Занятий с AI
              </div>
            </div>
          </div>

          {/* Subject Mastery List with Progress Bars */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
              Успеваемость по предметам
            </h3>
            <div className="space-y-3">
              {subjectPercentages.map((sub, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {sub.name}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {sub.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${sub.color}`}
                      style={{ width: `${sub.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strong & Weak Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strong */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Сильные темы</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {progress.strongTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Weak */}
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
              <div className="flex items-center gap-2 mb-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Слабые темы (требуют внимания)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {progress.weakTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-100/70 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended to review */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Рекомендуется повторить</span>
              </div>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                Автоматический список тем
              </span>
            </div>

            <div className="space-y-2">
              {progress.recommendedTopics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100/60 dark:border-indigo-950 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.topic}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                        {item.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onStartPractice(item.mode, 'auto', `Объясни тему «${item.topic}» и дай 2 практические задачи для закрепления.`);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 transition-colors cursor-pointer"
                  >
                    <span>Повторить</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
