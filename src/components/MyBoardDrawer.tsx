'use client';

import React from 'react';
import Link from 'next/link';
import { useBoard } from '@/lib/board';

export default function MyBoardDrawer() {
  const { drawerOpen, setDrawerOpen, pinnedItems, togglePin } = useBoard();

  if (!drawerOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(14, 13, 31, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Slide Drawer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'var(--paper)',
          color: 'var(--ink)',
          borderLeft: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow)',
          zIndex: 101,
          animation: 'slideIn 0.25s cubic-bezier(.3,1.4,.5,1)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontFamily: 'var(--hd)', fontSize: '22px', fontWeight: 800, margin: 0 }}>
              My board
            </h2>
            <span style={{ fontSize: '13.5px', color: 'var(--mute)' }}>
              {pinnedItems.length} {pinnedItems.length === 1 ? 'pinned item' : 'pinned items'}
            </span>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1.5px solid var(--line)',
              background: 'var(--card)',
              color: 'var(--ink)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              fontFamily: 'var(--hd)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Notes List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {pinnedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--mute)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📌</div>
              <p style={{ font: '700 18px var(--hd)', color: 'var(--ink)', margin: '0 0 8px' }}>
                Your board is empty
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.5, margin: 0 }}>
                Pin a story or founder note from the front page to start your personal reading queue.
              </p>
            </div>
          ) : (
            pinnedItems.map((item) => (
              <div
                key={item.slug}
                className="pbcard"
                style={{
                  position: 'relative',
                  padding: '16px 14px',
                  borderRadius: '3px',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pbtag">{item.type === 'founder' ? 'Founder' : 'Story'}</span>
                  <button
                    onClick={() => togglePin(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--mute)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: 'var(--hd)',
                      fontWeight: 600,
                    }}
                  >
                    Unpin
                  </button>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '6px 0' }}>
                  <Link
                    href={item.type === 'founder' ? `/founders/${item.slug}` : `/stories/${item.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    style={{ color: 'inherit' }}
                  >
                    {item.title}
                  </Link>
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--mute)' }}>{item.subtitle}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--line)',
            fontSize: '12.5px',
            color: 'var(--mute)',
            background: 'var(--card)',
          }}
        >
          Saved locally in your browser. No account needed.
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
