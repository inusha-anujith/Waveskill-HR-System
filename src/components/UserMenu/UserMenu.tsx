"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, User } from 'lucide-react';

interface UserMenuProps {
  /** Display name of the signed-in user */
  name: string;
  /** Role label shown under the name, e.g. "Admin" */
  role?: string;
  /** Where the "Profile" item navigates to, e.g. "/Admin/Profile" */
  profileHref: string;
  /** Existing logout handler from the host page (clears auth + redirects) */
  onLogout: () => void;
}

// Replaces the bare "Logout" button that used to sit in every portal header.
// Shared by AdminNavi, ManagerNavi, EmployeeNavi and CustomerNavi so the four
// near-identical headers stay in sync.
export default function UserMenu({ name, role, profileHref, onLogout }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const initial = (name || '?').trim().charAt(0).toUpperCase();

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
        <span className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-semibold">
          {initial}
        </span>
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
              <User size={16} className="text-gray-400" />
              Profile
            </button>
            <button
              role="menuitem"
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut size={16} className="text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
