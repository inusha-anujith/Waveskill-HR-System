"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function FilterSelect({ options, value, onChange, placeholder = 'Select...', className = '' }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 pl-4 pr-3 py-3 bg-[#f3f4f6] border-transparent rounded-xl focus:ring-2 focus:ring-gray-200 focus:bg-white text-sm text-gray-700 transition-colors outline-none"
      >
        <span className="truncate min-w-0">
          {selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}
        </span>
        <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-max bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <ul className="max-h-56 overflow-y-auto py-1">
            {options.map(opt => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                    value === opt.value ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <Check size={14} className="text-gray-700 flex-shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
