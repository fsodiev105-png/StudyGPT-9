import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generous body limit for high-resolution homework photos & test papers
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Initialize GoogleGenAI SDK with required headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ExamTask {
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

interface ChatRequestBody {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    imageBase64?: string;
    mimeType?: string;
  }>;
  mode: 'tutor' | 'homework' | 'exam' | 'check_solution' | 'explain_topic';
  subject?: string;
  grade?: string;
  language?: 'ru' | 'tg' | 'en';
}

function buildSystemInstruction(mode: string, subject: string, grade: string, language: string): string {
  const langName = language === 'tg' ? 'таджикский (тоҷикӣ)' : language === 'en' ? 'English' : 'русский';

  let subjectRule = '';
  if (subject && subject !== 'auto') {
    subjectRule = `Предмет: "${subject}".`;
  } else {
    subjectRule = `Предмет не указан заранее: ты ДОЛЖЕН автоматически определить предмет школьной программы (Алгебра, Геометрия, Физика, Химия, Биология, Русский язык, Английский язык, Таджикский язык, История, География, Информатика, Литература) по тексту или фото и явно указать его в начале ответа.`;
  }

  const baseInstructions = `
Ты — StudyGPT 9, лучший персональный AI-помощник и репетитор для учеников ${grade || '9 класса'}.
Отвечай на языке: ${langName}.
${subjectRule}

Общие правила оформления:
- Формулы и математические выражения оформляй в LaTeX/KaTeX: внутри inline $...$ или выносные $$...$$.
  Например: $x^2 - 5x + 6 = 0$, $D = b^2 - 4ac$, $v = \\frac{s}{t}$, $\\text{H}_2\\text{SO}_4$.
- Если прислана фотография:
  1. Распознай весь видимый текст, формулы, рисунки и графики.
  2. Найди все задания и их номера (№1, №2...).
  3. Если какая-то часть фотографии смазана, обрезана или нечитаема, вежливо предупреди ученика: "⚠️ Внимание: часть изображения в районе [указать] неразборчива, пожалуйста, пришлите более четкий снимок при необходимости."
- Специфика предметов:
  * ФИЗИКА: обязательно используй строгий формат:
    **Дано:** (величины в СИ, m = ..., v = ...)
    **Найти:** (...)
    **Формула:** (...)
    **Решение:** (подробный ход с подстановкой чисел и проверкой единиц измерения)
    **Ответ:** (...)
  * ХИМИЯ: составляй уравнения реакций, правильно расставляй коэффициенты, указывай валентность/степени окисления, показывай электролитическую диссоциацию и тип реакции при необходимости.
  * МАТЕМАТИКА/АЛГЕБРА/ГЕОМЕТРИЯ: подробный ход вычислений без пропусков промежуточных шагов. Для геометрии: Дано, Найти/Доказать, Чертеж/описание, Теоремы, Решение, Ответ.
  * АНГЛИЙСКИЙ ЯЗЫК: объясняй грамматическое правило (время, залог, артикли, предлоги), переводи ключевые фразы, разбирай варианты ответов.
`;

  if (mode === 'exam') {
    return `${baseInstructions}
РЕЖИМ: 📝 КОНТРОЛЬНАЯ РАБОТА (РАЗБОР И ТРЕНИРОВКА ПО ВАРИАНТАМ).
Этот режим предназначен для тренировки, разбора вариантов и самопроверки ученика!
На фотографии или в тексте может быть СРАЗУ МНОГО ЗАДАНИЙ (например, №1, №2, №3, ..., №10).
Твоя главная задача:
1. Выделить КАЖДОЕ задание по отдельности.
2. Для КАЖДОГО задания СНАЧАЛА сформировать КОРОТКИЙ ЧЁТКИЙ ОТВЕТ (чтобы ученик мог быстро проверить себя), а затем ПОЛНОЕ ПОДРОБНОЕ РЕШЕНИЕ.
Если вопрос тестовый с вариантами (A, B, C, D):
   - Короткий ответ: "✅ Ответ: C"
   - Объяснение "Почему C?": подробный разбор, почему этот вариант верный и почему остальные не подходят.

ВАЖНО: В режиме "exam" верни ответ в строгом JSON-формате, чтобы приложение показало интерактивные карточки с раскрывающимися блоками решений!
Структура JSON:
{
  "detectedSubject": "название предмета",
  "topic": "тема контрольной",
  "unreadableWarning": null или "текст предупреждения о нечитаемых фрагментах",
  "overview": "Краткое приветствие и обзор контрольной (например: Найдено 6 заданий по теме Квадратичная функция...)",
  "tasks": [
    {
      "number": "№1",
      "condition": "Текст задания или краткое условие",
      "shortAnswer": "✅ Ответ: 12",
      "isMultipleChoice": false,
      "choiceExplanation": "",
      "fullSolution": {
        "given": "Дано: 2x + 4 = 28",
        "toFind": "Найти x",
        "formula": "",
        "steps": [
          "2x = 28 - 4",
          "2x = 24",
          "x = 12"
        ],
        "finalAnswer": "x = 12"
      }
    }
  ]
}
Верни ТОЛЬКО валидный JSON без markdown-обёртки (\`\`\`json) если возможно, либо внутри \`\`\`json \`\`\`.
`;
  }

  if (mode === 'tutor') {
    return `${baseInstructions}
РЕЖИМ: 🧠 РЕПЕТИТОР.
Ты работаешь по методу Сократа.
НЕ ВЫДАВАЙ ВСЁ РЕШЕНИЕ СРАЗУ!
Алгоритм:
1. Определи тему задания.
2. Напомни главное правило или формулу.
3. Дай легкую наводящую подсказку.
4. Предложи ученику сделать первый шаг самостоятельно или ответь на его промежуточный вопрос.
5. Если ученик пишет ответ или шаг — проверь его, укажи на ошибки мягко и поддерживающе.
6. Выдавай полное решение только когда ученик дошел до конца или прямо попросил: "Сдайся" / "Покажи полное решение".
Общайся дружелюбно, как мудрый старший наставник.
`;
  }

  if (mode === 'homework') {
    return `${baseInstructions}
РЕЖИМ: ✏️ ДОМАШНЯЯ РАБОТА.
После загрузки фото или вопроса разбирай задания по очереди.
Формат для каждого задания:
**[Номер задания, например: №354]**
**Что нужно сделать:** ...
**Формула / Правило:** ...
**Подсказка:** ...
**Полное решение:**
1. ...
2. ...
**Ответ:** ...
Не пропускай промежуточные вычисления. Делай шаги максимально понятными для девятиклассника.
`;
  }

  if (mode === 'check_solution') {
    return `${baseInstructions}
РЕЖИМ: ⚡ ПРОВЕРКА РЕШЕНИЯ.
Ученик прислал своё решение задачи или домашней работы.
Твоя задача — внимательно проверить каждый шаг:
- Отметь ✅ правильные шаги с кратким комментарием;
- Отметь ❌ ошибки с объяснением, почему так делать нельзя;
- Отметь ⚠️ неполные шаги, пропущенные единицы измерения или логические нестыковки.
После разбора покажи идеальный исправленный вариант решения с итоговым верным ответом.
Похвали ученика за старания и дай совет, на что обратить внимание в этой теме.
`;
  }

  if (mode === 'explain_topic') {
    return `${baseInstructions}
РЕЖИМ: 📚 ОБЪЯСНЕНИЕ ТЕМЫ.
Ученик просит объяснить тему (например: «Объясни квадратные уравнения» или «Закон Ома»).
Структурируй объяснение строго по разделам:
1. 💡 **Простое объяснение на пальцах** (жизненная аналогия, зачем это нужно в реальном мире)
2. 📖 **Школьное правило и определение**
3. 📐 **Главные формулы** (в LaTeX $...$)
4. 📝 **Пример 1 (Базовый)** с подробным решением
5. 🚀 **Пример 2 (Посложнее или с подвохом)**
6. ⚠️ **Частые ошибки 9-классников на ОГЭ / контрольных**
7. 📌 **Короткий итог (шпаргалка в 2-3 пунктах)**
8. ❓ **3 вопроса для самопроверки** (чтобы ученик мог проверить себя прямо в чате)
`;
  }

  return baseInstructions;
}

// POST /api/chat - main intelligent endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode = 'homework', subject = 'auto', grade = '9 класс', language = 'ru' }: ChatRequestBody = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const lastMessage = messages[messages.length - 1];
    const systemInstruction = buildSystemInstruction(mode, subject, grade, language);

    // Build contents for Gemini 3.8 Flash
    const contents: any[] = [];

    // History turns (last 6 to maintain context without overloading)
    const contextMessages = messages.slice(-7);

    for (let i = 0; i < contextMessages.length; i++) {
      const msg = contextMessages[i];
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const parts: any[] = [];

      if (msg.imageBase64 && msg.mimeType) {
        // Strip data:image/...;base64, prefix if present
        const cleanBase64 = msg.imageBase64.includes(',') ? msg.imageBase64.split(',')[1] : msg.imageBase64;
        parts.push({
          inlineData: {
            mimeType: msg.mimeType,
            data: cleanBase64,
          },
        });
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      if (parts.length > 0) {
        contents.push({ role, parts });
      }
    }

    // Call Gemini 3.8 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: mode === 'exam' ? 0.3 : 0.6,
      },
    });

    const replyText = response.text || '';

    // If mode is exam, attempt to parse structured JSON
    if (mode === 'exam') {
      let parsedExam: any = null;
      try {
        // Clean markdown backticks if any
        let cleanJson = replyText.trim();
        if (cleanJson.startsWith('```json')) {
          cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        parsedExam = JSON.parse(cleanJson);
      } catch (jsonErr) {
        // Fallback: regex search for JSON object inside response
        const match = replyText.match(/\{[\s\S]*"tasks"[\s\S]*\}/);
        if (match) {
          try {
            parsedExam = JSON.parse(match[0]);
          } catch (e) {
            // keep as text
          }
        }
      }

      return res.json({
        reply: replyText,
        examData: parsedExam,
        mode,
      });
    }

    return res.json({
      reply: replyText,
      mode,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Ошибка обработки запроса AI. Попробуйте еще раз.',
    });
  }
});

// Auto-titling helper for chats
app.post('/api/generate-title', async (req, res) => {
  try {
    const { prompt, reply } = req.body;
    if (!prompt && !reply) {
      return res.json({ title: 'Новый диалог' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Сгенерируй очень короткое название диалога (2-4 слова на русском) для школьника 9 класса по этому вопросу/ответу:
Вопрос: ${prompt || ''}
Ответ: ${(reply || '').slice(0, 300)}

Примеры хороших названий:
«Алгебра — квадратные уравнения»
«Контрольная по физике»
«Химия — диссоциация»
«Геометрия — теорема Пифагора»

Выведи ТОЛЬКО название без кавычек и лишних слов.`,
    });

    const title = (response.text || 'Школьный разбор').trim().replace(/^["«]|["»]$/g, '');
    return res.json({ title });
  } catch (err) {
    return res.json({ title: 'Школьный разбор' });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`StudyGPT 9 server running at http://localhost:${PORT}`);
});
