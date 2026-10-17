import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Camera, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { StudyMode } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, imageBase64?: string, mimeType?: string) => void;
  isLoading: boolean;
  currentMode: StudyMode;
  onOpenCamera: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  currentMode,
  onOpenCamera,
}) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения (PNG, JPG, WEBP).');
      return;
    }
    setImageFileName(file.name);
    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !selectedImage) || isLoading) return;

    onSendMessage(text.trim(), selectedImage || undefined, mimeType);
    setText('');
    setSelectedImage(null);
    setImageFileName('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getPlaceholder = () => {
    switch (currentMode) {
      case 'exam':
        return 'Загрузи фото варианта контрольной или напиши задания (№1, №2...)...';
      case 'tutor':
        return 'Задай вопрос по предмету или загрузи задачу для пошагового разбора...';
      case 'check_solution':
        return 'Пришли фото своего решения или опиши свой ответ для проверки...';
      case 'explain_topic':
        return 'Какую тему объяснить? Например: Закон Архимеда, Квадратные уравнения...';
      case 'homework':
      default:
        return 'Напиши вопрос или сфотографируй страницу учебника / тетради...';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative w-full max-w-4xl mx-auto px-2 sm:px-4 pb-3"
    >
      {/* Hidden standard file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Drag & Drop Visual Indicator */}
      {isDragging && (
        <div className="absolute inset-x-2 sm:inset-x-4 inset-y-0 -top-12 z-30 flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20 border-2 border-dashed border-indigo-500 rounded-3xl backdrop-blur-xs text-indigo-600 dark:text-indigo-300 font-semibold text-sm">
          Отпустите фото сюда для распознавания заданий
        </div>
      )}

      {/* Main Input Box */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-2 sm:p-2.5">
        {/* Attached image preview banner */}
        {selectedImage && (
          <div className="mb-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {imageFileName || 'Фотография задания'}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Готово к распознаванию текста и формул
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setImageFileName('');
              }}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          rows={1}
          className="w-full bg-transparent resize-none text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none px-2 py-1 max-h-48"
        />

        {/* Action Buttons Toolbar */}
        <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-1">
          <div className="flex items-center gap-1">
            {/* Gallery / File Picker */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Загрузить фото из галереи"
            >
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">Фото</span>
            </button>

            {/* Direct Camera Button */}
            <button
              type="button"
              onClick={onOpenCamera}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Открыть камеру телефона или веб-камеру"
            >
              <Camera className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Камера</span>
            </button>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={(!text.trim() && !selectedImage) || isLoading}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              (text.trim() || selectedImage) && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-105 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Отправить (Enter)"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-1.5">
        StudyGPT 9 может ошибаться. Проверяйте важные вычисления и правила.
      </p>
    </div>
  );
};
