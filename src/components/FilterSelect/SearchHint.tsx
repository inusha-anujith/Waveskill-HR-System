"use client";

import React from 'react';
import { MIN_SEARCH_LENGTH } from '../../hooks/useDebouncedSearch';

interface SearchHintProps {
  belowMinimum: boolean;
  pending: boolean;
}

// Without this, entering one or two characters looks like a filter that
// silently does nothing. Spelling out the minimum keeps the behaviour legible.
export default function SearchHint({ belowMinimum, pending }: SearchHintProps) {
  if (!belowMinimum && !pending) return null;

  return (
    <p className="text-xs text-gray-400 mt-1.5 ml-1">
      {belowMinimum
        ? `Type at least ${MIN_SEARCH_LENGTH} characters to search`
        : 'Searching...'}
    </p>
  );
}
