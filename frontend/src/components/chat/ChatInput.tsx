'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface UploadedFile {
  file_id: string;
  filename: string;
  content_type: string;
  size: number;
  type: 'image' | 'document';
  preview?: string;
}

interface ChatInputProps {
  onSend: (message: string, fileId?: string, fileType?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  supportsVision?: boolean;
  supportsDocuments?: boolean;
}

export default function ChatInput({ 
  onSend, 
  isLoading, 
  disabled,
  supportsVision = false,
  supportsDocuments = false 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSubmit = () => {
    const canSend = (message.trim() || uploadedFile) && !isLoading && !disabled;
    if (canSend) {
      const msgText = message.trim() || (uploadedFile ? 'Проанализируй этот файл' : '');
      onSend(msgText, uploadedFile?.file_id, uploadedFile?.type);
      setMessage('');
      setUploadedFile(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = (message.trim() || uploadedFile) && !isLoading && !disabled;

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Превью файла над инпутом */}
        {uploadedFile && uploadedFile.type === 'image' && uploadedFile.preview && (
          <div className="mb-2 flex justify-start">
            <div className="relative inline-block">
              <img 
                src={uploadedFile.preview} 
                alt="Preview" 
                className="max-h-32 rounded-xl border border-slate-200 dark:border-slate-700"
              />
              <button
                onClick={() => setUploadedFile(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2">
          {/* Кнопка загрузки файлов */}
          <FileUpload
            onFileUploaded={setUploadedFile}
            uploadedFile={uploadedFile}
            disabled={disabled || isLoading}
            supportsVision={supportsVision}
            supportsDocuments={supportsDocuments}
          />

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={uploadedFile ? 'Добавьте описание или нажмите отправить...' : 'Напишите сообщение...'}
            disabled={disabled || isLoading}
            rows={1}
            className="flex-1 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 max-h-[200px]"
          />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ' +
              (canSubmit
                ? 'bg-lana-500 text-white hover:bg-lana-600 shadow-lg shadow-lana-500/25'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              )}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          {supportsVision || supportsDocuments 
            ? 'Enter — отправить • Shift+Enter — новая строка • 📎 — прикрепить файл'
            : 'Enter — отправить, Shift+Enter — новая строка'
          }
        </p>
      </div>
    </div>
  );
}
