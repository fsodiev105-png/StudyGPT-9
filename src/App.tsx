import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Award,
  Sparkles,
  Share2,
  Trash2,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import {
  ChatSession,
  ChatMessage,
  StudyMode,
  SubjectId,
  StudentProgress,
  UserSettings,
  SUBJECTS,
  STUDY_MODES,
} from './types';
import { Sidebar } from './components/Sidebar';
import { ModeSelector } from './components/ModeSelector';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MathRenderer } from './components/MathRenderer';
import { ExamCard } from './components/ExamCard';
import { CameraModal } from './components/CameraModal';
import { ProgressModal } from './components/ProgressModal';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_SETTINGS: UserSettings = {
  language: 'ru',
  grade: '9 класс',
  theme: 'system',
};

const DEFAULT_PROGRESS: StudentProgress = {
  subjectMastery: {
    algebra: 78,
    physics: 64,
    chemistry: 82,
    geometry: 71,
    russian: 88,
    english: 85,
    biology: 76,
    informatics: 90,
  },
  solvedTasks: 42,
  errorsChecked: 14,
  sessionsCount: 19,
  examTrainingsCount: 7,
  strongTopics: ['Квадратные уравнения', 'Закон Ома', 'Строение атома', 'Past Tenses'],
  weakTopics: ['Электролитическая диссоциация', 'Теорема синусов', 'Закон сохранения импульса'],
  recommendedTopics: [
    {
      subject: 'Химия',
      topic: 'Электролитическая диссоциация',
      reason: '2 ошибки в последнем тесте',
      mode: 'explain_topic',
    },
    {
      subject: 'Геометрия',
      topic: 'Теорема синусов и косинусов',
      reason: 'Рекомендуется для 9 класса перед ОГЭ',
      mode: 'tutor',
    },
    {
      subject: 'Физика',
      topic: 'Закон сохранения импульса',
      reason: 'Низкий процент правильных ответов',
      mode: 'homework',
    },
  ],
};

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'sample-exam-session',
    title: 'Контрольная по алгебре — уравнения',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    lastMode: 'exam',
    lastSubject: 'algebra',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Разбери вариант контрольной работы по алгебре за 9 класс: №1 2x + 4 = 28, №2 x² = 16, №3 Тест: Какая точка лежит на графике y = 2x - 3? A) (1; 1) B) (2; 1) C) (0; 3) D) (3; 4), №4 3x² - 12 = 0',
        timestamp: Date.now() - 3600000,
        mode: 'exam',
        subject: 'algebra',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '',
        timestamp: Date.now() - 3590000,
        mode: 'exam',
        subject: 'algebra',
        examData: {
          detectedSubject: 'Алгебра (9 класс)',
          topic: 'Линейные и неполные квадратные уравнения, функции',
          overview: 'Распознано 4 задания варианта. Ниже представлены экспресс-ответы и подробный ход решений с проверкой.',
          unreadableWarning: null,
          tasks: [
            {
              number: '№1',
              condition: 'Решить линейное уравнение: $2x + 4 = 28$',
              shortAnswer: '✅ Ответ: 12',
              isMultipleChoice: false,
              fullSolution: {
                given: '$2x + 4 = 28$',
                toFind: 'Значение переменной $x$',
                formula: 'Перенос слагаемых с противоположным знаком',
                steps: [
                  'Переносим слагаемое 4 в правую часть: $2x = 28 - 4$',
                  'Вычисляем правую часть: $2x = 24$',
                  'Делим обе части на коэффициент перед $x$: $x = \\frac{24}{2} = 12$',
                ],
                finalAnswer: 'x = 12',
              },
            },
            {
              number: '№2',
              condition: 'Решить квадратное уравнение: $x^2 = 16$',
              shortAnswer: '✅ Ответ: x = 4; x = -4',
              isMultipleChoice: false,
              fullSolution: {
                given: '$x^2 = 16$',
                toFind: 'Корни уравнения',
                formula: '$x = \\pm \\sqrt{a}$ при $a > 0$',
                steps: [
                  'Извлекаем квадратный корень из обеих частей: $x = \\pm\\sqrt{16}$',
                  'Получаем два корня: $x_1 = 4$, $x_2 = -4$',
                ],
                finalAnswer: 'x_1 = 4; x_2 = -4',
              },
            },
            {
              number: '№3',
              condition: 'Тест: Какая точка лежит на графике функции $y = 2x - 3$?\nA) $(1; 1)$\nB) $(2; 1)$\nC) $(0; 3)$\nD) $(3; 4)$',
              shortAnswer: '✅ Ответ: B',
              isMultipleChoice: true,
              choiceExplanation: 'Подставим координаты точки B(2; 1): $x = 2, y = 1$. Проверяем равенство: $2 \\cdot 2 - 3 = 4 - 3 = 1$. Равенство $1 = 1$ верно! Для других точек равенство не соблюдается: для A) $2(1)-3 = -1 \\neq 1$.',
              fullSolution: {
                given: 'Функция $y = 2x - 3$',
                toFind: 'Принадлежность точки графику',
                formula: 'Точка $(x_0, y_0)$ принадлежит графику, если при подстановке $x_0$ получается $y_0$',
                steps: [
                  'Проверка A(1; 1): $y = 2(1) - 3 = -1 \\neq 1$ (не подходит)',
                  'Проверка B(2; 1): $y = 2(2) - 3 = 4 - 3 = 1$ (верно, точка лежит на графике)',
                  'Проверка C(0; 3): $y = 2(0) - 3 = -3 \\neq 3$',
                  'Проверка D(3; 4): $y = 2(3) - 3 = 3 \\neq 4$',
                ],
                finalAnswer: 'Вариант B (2; 1)',
              },
            },
            {
              number: '№4',
              condition: 'Решить неполное квадратное уравнение: $3x^2 - 12 = 0$',
              shortAnswer: '✅ Ответ: x = 2; x = -2',
              isMultipleChoice: false,
              fullSolution: {
                given: '$3x^2 - 12 = 0$',
                toFind: 'Корни $x$',
                formula: 'Неполное квадратное уравнение вида $ax^2 + c = 0$',
                steps: [
                  'Переносим $-12$ вправо: $3x^2 = 12$',
                  'Делим обе части на 3: $x^2 = 4$',
                  'Извлекаем корень: $x = \\pm\\sqrt{4} = \\pm 2$',
                ],
                finalAnswer: 'x_1 = 2; x_2 = -2',
              },
            },
          ],
        },
      },
    ],
  },
];

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('studygpt9_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return sessions.length > 0 ? sessions[0].id : null;
  });

  const [currentMode, setCurrentMode] = useState<StudyMode>('homework');
  const [currentSubject, setCurrentSubject] = useState<SubjectId>('auto');
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('studygpt9_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem('studygpt9_progress');
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('studygpt9_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('studygpt9_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('studygpt9_progress', JSON.stringify(progress));
  }, [progress]);

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Start a new chat
  const handleNewChat = (mode?: StudyMode, subject?: SubjectId, initialPrompt?: string) => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'Новый диалог',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      lastMode: mode || currentMode,
      lastSubject: subject || currentSubject,
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    if (mode) setCurrentMode(mode);
    if (subject) setCurrentSubject(subject);

    if (initialPrompt) {
      setTimeout(() => {
        handleSendMessage(initialPrompt);
      }, 50);
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleSendMessage = async (text: string, imageBase64?: string, mimeType?: string) => {
    let sessionId = activeSessionId;
    let targetSession = sessions.find((s) => s.id === sessionId);

    if (!targetSession) {
      const newId = `session-${Date.now()}`;
      targetSession = {
        id: newId,
        title: 'Новый диалог',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
        lastMode: currentMode,
        lastSubject: currentSubject,
      };
      setSessions((prev) => [targetSession!, ...prev]);
      setActiveSessionId(newId);
      sessionId = newId;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      imageBase64,
      mimeType,
      timestamp: Date.now(),
      mode: currentMode,
      subject: currentSubject,
    };

    // Add user message to session
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, userMessage],
              updatedAt: Date.now(),
              lastMode: currentMode,
              lastSubject: currentSubject,
            }
          : s
      )
    );

    setIsLoading(true);

    try {
      const allMessages = [...targetSession.messages, userMessage];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          mode: currentMode,
          subject: currentSubject,
          grade: settings.grade,
          language: settings.language,
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось связаться с сервером StudyGPT.');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '',
        timestamp: Date.now(),
        mode: currentMode,
        subject: currentSubject,
        examData: data.examData,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, assistantMessage],
                updatedAt: Date.now(),
              }
            : s
        )
      );

      // Increment progress counters
      setProgress((prev) => ({
        ...prev,
        solvedTasks: prev.solvedTasks + (data.examData?.tasks?.length || 1),
        sessionsCount: prev.sessionsCount + 1,
        examTrainingsCount: currentMode === 'exam' ? prev.examTrainingsCount + 1 : prev.examTrainingsCount,
      }));

      // Generate smart title if title was default
      if (targetSession.title === 'Новый диалог') {
        fetch('/api/generate-title', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text, reply: data.reply }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.title) {
              handleRenameSession(sessionId!, res.title);
            }
          })
          .catch(() => {});
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `❌ Произошла ошибка: ${err.message || 'Проверьте соединение с интернетом и попробуйте снова.'}`,
        timestamp: Date.now(),
        mode: currentMode,
        subject: currentSubject,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, errorMessage] }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleExamTaskFollowUp = (taskNumber: string, condition: string) => {
    setCurrentMode('tutor');
    handleSendMessage(`Объясни мне подробно по шагам задание ${taskNumber}: ${condition}. С чего начать?`);
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={() => handleNewChat()}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onOpenProgress={() => setIsProgressOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        currentGrade={settings.grade}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-14 px-3 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Открыть меню"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                {activeSession?.title || 'StudyGPT 9'}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                {settings.grade}
              </span>
            </div>
          </div>

          {/* Quick Actions in Navbar */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsProgressOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Мой прогресс"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Прогресс</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Сменить тему"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          </div>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
          {!activeSession || activeSession.messages.length === 0 ? (
            <WelcomeScreen
              onSelectAction={handleNewChat}
              onOpenCamera={() => setIsCameraOpen(true)}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-5">
              {activeSession.messages.map((msg) => {
                const isUser = msg.role === 'user';
                const subjectObj = SUBJECTS.find((s) => s.id === msg.subject);
                const modeObj = STUDY_MODES.find((m) => m.id === msg.mode);

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 sm:gap-3.5 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                        isUser
                          ? 'bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800'
                          : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/20'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Bubble Container */}
                    <div
                      className={`flex flex-col max-w-[92%] sm:max-w-[85%] ${
                        isUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      {/* Sub-header tags */}
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {modeObj && (
                          <span className="flex items-center gap-1">
                            <span>{modeObj.icon}</span>
                            <span>{modeObj.name}</span>
                          </span>
                        )}
                        {subjectObj && subjectObj.id !== 'auto' && (
                          <>
                            <span>•</span>
                            <span>{subjectObj.name}</span>
                          </>
                        )}
                      </div>

                      {/* Attached image preview */}
                      {msg.imageBase64 && (
                        <div className="mb-2">
                          <img
                            src={msg.imageBase64}
                            alt="Uploaded homework"
                            onClick={() => setEnlargedImage(msg.imageBase64 || null)}
                            className="max-h-64 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md cursor-pointer hover:opacity-95 transition-opacity object-contain bg-slate-50 dark:bg-slate-900"
                          />
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
                            Нажмите на фото для увеличения
                          </p>
                        </div>
                      )}

                      {/* If message is Exam Data with structured tasks */}
                      {msg.examData ? (
                        <div className="w-full">
                          <ExamCard
                            examData={msg.examData}
                            onAskFollowUp={handleExamTaskFollowUp}
                            onMarkCompleted={() => {
                              setProgress((prev) => ({
                                ...prev,
                                solvedTasks: prev.solvedTasks + (msg.examData?.tasks.length || 0),
                                examTrainingsCount: prev.examTrainingsCount + 1,
                              }));
                            }}
                          />
                        </div>
                      ) : (
                        /* Standard message bubble */
                        <div
                          className={`p-3.5 sm:p-4 rounded-3xl shadow-xs ${
                            isUser
                              ? 'bg-indigo-600 text-white rounded-tr-xs'
                              : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap text-sm sm:text-[15px] leading-relaxed">
                              {msg.content}
                            </p>
                          ) : (
                            <MathRenderer content={msg.content} />
                          )}
                        </div>
                      )}

                      {/* Assistant Bottom Toolbar */}
                      {!isUser && (
                        <div className="flex items-center gap-2 mt-1.5 px-1">
                          <button
                            onClick={() => handleCopyMessage(msg)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Скопировано</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Копировать</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Thinking / Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5 sm:gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-3xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      StudyGPT 9 распознаёт задание и составляет решение...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input & Mode Selector at Bottom */}
        <div className="shrink-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 pt-2">
          <ModeSelector
            currentMode={currentMode}
            onSelectMode={setCurrentMode}
            currentSubject={currentSubject}
            onSelectSubject={setCurrentSubject}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentMode={currentMode}
            onOpenCamera={() => setIsCameraOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => {
          handleSendMessage('', base64, 'image/jpeg');
        }}
      />

      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        progress={progress}
        onStartPractice={(mode, subject, prompt) => {
          handleNewChat(mode, subject, prompt);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />

      {/* Enlarged image preview lightbox */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
        >
          <img
            src={enlargedImage}
            alt="Enlarged"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
