import React, { useState } from 'react';
import axios from 'axios';
import adBreakManager from './adBreakManager';
import AdSlot from './AdSlot';

import { fetchDownloadLinks, triggerDownload, BTN_GRAD } from '../../utils/downloadUtils';
import { ui } from '../../data/i18n.js';

function Spinner({ platform, lang = 'en' }) {
  const t = ui[lang] || ui.en;
  const clr = { fb:'#1877f2', ig:'#bc1888', yt:'#ff0000', pin:'#e60023', x:'#e7e9ea', tiktok:'#00f2ea' };
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-sm" style={{ color:'var(--txt2)' }}>
      <div className="w-10 h-10 rounded-full border-[3px] border-[var(--bdr)] animate-spin"
        style={{ borderTopColor: clr[platform] || '#7c3aed' }} />
      {t['common.fetching'] || 'Fetching media…'}
    </div>
  );
}

export default function DownloaderWidget({
  platform = 'brand',
  apiEndpoint,
  placeholder,
  lang = 'en',
  onUrlValidate,
  onUrlNormalize,
  onFetchSuccess,
  children, // This will be the extraSEO content or FAQ
}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const t = { ...ui.en, ...ui[lang] };
  const activePlaceholder = placeholder || t['common.placeholder'] || 'Paste URL here…';

  const handleSearch = (e) => {
    e?.preventDefault();
    const raw = url.trim();
    if (!raw) { setError(t['common.paste_first'] || 'Please paste a URL first.'); return; }
    if (onUrlValidate && !onUrlValidate(raw)) { setError(t['common.invalid_url'] || "That URL doesn't look right. Please check and try again."); return; }
    const norm = onUrlNormalize ? onUrlNormalize(raw) : raw;
    
    setLoading(true);
    adBreakManager.showInterstitialAd(async () => {
      setError(''); setResult(null);
      try {
        const data = await fetchDownloadLinks(norm, platform);
        setResult(onFetchSuccess ? onFetchSuccess(data) : data);
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


  const inputCls = `flex-1 px-5 py-[14px] rounded-[14px] text-[0.95rem] font-[inherit] outline-none border border-[var(--bdr)]
    text-[var(--txt)] placeholder:text-[var(--txt3)] transition-all
    focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]`;

  return (
    <div className="max-w-[860px] mx-auto px-5 relative">
      {/* Top Ad */}
      <div className="relative z-0">
        <AdSlot slot="1601408852" className="my-6" />
      </div>

      {/* Search bar - Ensure high z-index to avoid ad overlap */}
      <form onSubmit={handleSearch} className="flex gap-2 flex-col sm:flex-row relative z-20">
        <input type="text" value={url} onChange={e => setUrl(e.target.value)}
          placeholder={activePlaceholder} className={inputCls} style={{ background:'var(--bg-glass)' }} />
        <button type="submit" disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-7 py-[13px] rounded-[12px] text-[0.9rem] font-semibold text-white border-none cursor-pointer whitespace-nowrap disabled:opacity-80 transition-all hover:-translate-y-px active:scale-95"
          style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow:'0 4px 20px rgba(124,58,237,0.35)' }}>
          {loading ? `⏳ ${t['common.searching'] || 'Searching…'}` : (t['common.download'] || 'Search Content')}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 px-5 py-[14px] rounded-xl text-[0.88rem] font-medium relative z-20"
          style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444' }}>
          {error}
        </div>
      )}

      {/* Spinner */}
      {loading && <div className="relative z-20"><Spinner platform={platform} lang={lang} /></div>}

      {/* Result */}
      {result && !loading && (
        <div className="flex flex-col sm:flex-row gap-5 p-6 rounded-[20px] mt-7 border border-[var(--bdr)] relative z-20"
          style={{ background:'var(--bg-glass)', animation:'fadeInUp 300ms ease' }}>
          {result.thumbnail && (
            <div className="w-full sm:max-w-[160px] min-h-[130px] rounded-xl overflow-hidden shrink-0"
              style={{ background:'var(--bg-surf)' }}>
              <img src={result.thumbnail} loading='lazy' alt="preview" className="w-full h-full object-cover block" />
            </div>
          )}
          <div className="flex-1">
            {result.title && (
              <p className="text-base font-semibold mb-4 leading-snug" style={{ color:'var(--txt)' }}>{result.title}</p>
            )}
            <div className="flex flex-wrap gap-[10px]">
              {(result.links || []).map((link, i) => (
                <div key={i}>
                  <button onClick={() => handleDownload(link)}
                    className="inline-flex items-center gap-2 px-6 py-[11px] rounded-[10px] text-[0.82rem] font-semibold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:brightness-110"
                    style={{ background: BTN_GRAD[link.btnClass] || BTN_GRAD.brand, boxShadow:'0 4px 20px rgba(0,0,0,0.25)' }}>
                    {link.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mid Ad */}
      <div className="relative z-0">
        <AdSlot slot="6748959606" className="my-8" />
      </div>

      {/* Extra SEO Content / FAQ / Children */}
      <div className="relative z-10">
        {children}
      </div>


      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
