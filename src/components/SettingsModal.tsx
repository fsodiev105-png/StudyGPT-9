import React from 'react';
import { X, Settings, Sun, Moon, Monitor, Globe, GraduationCap } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Настройки
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                StudyGPT 9 — параметры помощника
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

        {/* Content */}
        <div className="p-5 space-y-5 text-sm">
          {/* Language selection */}
          <div>
            <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2 text-xs uppercase tracking-wider">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Язык ответов</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ru', label: 'Русский', flag: '🇷🇺' },
                { id: 'tg', label: 'Тоҷикӣ', flag: '🇹🇯' },
                { id: 'en', label: 'English', flag: '🇬🇧' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onUpdateSettings({ language: lang.id as any })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    settings.language === lang.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grade selection */}
          <div>
            <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2 text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span>Класс обучения</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['8 класс', '9 класс', '10 класс', '11 класс'].map((gr) => (
                <button
                  key={gr}
                  onClick={() => onUpdateSettings({ grade: gr })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    settings.grade === gr
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {gr}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              По умолчанию выбран 9 класс (программа ОГЭ и выпускных экзаменов).
            </p>
          </div>

          {/* Theme selection */}
          <div>
            <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2 text-xs uppercase tracking-wider">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Оформление темы</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Светлая', icon: <Sun className="w-4 h-4" /> },
                { id: 'dark', label: 'Тёмная', icon: <Moon className="w-4 h-4" /> },
                { id: 'system', label: 'Системная', icon: <Monitor className="w-4 h-4" /> },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => onUpdateSettings({ theme: th.id as any })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    settings.theme === th.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {th.icon}
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
