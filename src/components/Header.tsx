'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBoard } from '@/lib/board';

export default function Header() {
  const pathname = usePathname();
  const { pinnedItems, setDrawerOpen } = useBoard();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('um-theme');
    } catch (e) {}

    if (saved) {
      root.dataset.theme = saved;
      setTheme(saved as 'dark' | 'light');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem('um-theme', next);
    } catch (e) {}
  };

  return (
    <header>
      <div className="w bar">
        <Link className="logo" href="/" aria-label="Udyam Manch home" onClick={() => setMobileMenuOpen(false)}>
          <img
            className="lgl"
            src="https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668848/logo-light.webp"
            alt="Udyam Manch"
            style={{ height: '44px', width: 'auto' }}
          />
          <img
            className="lgd"
            src="https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668847/logo-dark.webp"
            alt="Udyam Manch"
            style={{ height: '44px', width: 'auto' }}
          />
        </Link>

        <nav>
          <Link href="/stories" className={pathname.startsWith('/stories') ? 'on' : ''}>
            Stories
          </Link>
          <Link href="/founders" className={pathname.startsWith('/founders') ? 'on' : ''}>
            Founders
          </Link>
          <Link href="/founders?view=index" className="">
            Directory
          </Link>
          <button
            onClick={() => setDrawerOpen(true)}
            id="tmb"
            className="mbl"
            style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer', padding: '6px 0' }}
          >
            My board{' '}
            <span className="mbnb" style={{ display: pinnedItems.length > 0 ? 'inline-block' : 'none' }}>
              {pinnedItems.length}
            </span>
          </button>
        </nav>

        <div className="nav-actions">
          {/* Mobile My Board Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setDrawerOpen(true);
            }}
            className="mbm"
            aria-label={pinnedItems.length > 0 ? `My board, ${pinnedItems.length} pinned` : 'My board'}
            style={{ cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="mbnb" style={{ display: pinnedItems.length > 0 ? 'inline-block' : 'none' }}>
              {pinnedItems.length}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button id="tg" onClick={toggleTheme} aria-label="Switch theme">
            <svg className="sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Desktop Subscribe Button */}
          <a href="#nl" className="btn btn-subscribe-desk" style={{ marginLeft: 0 }}>
            Subscribe
          </a>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            className="nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <nav className="mobile-menu" id="mobile-nav-menu" aria-label="Mobile navigation">
          <Link
            href="/stories"
            className={`mobile-nav-link ${pathname.startsWith('/stories') ? 'on' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Stories</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          <Link
            href="/founders"
            className={`mobile-nav-link ${pathname.startsWith('/founders') ? 'on' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Founders</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          <Link
            href="/founders?view=index"
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Directory</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>

          <button
            className="mobile-nav-link"
            onClick={() => {
              setMobileMenuOpen(false);
              setDrawerOpen(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              font: 'inherit'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>My board</span>
              {pinnedItems.length > 0 && (
                <span className="mbnb">{pinnedItems.length}</span>
              )}
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <div className="mobile-nav-divider" />

          <a
            href="#nl"
            className="btn mobile-nav-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            Subscribe to Newsletter
          </a>
        </nav>
      )}
    </header>
  );
}
