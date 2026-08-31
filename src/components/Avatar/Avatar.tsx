"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../lib/api';

interface AvatarProps {
  /** Display name — supplies the fallback initial */
  name?: string;
  /** Stored profilePhoto value: a filename, a legacy base64 data URL, or empty */
  photo?: string | null;
  /** Pixel size of the square avatar */
  size?: number;
  /** Extra classes for the wrapper (e.g. ring/border treatments) */
  className?: string;
  /** Rounded style — 'full' for people, 'rounded' for company logos */
  shape?: 'full' | 'rounded';
}

/**
 * Resolves a stored profilePhoto to something an <img> can render.
 *
 * Three cases are handled so the app keeps working through the rollout:
 *  - '' / undefined  -> no image, caller falls back to the initial
 *  - 'data:image/...' -> legacy base64 stored directly in Mongo, use as-is
 *  - 'a3f9....jpg'    -> filename on disk, served from /uploads/avatars
 */
export const resolvePhotoUrl = (photo?: string | null): string | null => {
  if (!photo) return null;
  if (photo.startsWith('data:')) return photo;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${API_BASE}/uploads/avatars/${photo}`;
};

// Single source of truth for people avatars. Replaces the first-letter circles
// that were duplicated across the portals, so a photo now appears everywhere
// an employee is shown rather than only on their own profile page.
export default function Avatar({ name, photo, size = 40, className = '', shape = 'full' }: AvatarProps) {
  const url = resolvePhotoUrl(photo);
  const [failed, setFailed] = useState(false);

  // A new photo (or a switch between users) must clear a previous load error,
  // otherwise the component would stay stuck on the initial.
  useEffect(() => { setFailed(false); }, [url]);

  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  const radius = shape === 'full' ? 'rounded-full' : 'rounded-2xl';

  const style = { width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.4)) };

  // If the file is missing (e.g. uploads/ wiped by a redeploy) fall back to the
  // initial rather than showing a broken-image icon.
  if (!url || failed) {
    return (
      <div
        style={style}
        className={`${radius} bg-blue-700 text-white flex items-center justify-center font-bold uppercase shrink-0 select-none ${className}`}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name ? `${name}'s profile photo` : 'Profile photo'}
      style={style}
      onError={() => setFailed(true)}
      className={`${radius} object-cover bg-gray-100 shrink-0 ${className}`}
    />
  );
}
