"use client";

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  busy = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmClasses = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-[#1a1a1a] hover:bg-black text-white';

  const iconWrapClasses = variant === 'danger'
    ? 'bg-red-50 text-red-600'
    : 'bg-gray-100 text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-50 rounded-full"
        >
          <X size={18} />
        </button>

        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 ${iconWrapClasses}`}>
          <AlertTriangle size={22} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="text-sm text-gray-500 mb-8 leading-relaxed">
          {message}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 py-3 font-semibold rounded-xl transition-colors disabled:opacity-60 ${confirmClasses}`}
          >
            {busy ? 'Working...' : confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
