import React, { useState, useEffect } from 'react';
import adBreakManager from './adBreakManager.js';

// SVG icons inline (no package dep)
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);
const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const YtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.2.3 4.3.3 4.3s.3 2 1.2 2.8c1.1 1.2-2.6 1.1 3.3 1.2C7.5 21.8 12 21.8 12 21.8s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.3v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l6.6 3.6-6.6 3.5z"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49H13.9V24C19.61 23.1 24 18.1 24 12.07z"/>
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.44 7.63 11.22-.1-.95-.2-2.4.04-3.44.22-.93 1.48-6.27 1.48-6.27s-.38-.76-.38-1.88c0-1.76 1.02-3.07 2.28-3.07 1.08 0 1.6.81 1.6 1.78 0 1.08-.69 2.7-1.05 4.2-.3 1.25.63 2.27 1.86 2.27 2.23 0 3.95-2.35 3.95-5.74 0-3-2.16-5.09-5.24-5.09-3.57 0-5.67 2.67-5.67 5.44 0 1.08.41 2.23.93 2.86.1.13.12.24.08.37-.09.38-.3 1.25-.34 1.42-.05.22-.18.27-.41.16-1.55-.72-2.52-3-2.52-4.82 0-3.92 2.85-7.52 8.22-7.52 4.31 0 7.66 3.07 7.66 7.17 0 4.28-2.7 7.72-6.44 7.72-1.26 0-2.44-.65-2.84-1.42l-.77 2.89c-.28 1.07-1.03 2.42-1.54 3.24.46.14.95.22 1.45.22 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.988l4.26 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const TtIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.81a8.18 8.18 0 004.77 1.52V6.88a4.85 4.85 0 01-1-.19z"/>
  </svg>
);

const NAV = [
  { href: '/',          label: 'Home',      icon: <HomeIcon /> },
  { href: '/instagram', label: 'Instagram', icon: <IgIcon /> },
  { href: '/yt',        label: 'YouTube',   icon: <YtIcon /> },
  { href: '/tiktok',    label: 'TikTok',    icon: <TtIcon /> },
  { href: '/facebook',  label: 'Facebook',  icon: <FbIcon /> },
  { href: '/x',         label: 'X',         icon: <XIcon /> },
  { href: '/pinterest', label: 'Pinterest', icon: <PinIcon /> },
];

const SERVE_ADS = typeof window !== 'undefined' && window.__SERVE_ADS__;

function navigate(to) {
  if (!SERVE_ADS) { window.location.href = to; return; }
  adBreakManager.showInterstitialAd(() => { window.location.href = to; });
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const t = localStorage.getItem('id-theme') || 'dark';
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('id-theme', next);
  };

  return (
    <header className="sticky top-0 z-[1000] border-b border-[var(--bdr)]"
      style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      data-theme-el="header">
      {/* Inner */}
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="text-[1.4rem] font-black tracking-tight whitespace-nowrap shrink-0"
          style={{ background: 'var(--g-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          ⬇ Downloader
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV.map(({ href, label, icon }) => (
            <button key={href} onClick={() => navigate(href)}
              className="flex items-center gap-[7px] px-[14px] py-[7px] rounded-[10px] text-sm font-medium text-[var(--txt2)] border border-transparent cursor-pointer bg-transparent
                hover:text-[var(--txt)] hover:bg-[var(--bg-glass-h)] hover:border-[var(--bdr-h)] transition-all">
              {icon}{label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme"
            className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] border border-[var(--bdr)] bg-[var(--bg-glass)] text-[var(--txt2)] relative overflow-hidden cursor-pointer
              hover:bg-[var(--bg-glass-h)] hover:border-[var(--bdr-h)] hover:text-[var(--txt)] transition-all">
            <span className="icon-sun absolute text-base">☀️</span>
            <span className="icon-moon absolute text-base">🌙</span>
          </button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu"
            className="flex md:hidden flex-col gap-[5px] cursor-pointer p-2 rounded-lg border border-[var(--bdr)] bg-[var(--bg-glass)] hover:bg-[var(--bg-glass-h)] transition-all">
            <span style={{ display: 'block', width: 20, height: 2, background: 'var(--txt)', borderRadius: 2,
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none', transition: 'all var(--dur)' }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'var(--txt)', borderRadius: 2,
              opacity: menuOpen ? 0 : 1, transition: 'all var(--dur)' }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'var(--txt)', borderRadius: 2,
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: 'all var(--dur)' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-4 pt-3 border-t border-[var(--bdr)]"
          style={{ background: 'rgba(15,15,26,0.97)', animation: 'slideDown 200ms var(--ease)' }}>
          {NAV.map(({ href, label, icon }) => (
            <button key={href} onClick={() => { setMenuOpen(false); navigate(href); }}
              className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px] text-[0.9rem] font-medium text-[var(--txt2)] w-full text-left bg-transparent cursor-pointer
                hover:text-[var(--txt)] hover:bg-[var(--bg-glass-h)] transition-all">
              {icon}{label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        [data-theme="light"] header[data-theme-el="header"] { background: rgba(240,242,248,0.88) !important; }
        [data-theme="light"] div[style*="rgba(15,15,26,0.97)"] { background: rgba(240,242,248,0.97) !important; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </header>
  );
}
