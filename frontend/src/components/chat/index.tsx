import dynamic from 'next/dynamic';

// Lazy load heavy components
export const ChatMessage = dynamic(() => import('./ChatMessage'), {
  loading: () => <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-2xl h-20 w-full" />,
  ssr: false
});

export const ModelSelector = dynamic(() => import('./ModelSelector'), {
  loading: () => <div className="w-32 h-10 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" />,
  ssr: false
});

// These are lightweight, load normally
export { default as ChatInput } from './ChatInput';
export { FileUpload } from './FileUpload';
