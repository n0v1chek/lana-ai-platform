'use client';
import { useState, useRef, useCallback } from 'react';
import { Paperclip, Camera, X, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';

interface UploadedFile {
  file_id: string;
  filename: string;
  content_type: string;
  size: number;
  type: 'image' | 'document';
  preview?: string;
}

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile | null) => void;
  uploadedFile: UploadedFile | null;
  disabled?: boolean;
  supportsVision: boolean;
  supportsDocuments: boolean;
}

export function FileUpload({ 
  onFileUploaded, 
  uploadedFile, 
  disabled,
  supportsVision,
  supportsDocuments 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_URL + '/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Ошибка загрузки');
      }

      const data = await response.json();
      
      // Создаём превью для изображений
      let preview: string | undefined;
      if (data.type === 'image') {
        preview = URL.createObjectURL(file);
      }

      onFileUploaded({
        ...data,
        preview,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      onFileUploaded(null);
    } finally {
      setIsUploading(false);
    }
  }, [API_URL, onFileUploaded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Сбрасываем input чтобы можно было выбрать тот же файл
    e.target.value = '';
  }, [handleUpload]);

  const handleRemove = useCallback(() => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    onFileUploaded(null);
    setError(null);
  }, [uploadedFile, onFileUploaded]);

  const acceptTypes = [];
  if (supportsVision) {
    acceptTypes.push('image/jpeg', 'image/png', 'image/gif', 'image/webp');
  }
  if (supportsDocuments) {
    acceptTypes.push('application/pdf', 'text/plain', 'text/csv', 'application/json');
  }

  const canUpload = supportsVision || supportsDocuments;

  if (!canUpload) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Скрытые input'ы */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading || !supportsVision}
      />

      {/* Превью загруженного файла */}
      {uploadedFile && (
        <div className="relative flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
          {uploadedFile.type === 'image' && uploadedFile.preview ? (
            <img 
              src={uploadedFile.preview} 
              alt="Preview" 
              className="w-10 h-10 object-cover rounded-lg"
            />
          ) : (
            <FileText className="w-6 h-6 text-slate-500" />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
              {uploadedFile.filename}
            </span>
            <span className="text-xs text-slate-500">
              {(uploadedFile.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full"
          >
            <X size={14} className="text-slate-500" />
          </button>
        </div>
      )}

      {/* Кнопки загрузки */}
      {!uploadedFile && (
        <>
          {/* Кнопка выбора файла */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="p-2 rounded-xl text-slate-500 hover:text-lana-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            title={supportsVision && supportsDocuments ? 'Загрузить файл или изображение' : supportsVision ? 'Загрузить изображение' : 'Загрузить документ'}
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Paperclip size={20} />
            )}
          </button>

          {/* Кнопка камеры (только на мобильных и если поддерживается vision) */}
          {supportsVision && (
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="p-2 rounded-xl text-slate-500 hover:text-lana-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 sm:hidden"
              title="Сделать фото"
            >
              <Camera size={20} />
            </button>
          )}
        </>
      )}

      {/* Ошибка */}
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
