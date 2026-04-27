import React, { useState } from 'react';
import axios from 'axios';
import adBreakManager from './adBreakManager';
import AdSlot from './AdSlot';

const BACKEND = import.meta.env?.PUBLIC_BACKEND_URL ?? 'https://backend.instadownloader.app/api';

const BTN_GRAD = {
  fb:     'linear-gradient(135deg,#1877f2,#0d5fce)',
  ig:     'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
  yt:     'linear-gradient(135deg,#ff0000,#cc0000)',
  pin:    'linear-gradient(135deg,#e60023,#ad081b)',
  x:      'linear-gradient(135deg,#14171a,#292f36)',
  tiktok: 'linear-gradient(135deg,#00f2ea,#ff0050)',
  brand:  'linear-gradient(135deg,#7c3aed,#ec4899)',
  green:  'linear-gradient(135deg,#22c55e,#16a34a)',
  purple: 'linear-gradient(135deg,#9333ea,#7c3aed)',
};

function Spinner({ platform }) {
  const clr = { fb:'#1877f2', ig:'#bc1888', yt:'#ff0000', pin:'#e60023', x:'#e7e9ea', tiktok:'#00f2ea' };
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-sm" style={{ color:'var(--txt2)' }}>
      <div className="w-10 h-10 rounded-full border-[3px] border-[var(--bdr)] animate-spin"
        style={{ borderTopColor: clr[platform] || '#7c3aed' }} />
      Fetching media…
    </div>
  );
}

export default function DownloaderWidget({
  platform = 'brand',
  apiEndpoint,
  placeholder = 'Paste URL here…',
  onUrlValidate,
  onUrlNormalize,
  onFetchSuccess,
  children, // This will be the extraSEO content or FAQ
}) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const mapAnyResult = (data, plat, urlToCheck) => {
    if (plat === 'fb' || plat === 'facebook') {
      const sd = data.sd || data.url || data?.data?.medias?.[0]?.url || '';
      const hd = data.hd || '';
      const links = [];
      if (sd) links.push({ url: sd, label: '⬇ Download SD', subLabel: 'Standard Quality', filename: 'fb-video-sd.mp4', type: 'mp4', btnClass: 'fb' });
      if (hd) links.push({ url: hd, label: '⬇ Download HD', subLabel: 'High Quality', filename: 'fb-video-hd.mp4', type: 'mp4', btnClass: 'purple' });
      return { title: data.title || 'Facebook Video', thumbnail: data.thumbnail || data?.data?.thumbnail || '', links };
    }
    if (plat === 'ig' || plat === 'instagram') {
      if (data?.status === false) throw new Error(data.message || 'Private or unavailable.');
      let item = Array.isArray(data) ? data.find(i => i?.url) : Array.isArray(data.result) ? data.result.find(i => i?.url) : Array.isArray(data.data) ? data.data.find(i => i?.url) : data.result || data.data || data;
      if (!item?.url) throw new Error('Private or unavailable Instagram post.');
      const isVideo = item.type?.toLowerCase()?.includes('video') || item.url?.toLowerCase()?.includes('.mp4') || /\/(reel|reels|tv)\//.test(urlToCheck || '');
      return {
        title: isVideo ? '🎬 Video ready to download' : '🖼 Image ready to download',
        thumbnail: item.thumbnail || item.url,
        links: [{ url: item.url, label: `⬇ Download ${isVideo ? 'Video' : 'Image'}`, subLabel: isVideo ? 'High Quality' : 'Original Photo', filename: `instagram.${isVideo ? 'mp4' : 'jpg'}`, type: isVideo ? 'mp4' : 'jpg', btnClass: 'ig' }]
      };
    }
    if (plat === 'yt' || plat === 'youtube') {
      const mp4 = data.mp4 || data.videoUrl || data.HD || '';
      const mp3 = data.mp3 || data.audioUrl || '';
      const title = data.title || 'YouTube Content';
      const links = [];
      if (mp4) links.push({ url: mp4, label: '⬇ Download MP4', subLabel: 'HD Video', filename: `${title.substring(0,30)}.mp4`, type: 'mp4', btnClass: 'yt' });
      if (mp3) links.push({ url: mp3, label: '🎵 Download MP3', subLabel: 'Audio Only', filename: `${title.substring(0,30)}.mp3`, type: 'mp3', btnClass: 'green' });
      return { title, thumbnail: data.thumbnail || data.thumb || '', links };
    }
    if (plat === 'tiktok' || plat === 'tt') {
      const links = [];
      if (data.video) links.push({ url: data.video, label: '⬇ Download Video', subLabel: 'No Watermark (HD)', filename: `tiktok-${Date.now()}.mp4`, type: 'mp4', btnClass: 'tiktok' });
      if (data.audio) links.push({ url: data.audio, label: '🎵 Download Audio', subLabel: 'MP3', filename: `tiktok-audio-${Date.now()}.mp3`, type: 'mp3', btnClass: 'green' });
      return { title: data.title || 'TikTok Content', thumbnail: data.thumbnail || '', links };
    }
    if (plat === 'x' || plat === 'twitter') {
      if (!data.success || !data.data?.medias?.length) throw new Error('Private or unavailable tweet.');
      const m = data.data.medias[0]; const isVideo = m.type === 'video';
      return { title: data.data.title || 'X Content', thumbnail: data.data.thumbnail || m.url, links: [{ url: m.url, label: `⬇ Download ${isVideo ? 'MP4' : 'Image'}`, subLabel: isVideo ? 'HD Video' : 'HD Image', filename: `x-${Date.now()}`, type: isVideo ? 'mp4' : 'jpg', btnClass: 'x' }] };
    }
    if (plat === 'pin' || plat === 'pinterest') {
      if (!data.success) throw new Error('Private or unavailable Pinterest pin.');
      const itm = data?.data || data; const url = itm.url || itm.link || itm.downloadUrl || ''; const isVideo = url.toLowerCase().includes('.mp4');
      return { title: itm.title || 'Pinterest Content', thumbnail: itm.thumbnail || itm.image || '', links: [{ url, label: `⬇ Download ${isVideo ? 'MP4' : 'Image'}`, subLabel: isVideo ? 'HD Video' : 'HD Image', filename: `pin-${Date.now()}`, type: isVideo ? 'mp4' : 'jpg', btnClass: 'pin' }] };
    }
    return data;
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    const raw = url.trim();
    if (!raw) { setError('Please paste a URL first.'); return; }
    if (onUrlValidate && !onUrlValidate(raw)) { setError("That URL doesn't look right. Please check and try again."); return; }
    const norm = onUrlNormalize ? onUrlNormalize(raw) : raw;
    
    setLoading(true);
    adBreakManager.showInterstitialAd(async () => {
      setError(''); setResult(null);
      try {
        const { data } = await axios.post(`${BACKEND}${apiEndpoint}`, { downloadUrl: norm });
        setResult(onFetchSuccess ? onFetchSuccess(data) : mapAnyResult(data, platform, norm));
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.');
      } finally { setLoading(false); }
    });
  };

  const handleDownload = (link) => {
    adBreakManager.showInterstitialAd(async () => {
      // Standard frontend-only download trigger to match React project
      const a = document.createElement('a');
      a.href = link.url;
      a.setAttribute('download', link.filename || 'download');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 1000);
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
          placeholder={placeholder} className={inputCls} style={{ background:'var(--bg-glass)' }} />
        <button type="submit" disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-7 py-[13px] rounded-[12px] text-[0.9rem] font-semibold text-white border-none cursor-pointer whitespace-nowrap disabled:opacity-80 transition-all hover:-translate-y-px active:scale-95"
          style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow:'0 4px 20px rgba(124,58,237,0.35)' }}>
          {loading ? '⏳ Searching…' : 'Search Content'}
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
      {loading && <div className="relative z-20"><Spinner platform={platform} /></div>}

      {/* Result */}
      {result && !loading && (
        <div className="flex flex-col sm:flex-row gap-5 p-6 rounded-[20px] mt-7 border border-[var(--bdr)] relative z-20"
          style={{ background:'var(--bg-glass)', animation:'fadeInUp 300ms ease' }}>
          {result.thumbnail && (
            <div className="w-full sm:max-w-[160px] min-h-[130px] rounded-xl overflow-hidden shrink-0"
              style={{ background:'var(--bg-surf)' }}>
              <img src={result.thumbnail} alt="preview" className="w-full h-full object-cover block" />
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
                  {link.subLabel && (
                    <span className="block text-center text-[0.72rem] mt-1.5 font-medium" style={{ color:'var(--txt3)' }}>{link.subLabel}</span>
                  )}
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

      {/* Bottom Ad */}
      <div className="relative z-0">
        <AdSlot slot="9503261240" className="my-8" />
      </div>

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
