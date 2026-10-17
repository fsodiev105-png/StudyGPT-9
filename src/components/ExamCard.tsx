import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle2, Copy, Check, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import { ExamData, ExamTask } from '../types';
import { MathRenderer } from './MathRenderer';
import confetti from 'canvas-confetti';

interface ExamCardProps {
  examData: ExamData;
  onAskFollowUp?: (taskNumber: string, condition: string) => void;
  onMarkCompleted?: () => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  examData,
  onAskFollowUp,
  onMarkCompleted,
}) => {
  const tasks = examData.tasks || [];
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
  const [copiedTask, setCopiedTask] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleTask = (index: number) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    tasks.forEach((_, idx) => {
      all[idx] = true;
    });
    setExpandedTasks(all);
  };

  const collapseAll = () => {
    setExpandedTasks({});
  };

  const handleCopy = (task: ExamTask, index: number) => {
    const text = `${task.number}: ${task.shortAnswer}\n${task.condition}\n\nРешение:\n${task.fullSolution?.steps?.join('\n') || ''}\nИтог: ${task.fullSolution?.finalAnswer || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedTask(index);
    setTimeout(() => setCopiedTask(null), 2000);
  };

  const handleFinishVariant = () => {
    setIsCompleted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
    if (onMarkCompleted) {
      onMarkCompleted();
    }
  };

  const expandedCount = Object.values(expandedTasks).filter(Boolean).length;

  return (
    <div className="my-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-indigo-950/30 p-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Контрольная работа
                </h3>
                {examData.detectedSubject && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    {examData.detectedSubject}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {examData.topic ? `Тема: ${examData.topic}` : 'Экспресс-разбор заданий варианта'} • {tasks.length} {tasks.length === 1 ? 'задание' : tasks.length < 5 ? 'задания' : 'заданий'}
              </p>
            </div>
          </div>

          {/* Quick Global Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Раскрыть решения для всех номеров"
            >
              <Eye className="w-3.5 h-3.5" />
              Показать все решения
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Скрыть все решения, оставить только короткие ответы"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Скрыть все
            </button>
          </div>
        </div>

        {/* Warning if part of image was unreadable */}
        {examData.unreadableWarning && (
          <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{examData.unreadableWarning}</span>
          </div>
        )}

        {examData.overview && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
            {examData.overview}
          </p>
        )}
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {tasks.map((task, idx) => {
          const isExpanded = !!expandedTasks[idx];

          return (
            <div
              key={idx}
              className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
            >
              {/* Task Header: Number, Condition & Prominent Short Answer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs tracking-wide">
                      {task.number || `№${idx + 1}`}
                    </span>
                    {task.isMultipleChoice && (
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Тестовый вопрос
                      </span>
                    )}
                  </div>

                  {task.condition && (
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                      <MathRenderer content={task.condition} />
                    </div>
                  )}

                  {/* PROMINENT SHORT ANSWER (Highlighted as requested) */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold text-sm sm:text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{task.shortAnswer || 'Решено'}</span>
                  </div>

                  {/* Multiple Choice Explanation Preview if available */}
                  {task.isMultipleChoice && task.choiceExplanation && !isExpanded && (
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                      💡 <strong>Почему этот вариант?</strong> Нажми «Показать решение», чтобы увидеть объяснение.
                    </p>
                  )}
                </div>

                {/* Action Buttons for this task */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    onClick={() => handleCopy(task, idx)}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Скопировать"
                  >
                    {copiedTask === idx ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleTask(idx)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                      isExpanded
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Скрыть решение
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Показать полное решение
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Full Solution Container */}
              {isExpanded && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-200/80 dark:border-slate-800/80 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm space-y-2.5">
                    {/* Multiple choice explanation */}
                    {task.isMultipleChoice && task.choiceExplanation && (
                      <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200">
                        <span className="font-bold text-xs uppercase tracking-wide block mb-1">
                          Почему именно этот ответ?
                        </span>
                        <MathRenderer content={task.choiceExplanation} />
                      </div>
                    )}

                    {/* Given / Дано */}
                    {task.fullSolution?.given && (
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Дано / Условие:
                        </span>
                        <div className="mt-0.5 text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-indigo-300 dark:border-indigo-700">
                          <MathRenderer content={task.fullSolution.given} />
                        </div>
                      </div>
                    )}

                    {/* To Find / Найти */}
                    {task.fullSolution?.toFind && (
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Найти:
                        </span>
                        <div className="mt-0.5 text-slate-600 dark:text-slate-400 pl-2">
                          <MathRenderer content={task.fullSolution.toFind} />
                        </div>
                      </div>
                    )}

                    {/* Formula / Формула */}
                    {task.fullSolution?.formula && (
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Формула / Теорема:
                        </span>
                        <div className="mt-1">
                          <MathRenderer content={task.fullSolution.formula} />
                        </div>
                      </div>
                    )}

                    {/* Step-by-step Solution */}
                    {task.fullSolution?.steps && task.fullSolution.steps.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Ход решения:
                        </span>
                        <div className="mt-1.5 space-y-1.5 pl-1">
                          {task.fullSolution.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2">
                              <span className="font-semibold text-indigo-500 shrink-0 text-xs mt-0.5">
                                {sIdx + 1}.
                              </span>
                              <div className="flex-1 text-slate-800 dark:text-slate-200">
                                <MathRenderer content={step} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Final Answer */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm sm:text-base">
                        <span>Итоговый ответ: </span>
                        <span>{task.fullSolution?.finalAnswer || task.shortAnswer}</span>
                      </div>

                      {onAskFollowUp && (
                        <button
                          onClick={() => onAskFollowUp(task.number || `№${idx + 1}`, task.condition)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          Спросить репетитора по шагам
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer completion & stats */}
      <div className="bg-slate-50 dark:bg-slate-900/90 p-3 px-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div>
          <span>Раскрыто решений: </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {expandedCount} из {tasks.length}
          </span>
        </div>

        <button
          onClick={handleFinishVariant}
          disabled={isCompleted}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {isCompleted ? 'Вариант разобран! 🎉' : 'Отметить вариант пройденным'}
        </button>
      </div>
    </div>
  );
};
