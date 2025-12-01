'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser
            ? 'bg-lana-500 text-white'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-lana-500 text-white rounded-tr-sm'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                components={{
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="relative group/code">
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-2">
                          <code {...props}>{children}</code>
                        </pre>
                        <button
                          onClick={copyToClipboard}
                          className="absolute top-2 right-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 opacity-0 group-hover/code:opacity-100 transition-opacity"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} className="text-slate-300" />
                          )}
                        </button>
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Meta info */}
        {!isUser && message.model && (
          <p className="text-xs text-slate-400 mt-1 px-1">
            {message.model}
          </p>
        )}
      </div>

      {/* Copy button for assistant messages */}
      {!isUser && (
        <button
          onClick={copyToClipboard}
          className="self-start p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Копировать"
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} className="text-slate-400" />
          )}
        </button>
      )}
    </div>
  );
}

export default memo(ChatMessage);
