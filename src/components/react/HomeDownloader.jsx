import React, { useState } from 'react';
import axios from 'axios';
import { FacebookLogo, InstagramLogo, YouTubeLogo, PinterestLogo, XLogo, TikTokLogo } from './PlatformIcons';
import adBreakManager from './adBreakManager';
import AdSlot from './AdSlot';

import { detectPlatform, fetchDownloadLinks, triggerDownload, BTN_GRAD } from '../../utils/downloadUtils';
import { ui, platforms } from '../../data/i18n.js';

export default function HomeDownloader({ lang = 'en' }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const thumbnail = Array.isArray(result) ? result[0]?.thumbnail : result?.thumbnail;
  const t = { ...ui.en, ...ui[lang] };

  const PLATFORMS_RAW = [
    { slug:'facebook',                   name: t['nav.facebook'] || 'Facebook',        color:'#1877f2', bg:'rgba(24,119,242,0.18)',  Logo:FacebookLogo, desc: t['nav.facebook_desc'] || 'Videos & Reels'          },
    { slug:'instagram',                  name: t['nav.instagram'] || 'Instagram',       color:'#dc2743', bg:'rgba(220,39,67,0.18)',   Logo:InstagramLogo, desc: t['nav.instagram_desc'] || 'Posts, Reels & Stories'   },
    { slug:'yt',                         name: t['nav.youtube'] || 'YouTube',         color:'#ff0000', bg:'rgba(255,0,0,0.18)',     Logo:YouTubeLogo, desc: t['nav.youtube_desc'] || 'Videos & MP3 Audio'       },
    { slug:'pinterest',                  name: t['nav.pinterest'] || 'Pinterest',       color:'#e60023', bg:'rgba(230,0,35,0.18)',    Logo:PinterestLogo, desc: t['nav.pinterest_desc'] || 'Pins, Videos & Images'    },
    { slug:'instagram-reels-downloader', name: t['nav.instagram_reels'] || 'Instagram Reels', color:'#dc2743', bg:'rgba(220,39,67,0.18)',   Logo:InstagramLogo, desc: t['nav.instagram_reels_desc'] || 'Reels without watermark'   },
    { slug:'youtube-shorts-downloader',  name: t['nav.youtube_shorts'] || 'YouTube Shorts',  color:'#ff0000', bg:'rgba(255,0,0,0.18)',     Logo:YouTubeLogo, desc: t['nav.youtube_shorts_desc'] || 'Shorts as MP4 or MP3'     },
    { slug:'x',                          name: t['nav.x'] || 'X (Twitter)',     color:'#8a8a8a', bg:'rgba(100,116,139,0.12)', Logo:XLogo, desc: t['nav.x_desc'] || 'Tweets, Videos & Images'  },
    { slug:'tiktok',                     name: t['nav.tiktok'] || 'TikTok',          color:'#00f2ea', bg:'rgba(0,242,234,0.18)',   Logo:TikTokLogo, desc: t['nav.tiktok_desc'] || 'No Watermark HD Videos'   },
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    const raw = url.trim();
    if (!raw) { setError(t['common.paste_first'] || 'Please paste a URL first.'); return; }
    const platform = detectPlatform(raw);
    if (!platform) { setError(t['common.invalid_url'] || 'Unsupported URL. Paste a link from Facebook, Instagram, YouTube, Pinterest, X, or TikTok.'); return; }
    
    setLoading(true);
    adBreakManager.showInterstitialAd(async () => {
      setError(''); setResult(null);
      try {
        const data = await fetchDownloadLinks(raw);
        setResult(data);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || (t['common.error_occurred'] || 'Something went wrong. Please try again.'));
      } finally { setLoading(false); }
    });
  };

  const handleDownload = (link) => {
    adBreakManager.showInterstitialAd(async () => {
      triggerDownload(link.url, link.filename);
    });
  };

  const getLocalizedHref = (slug) => {
    return lang === 'en' ? `/${slug}` : `/${lang}/${slug}`;
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="text-center px-5 pt-14 pb-10 relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-0"
          style={{ background:'radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 70%)' }} />

        <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full text-[0.78rem] font-semibold uppercase tracking-wider mb-5 relative z-10"
          style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.4)', color:'#a855f7' }}>
          ⬇ {t['home.downloader_hero_tag'] || 'Free Social Media Downloader'}
        </div>

        <h1 className="font-black leading-[1.1] tracking-[-1.5px] mb-4 relative z-10"
          style={{ fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--txt)' }}>
          {t['home.download_from'] || 'Download from '}
          <span style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            {t['home.any_platform'] || 'Any Platform'}
          </span>
        </h1>

        <p className="text-[1.05rem] max-w-[560px] mx-auto mb-8 relative z-10" style={{ color:'var(--txt2)' }}>
          {t['home.desc']}
        </p>

        <div className="max-w-[800px] mx-auto px-5 relative z-0">
           <AdSlot slot="1601408852" className="mt-8 mb-0" />
        </div>
        {/* Search - Ensure high z-index to avoid ad overlap */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-[660px] mx-auto relative z-20 flex-col sm:flex-row">
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder={t['common.placeholder']}
            className="flex-1 px-5 py-[14px] rounded-[14px] text-[0.95rem] font-[inherit] outline-none border border-[var(--bdr)] text-[var(--txt)] placeholder:text-[var(--txt3)] transition-all focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
            style={{ background:'var(--bg-glass)' }} />
          <button type="submit" disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-7 py-[13px] rounded-[12px] text-[0.9rem] font-semibold text-white border-none cursor-pointer whitespace-nowrap disabled:opacity-80 transition-all hover:-translate-y-px"
            style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow:'0 4px 20px rgba(124,58,237,0.35)' }}>
            {loading ? (t['common.searching'] || '⏳ Searching…') : `🔍 ${t['common.download'] || 'Search'}`}
          </button>
        </form>

      </section>

      {/* Feedback */}
      <div className="max-w-[700px] mx-auto px-5 -mt-2 relative z-20">
        {error && (
          <div className="px-5 py-[14px] rounded-xl text-[0.88rem] font-medium" style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444' }}>
            {error}
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8 text-sm" style={{ color:'var(--txt2)' }}>
            <div className="w-10 h-10 rounded-full border-[3px] border-[var(--bdr)] border-t-[#7c3aed] animate-spin" />
            {t['common.fetching'] || 'Detecting platform & fetching media…'}
          </div>
        )}
        {result && !loading && (
          <div className="flex flex-col sm:flex-row gap-5 p-6 rounded-[20px] mt-4 border border-[var(--bdr)]" style={{ background:'var(--bg-glass)', animation:'fadeInUp 300ms ease' }}>
            {thumbnail && (
              <div className="w-full sm:max-w-[160px] min-h-[130px] rounded-xl overflow-hidden shrink-0" style={{ background:'var(--bg-surf)' }}>
                <img src={thumbnail} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              {result.title && <p className="text-base font-semibold mb-4 leading-snug" style={{ color:'var(--txt)' }}>{result.title}</p>}
              <div className="flex flex-wrap gap-[10px] items-center">
                {(result.links||[]).map((link, i) => (
                  <div key={i}>
                    <button onClick={() => handleDownload(link)}
                      className="inline-flex items-center gap-2 px-6 py-[11px] rounded-[10px] text-[0.82rem] font-semibold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:brightness-110"
                      style={{ background: BTN_GRAD[link.btnClass]||BTN_GRAD.brand, boxShadow:'0 4px 20px rgba(0,0,0,0.25)' }}>
                      {link.label}
                    </button>
                  </div>
                ))}

                {/* Share Button */}
                <button 
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    const originalText = btn.innerHTML;
                    try {
                      btn.innerHTML = '⌛...';
                      const { data: shareRes } = await axios.post('/api/shares', {
                        targetUrl: url,
                        title: result.title,
                        description: `Download this ${detectPlatform(url)} content instantly!`,
                        image: result.thumbnail,
                        platform: detectPlatform(url)
                      });
                      
                      if (shareRes?.id) {
                        const shareUrl = `${window.location.origin}/share/${shareRes.id}`;
                        await navigator.clipboard.writeText(shareUrl);
                        btn.innerHTML = t['trending.copy_success'] || '✅ Copied!';
                        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
                      }
                    } catch (err) {
                      console.error('Sharing failed:', err);
                      alert(t['trending.copy_fail'] || 'Failed to copy share link.');
                      btn.innerHTML = originalText;
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-[11px] rounded-[10px] text-[0.82rem] font-semibold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:brightness-110"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--txt)' }}
                >
                  🔗 {t['trending.share'] || 'Share'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Mid Ad */}
        <div className="relative z-0">
          <AdSlot slot="6748959606" className="mt-8" />
        </div>
      </div>

      {/* ── Platform grid ── */}
      <section className="mt-14 px-5 pb-16 max-w-[1100px] mx-auto">
        <h2 className="text-[1.5rem] font-bold text-center mb-8" style={{ color:'var(--txt)' }}>
          {t['home.supported_platforms'] || 'Supported Platforms'}
        </h2>
        <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))' }}>
          {PLATFORMS_RAW.map(({ slug, name, color, bg, Logo, desc }) => (
            <a key={slug} href={getLocalizedHref(slug)}
              className="px-5 pt-7 pb-[22px] rounded-[18px] relative overflow-hidden border border-[var(--bdr)] group transition-all block text-center no-underline hover:-translate-y-1 hover:border-[var(--bdr-h)]"
              style={{ background:'var(--bg-glass)' }}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[18px]"
                style={{ background:`radial-gradient(ellipse at 50% 0%,${bg.replace('0.18','0.12')} 0%,transparent 70%)` }} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-[14px] relative z-10" style={{ background:bg }}>
                <Logo size={32} />
              </div>
              <p className="text-[0.95rem] font-bold mb-2 relative z-10" style={{ color }}>{name}</p>
              <p className="text-[0.78rem] leading-[1.5] relative z-10" style={{ color:'var(--txt3)' }}>{desc}</p>
            </a>
          ))}
        </div>
      </section>

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  );
}
