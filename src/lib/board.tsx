'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface BoardItem {
  slug: string;
  type: 'founder' | 'story';
  title: string;
  subtitle: string;
  imageUrl?: string;
}

/** What is published right now, slug to title. Built on the server (see app/layout.tsx). */
export interface LiveContent {
  founder: Record<string, string>;
  story: Record<string, string>;
}

interface BoardContextType {
  pinnedSlugs: string[];
  pinnedItems: BoardItem[];
  togglePin: (item: BoardItem) => void;
  isPinned: (slug: string) => boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

/** Changing this key needs a migration, or visitors lose their pins. See docs/TEST_REPORT.md. */
const STORAGE_KEY = 'um_my_board_v1';
const MAX_PINS = 200;

/**
 * Pins made before founder stories moved to /founders. The old story slug
 * becomes a founder pin instead of being dropped as "unpublished".
 */
const LEGACY_PINS: Record<string, { type: 'founder'; slug: string }> = {
  'the-field-is-the-real-business-school': { type: 'founder', slug: 'kishan-panchal-farming-solutions-india' },
};

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/**
 * Turn whatever is in storage into a clean list. Storage is outside our control
 * (old versions, extensions, half written saves), so nothing in it is trusted:
 * one bad entry must never crash the page for that visitor.
 */
export function cleanPins(raw: unknown): BoardItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: BoardItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;
    let slug = str(e.slug).trim();
    let type: BoardItem['type'] | undefined = e.type === 'founder' || e.type === 'story' ? e.type : undefined;
    const legacy = LEGACY_PINS[slug];
    if (legacy) ({ slug, type } = legacy);
    if (!slug || !type || seen.has(slug)) continue;
    seen.add(slug);
    out.push({
      slug,
      type,
      title: str(e.title).slice(0, 200) || slug,
      subtitle: str(e.subtitle).slice(0, 120),
      imageUrl: /^(https?:)?\/\//.test(str(e.imageUrl)) || str(e.imageUrl).startsWith('/') ? str(e.imageUrl) : undefined,
    });
    if (out.length >= MAX_PINS) break;
  }
  return out;
}

/**
 * Keep only pins that are still published, and refresh their titles, so a
 * rename never leaves a stale pin and an unpublished item leaves quietly.
 * [REQ-PUB-17] [REQ-PUB-18]
 *
 * If the live list is empty (the CMS failed while building the page), keep
 * everything: better a stale pin than wiping a visitor's whole board.
 */
export function reconcilePins(items: BoardItem[], live?: LiveContent): BoardItem[] {
  if (!live) return items;
  const known = Object.keys(live.founder).length + Object.keys(live.story).length;
  if (known === 0) return items;
  return items.flatMap((i) => {
    const title = live[i.type][i.slug];
    return title === undefined ? [] : [{ ...i, title }];
  });
}

function readStorage(): BoardItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? cleanPins(JSON.parse(stored)) : [];
  } catch {
    return []; // blocked storage or broken JSON: start with an empty board
  }
}

function writeStorage(items: BoardItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Full or blocked. The board still works for this visit.
  }
}

export function BoardProvider({ children, live }: { children: React.ReactNode; live?: LiveContent }) {
  const [pinnedItems, setPinnedItems] = useState<BoardItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const items = reconcilePins(readStorage(), live);
    setPinnedItems(items);
    writeStorage(items); // saves the cleaned list, so a bad entry is gone for good
    setMounted(true);
  }, [live]);

  const togglePin = (item: BoardItem) => {
    const exists = pinnedItems.some((i) => i.slug === item.slug);
    const updated = exists ? pinnedItems.filter((i) => i.slug !== item.slug) : [item, ...pinnedItems].slice(0, MAX_PINS);
    setPinnedItems(updated);
    writeStorage(updated);
  };

  const isPinned = (slug: string) => pinnedItems.some((i) => i.slug === slug);

  const value = useMemo(
    () => ({
      pinnedSlugs: pinnedItems.map((i) => i.slug),
      pinnedItems: mounted ? pinnedItems : [],
      togglePin,
      isPinned,
      drawerOpen,
      setDrawerOpen,
    }),
    // togglePin and isPinned only depend on pinnedItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pinnedItems, mounted, drawerOpen],
  );

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
