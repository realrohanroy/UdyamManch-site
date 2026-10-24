'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface BoardItem {
  slug: string;
  type: 'founder' | 'story';
  title: string;
  subtitle: string;
  imageUrl?: string;
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

const STORAGE_KEY = 'um_my_board_v1';

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [pinnedItems, setPinnedItems] = useState<BoardItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load My Board state:', e);
    }
  }, []);

  const saveItems = (items: BoardItem[]) => {
    setPinnedItems(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save My Board state:', e);
    }
  };

  const togglePin = (item: BoardItem) => {
    const exists = pinnedItems.some((i) => i.slug === item.slug);
    let updated: BoardItem[];
    if (exists) {
      updated = pinnedItems.filter((i) => i.slug !== item.slug);
    } else {
      updated = [item, ...pinnedItems];
    }
    saveItems(updated);
  };

  const isPinned = (slug: string) => {
    return pinnedItems.some((i) => i.slug === slug);
  };

  const pinnedSlugs = pinnedItems.map((i) => i.slug);

  return (
    <BoardContext.Provider
      value={{
        pinnedSlugs,
        pinnedItems: mounted ? pinnedItems : [],
        togglePin,
        isPinned,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
