"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Avatar from '../Avatar/Avatar';
import { getStoredPhoto } from '../../lib/api';

interface UserMenuProps {
  name: string;
  role?: string;
  profileHref: string;
  onLogout: () => void;
  // [NEW]: Optional prop to receive the base64 profile photo string
  profilePhoto?: string; 
}

export default function UserMenu({ name, role, profileHref, onLogout, profilePhoto }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Read after mount: localStorage is unavailable during server rendering.
  useEffect(() => { setPhoto(getStoredPhoto()); }, []);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const goToProfile = () => {
    setOpen(false);
    router.push(profileHref);
  };

  const signOut = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
        className="flex items-center gap-2 p-1 pr-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
      >
        <Avatar name={name} photo={photo} size={36} />
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
            {role && <p className="text-xs text-gray-500 mt-0.5 capitalize">{role}</p>}
          </div>

          <div className="py-1">
            <button
              role="menuitem"
              onClick={goToProfile}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              {/* [NEW]: Standard inline SVG replacing lucide-react User */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </button>
            <button
              role="menuitem"
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              {/* [NEW]: Standard inline SVG replacing lucide-react LogOut */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}