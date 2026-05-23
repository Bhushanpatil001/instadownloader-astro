import React, { useState, useEffect } from 'react';
import adBreakManager from './adBreakManager.js';
import { ui } from '../../data/i18n.js';

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
const BlogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const SERVE_ADS = typeof window !== 'undefined' && window.__SERVE_ADS__;

function navigate(to) {
  if (!SERVE_ADS) { window.location.href = to; return; }
  adBreakManager.showInterstitialAd(() => { window.location.href = to; });
}

export default function Header({ lang = 'en', slug = '' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  const t = { ...ui.en, ...ui[lang] };
  
  const LANGS = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'zh', name: '简体中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  ];

  const NAV = [
    { slug: '',          label: t['nav.home'] || 'Home',      icon: <HomeIcon /> },
    { slug: 'instagram', label: t['nav.instagram'] || 'Instagram', icon: <IgIcon /> },
    { slug: 'yt',        label: t['nav.youtube'] || 'YouTube',   icon: <YtIcon /> },
    { slug: 'tiktok',    label: t['nav.tiktok'] || 'TikTok',    icon: <TtIcon /> },
    { slug: 'facebook',  label: t['nav.facebook'] || 'Facebook',  icon: <FbIcon /> },
    { slug: 'x',         label: t['nav.x'] || 'X',         icon: <XIcon /> },
    { slug: 'pinterest', label: t['nav.pinterest'] || 'Pinterest', icon: <PinIcon /> },
    { slug: 'blog',      label: t['nav.blog'] || 'Blog',      icon: <BlogIcon /> },
  ];

  const [preferredLang, setPreferredLang] = useState(lang);

  useEffect(() => {
    const tTheme = localStorage.getItem('id-theme') || 'dark';
    setTheme(tTheme);
    document.documentElement.setAttribute('data-theme', tTheme);

    // Persist language preference
    if (lang !== 'en') {
      localStorage.setItem('id-lang', lang);
      setPreferredLang(lang);
    } else {
      const saved = localStorage.getItem('id-lang');
      if (saved && saved !== 'en') {
        setPreferredLang(saved);
      }
    }

    const handleClickOutside = (e) => {
      if (!e.target.closest('.lang-selector-container')) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [lang]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('id-theme', next);
  };
  const getLocalizedHref = (s, l = preferredLang) => {
    if (s === 'blog') return '/blog';
    if (!s) return l === 'en' ? '/' : `/${l}`;
    return l === 'en' ? `/${s}` : `/${l}/${s}`;
  };

  const isItemActive = (navSlug) => {
    if (navSlug === '') {
      return slug === '';
    }
    if (navSlug === 'blog') {
      return slug.startsWith('blog');
    }
    const segments = slug.split(/[-/]/);
    return segments.includes(navSlug) || slug === navSlug;
  };

  const getActiveStyle = (navSlug) => {
    const active = isItemActive(navSlug);
    if (!active) return { color: 'var(--txt2)' };
    
    if (navSlug === 'instagram') {
      return {
        background: 'rgba(220, 39, 67, 0.09)',
        borderColor: 'rgba(220, 39, 67, 0.35)',
        color: '#dc2743',
      };
    }
    if (navSlug === 'yt') {
      return {
        background: 'rgba(255, 0, 0, 0.09)',
        borderColor: 'rgba(255, 0, 0, 0.35)',
        color: '#ff0000',
      };
    }
    if (navSlug === 'facebook') {
      return {
        background: 'rgba(24, 119, 242, 0.09)',
        borderColor: 'rgba(24, 119, 242, 0.35)',
        color: '#1877f2',
      };
    }
    if (navSlug === 'pinterest') {
      return {
        background: 'rgba(230, 0, 35, 0.09)',
        borderColor: 'rgba(230, 0, 35, 0.35)',
        color: '#e60023',
      };
    }
    if (navSlug === 'tiktok') {
      return {
        background: 'rgba(0, 242, 234, 0.07)',
        borderColor: 'rgba(0, 242, 234, 0.3)',
        color: 'var(--brand)',
      };
    }
    if (navSlug === 'x') {
      return {
        background: 'rgba(100, 116, 139, 0.09)',
        borderColor: 'rgba(100, 116, 139, 0.35)',
        color: 'var(--txt)',
      };
    }
    if (navSlug === 'blog') {
      return {
        background: 'rgba(124, 58, 237, 0.09)',
        borderColor: 'rgba(124, 58, 237, 0.35)',
        color: 'var(--brand)',
      };
    }
    return {
      background: 'rgba(124, 58, 237, 0.09)',
      borderColor: 'rgba(124, 58, 237, 0.35)',
      color: 'var(--brand)',
    };
  };

  return (
    <header className="sticky top-0 z-[1000] border-b border-[var(--bdr)]"
      style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      data-theme-el="header">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a href={getLocalizedHref('')} className="text-[1.4rem] font-black tracking-tight whitespace-nowrap shrink-0"
          style={{ background: 'var(--g-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          ⬇ {t['common.downloader'] || 'Downloader'}
        </a>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV.map(({ slug: navSlug, label, icon }) => {
            const active = isItemActive(navSlug);
            return (
              <button key={navSlug} onClick={() => navigate(getLocalizedHref(navSlug))}
                className={`nav-link flex items-center gap-2 px-4 py-2 rounded-xl text-[0.85rem] font-semibold border transition-all ${active ? 'active' : 'border-transparent'}`}
                style={getActiveStyle(navSlug)}>
                {icon}
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-[var(--bg-glass-h)] text-[var(--txt2)] transition-all">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* Lang Selector */}
          <div className="relative lang-selector-container">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border border-[var(--bdr)] ${langOpen ? 'bg-[var(--bg-glass-h)] text-[var(--txt)]' : 'hover:bg-[var(--bg-glass-h)] text-[var(--txt2)]'}`}>
              <span className="text-sm font-bold uppercase">{lang}</span>
              <span className={`text-[10px] opacity-40 transition-transform ${langOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 border border-white/10 rounded-xl shadow-2xl z-[10000] backdrop-blur-3xl overflow-hidden animate-slideDown"
                style={{ 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
                  background: theme === 'dark' ? '#1a1a2e' : '#ffffff' 
                }}>
                <div className="p-2 grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto">
                  {LANGS.map(l => (
                    <a key={l.code} href={getLocalizedHref(slug, l.code)} 
                      onClick={() => localStorage.setItem('id-lang', l.code)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${lang === l.code ? 'bg-[var(--brand)] text-white' : 'text-[var(--txt2)] hover:bg-[var(--bg-glass-h)] hover:text-[var(--txt)]'}`}>
                      <span className="text-base">{l.flag}</span> 
                      <span>{l.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 rounded-xl hover:bg-[var(--bg-glass-h)] text-[var(--txt2)]">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--bdr)] bg-[var(--bg-glass)] backdrop-blur-xl animate-slideDown">
          <div className="p-4 flex flex-col gap-2">
            {NAV.map(({ slug: navSlug, label, icon }) => {
              const active = isItemActive(navSlug);
              return (
                <button key={navSlug} onClick={() => { navigate(getLocalizedHref(navSlug)); setMenuOpen(false); }}
                  className={`nav-link flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[0.95rem] font-bold transition-all border ${active ? 'active' : 'border-transparent'}`}
                  style={getActiveStyle(navSlug)}>
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        [data-theme="light"] header[data-theme-el="header"] { background: rgba(240,242,248,0.88) !important; }
        [data-theme="light"] div[style*="rgba(15,15,26,0.97)"] { background: rgba(240,242,248,0.97) !important; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .nav-link {
          transition: all var(--dur) var(--ease);
        }
        .nav-link:hover {
          color: var(--txt) !important;
          border-color: var(--bdr-h) !important;
          background: var(--bg-glass-h) !important;
        }
        .nav-link.active {
          font-weight: 700;
        }
      `}</style>
    </header>
  );
}
