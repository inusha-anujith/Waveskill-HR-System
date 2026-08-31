"use client";

import { useEffect, useRef, useState } from 'react';

/** Characters required before a search request is issued. */
export const MIN_SEARCH_LENGTH = 3;

const DEBOUNCE_MS = 300;

export interface DebouncedSearch {
  /** Bind to the input's value */
  value: string;
  /** Bind to the input's onChange */
  setValue: (v: string) => void;
  /** The term to send to the API — '' until the minimum length is reached */
  term: string;
  /** True while 1-2 characters are entered, so the UI can explain the minimum */
  belowMinimum: boolean;
  /** True between a keystroke and the debounced term catching up */
  pending: boolean;
}

/**
 * Debounces a search box and enforces a minimum length.
 *
 * Terms shorter than MIN_SEARCH_LENGTH resolve to '' rather than being sent,
 * so the caller shows the full unfiltered list instead of an empty table —
 * a short term should look like "not searching yet", not "no results".
 */
export function useDebouncedSearch(delay: number = DEBOUNCE_MS): DebouncedSearch {
  const [value, setValue] = useState('');
  const [term, setTerm] = useState('');

  const trimmed = value.trim();
  const effective = trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : '';

  useEffect(() => {
    // Going from a real term back to empty (cleared box) should restore the
    // full list immediately rather than after another debounce tick.
    if (effective === '') {
      setTerm('');
      return;
    }
    const id = setTimeout(() => setTerm(effective), delay);
    return () => clearTimeout(id);
  }, [effective, delay]);

  return {
    value,
    setValue,
    term,
    belowMinimum: trimmed.length > 0 && trimmed.length < MIN_SEARCH_LENGTH,
    pending: effective !== term,
  };
}

/**
 * Returns a getter for a fresh AbortSignal that cancels the previous request.
 *
 * Without this, typing quickly can let a slow earlier response land after a
 * newer one and overwrite the correct results — the classic race that appears
 * as soon as search moves from the client to the server.
 */
export function useLatestRequest() {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  };
}

/** True when a caught error is just an aborted (superseded) request. */
export const isAbortError = (e: unknown) =>
  e instanceof DOMException ? e.name === 'AbortError' : (e as any)?.name === 'AbortError';
