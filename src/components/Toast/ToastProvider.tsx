"use client";

import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

type ToastVariant = 'success' | 'error';

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}

const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((variant: ToastVariant, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, variant, message }]);
    setTimeout(() => dismiss(id), TOAST_DURATION_MS);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (msg: string) => push('success', msg),
    error: (msg: string) => push('error', msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 font-sans pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white rounded-2xl border border-gray-200 shadow-xl flex items-start gap-3 p-4 min-w-[280px] max-w-md animate-in slide-in-from-right-4 fade-in duration-200"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              t.variant === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {t.variant === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </div>
            <p className="flex-1 text-sm text-gray-900 leading-snug pt-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
