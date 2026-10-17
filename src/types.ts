export type SubjectId =
  | 'auto'
  | 'algebra'
  | 'geometry'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'russian'
  | 'english'
  | 'tajik'
  | 'history'
  | 'geography'
  | 'informatics'
  | 'literature';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
}

export const SUBJECTS: SubjectInfo[] = [
  { id: 'auto', name: 'Автоопределение', icon: '✨', color: 'from-violet-500 to-indigo-500' },
  { id: 'algebra', name: 'Алгебра', icon: '📐', color: 'from-blue-500 to-cyan-500' },
  { id: 'geometry', name: 'Геометрия', icon: '📏', color: 'from-sky-500 to-blue-600' },
  { id: 'physics', name: 'Физика', icon: '⚡', color: 'from-amber-500 to-orange-500' },
  { id: 'chemistry', name: 'Химия', icon: '🧪', color: 'from-emerald-500 to-teal-600' },
  { id: 'biology', name: 'Биология', icon: '🌿', color: 'from-green-500 to-emerald-600' },
  { id: 'russian', name: 'Русский язык', icon: '📖', color: 'from-rose-500 to-pink-500' },
  { id: 'english', name: 'Английский язык', icon: '🇬🇧', color: 'from-red-500 to-rose-600' },
  { id: 'tajik', name: 'Таджикский язык', icon: '🇹🇯', color: 'from-emerald-600 to-green-700' },
  { id: 'history', name: 'История', icon: '🏛️', color: 'from-yellow-600 to-amber-700' },
  { id: 'geography', name: 'География', icon: '🌍', color: 'from-cyan-600 to-teal-700' },
  { id: 'informatics', name: 'Информатика', icon: '💻', color: 'from-purple-500 to-indigo-600' },
  { id: 'literature', name: 'Литература', icon: '📚', color: 'from-fuchsia-500 to-pink-600' },
];

export type StudyMode =
  | 'tutor'           // 🧠 Репетитор
  | 'homework'        // ✏️ Домашняя работа
  | 'exam'            // 📝 Контрольная работа
  | 'check_solution'  // ⚡ Проверка решения
  | 'explain_topic';  // 📚 Объяснение темы

export interface StudyModeInfo {
  id: StudyMode;
  name: string;
  icon: string;
  badge: string;
  description: string;
}

export const STUDY_MODES: StudyModeInfo[] = [
  {
    id: 'tutor',
    name: 'Репетитор',
    icon: '🧠',
    badge: 'Пошагово',
    description: 'Ведёт по шагам, даёт подсказки и формулы, проверяет ответы',
  },
  {
    id: 'homework',
    name: 'Домашняя работа',
    icon: '✏️',
    badge: 'Разбор',
    description: 'Разбор каждого задания: условие, формула, решение и ответ',
  },
  {
    id: 'exam',
    name: 'Контрольная работа',
    icon: '📝',
    badge: 'Экспресс',
    description: 'Короткие ответы сразу + раскрывающиеся подробные решения',
  },
  {
    id: 'check_solution',
    name: 'Проверка решения',
    icon: '⚡',
    badge: 'Анализ',
    description: 'Проверка фото или текста твоего решения: ✅ верно, ❌ ошибки, ⚠️ неточности',
  },
  {
    id: 'explain_topic',
    name: 'Объяснение темы',
    icon: '📚',
    badge: 'Теория',
    description: 'Простое объяснение, правила, примеры, частые ошибки и тест',
  },
];

export interface ExamTask {
  number: string;
  condition: string;
  shortAnswer: string;
  isMultipleChoice?: boolean;
  choiceExplanation?: string;
  fullSolution: {
    given?: string;
    toFind?: string;
    formula?: string;
    steps: string[];
    finalAnswer: string;
  };
}

export interface ExamData {
  detectedSubject?: string;
  topic?: string;
  unreadableWarning?: string | null;
  overview?: string;
  tasks: ExamTask[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageBase64?: string;
  mimeType?: string;
  imageFileName?: string;
  timestamp: number;
  mode?: StudyMode;
  subject?: SubjectId;
  examData?: ExamData;
  isThinking?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  lastSubject: SubjectId;
  lastMode: StudyMode;
}

export interface StudentProgress {
  subjectMastery: Record<string, number>;
  solvedTasks: number;
  errorsChecked: number;
  sessionsCount: number;
  examTrainingsCount: number;
  strongTopics: string[];
  weakTopics: string[];
  recommendedTopics: Array<{
    subject: string;
    topic: string;
    reason: string;
    mode: StudyMode;
  }>;
}

export interface UserSettings {
  language: 'ru' | 'tg' | 'en';
  grade: string;
  theme: 'light' | 'dark' | 'system';
}
