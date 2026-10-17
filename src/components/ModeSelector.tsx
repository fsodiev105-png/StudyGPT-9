import React, { useState, useRef, useEffect } from 'react';
import { StudyMode, STUDY_MODES, SubjectId, SUBJECTS } from '../types';
import { ChevronDown, Check, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  currentSubject: SubjectId;
  onSelectSubject: (subject: SubjectId) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  currentSubject,
  onSelectSubject,
}) => {
  const [subjectMenuOpen, setSubjectMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeSubjectInfo = SUBJECTS.find((s) => s.id === currentSubject) || SUBJECTS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSubjectMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 mb-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Horizontal scrollable Mode Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs">
          {STUDY_MODES.map((mode) => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-indigo-100 dark:border-slate-700'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
                title={mode.description}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
                {mode.id === 'exam' && (
                  <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-bold ml-0.5">
                    Экспресс
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subject Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setSubjectMenuOpen(!subjectMenuOpen)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span>{activeSubjectInfo.icon}</span>
              <span className="truncate max-w-[140px]">{activeSubjectInfo.name}</span>
              {currentSubject === 'auto' && (
                <Sparkles className="w-3 h-3 text-indigo-500" />
              )}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${subjectMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {subjectMenuOpen && (
            <div className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 w-56 max-h-64 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Предмет (9 класс)
              </div>
              {SUBJECTS.map((s) => {
                const isSelected = currentSubject === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSubject(s.id);
                      setSubjectMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span>{s.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
