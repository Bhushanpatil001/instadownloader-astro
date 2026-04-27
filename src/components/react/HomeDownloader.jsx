import React, { useState } from 'react';
import axios from 'axios';
import { FacebookLogo, InstagramLogo, YouTubeLogo, PinterestLogo, XLogo, TikTokLogo } from './PlatformIcons';
import adBreakManager from './adBreakManager';
import AdSlot from './AdSlot';

const BACKEND = import.meta.env?.PUBLIC_BACKEND_URL ?? 'https://backend.instadownloader.app/api';

const PLATFORMS = [
  { href:'/facebook',                   name:'Facebook',        color:'#1877f2', bg:'rgba(24,119,242,0.18)',  Logo:FacebookLogo, desc:'Videos & Reels'          },
  { href:'/instagram',                  name:'Instagram',       color:'#dc2743', bg:'rgba(220,39,67,0.18)',   Logo:InstagramLogo, desc:'Posts, Reels & Stories'   },
  { href:'/yt',                         name:'YouTube',         color:'#ff0000', bg:'rgba(255,0,0,0.18)',     Logo:YouTubeLogo, desc:'Videos & MP3 Audio'       },
  { href:'/pinterest',                  name:'Pinterest',       color:'#e60023', bg:'rgba(230,0,35,0.18)',    Logo:PinterestLogo, desc:'Pins, Videos & Images'    },
  { href:'/instagram-reels-downloader', name:'Instagram Reels', color:'#dc2743', bg:'rgba(220,39,67,0.18)',   Logo:InstagramLogo, desc:'Reels without watermark'   },
  { href:'/youtube-shorts-downloader',  name:'YouTube Shorts',  color:'#ff0000', bg:'rgba(255,0,0,0.18)',     Logo:YouTubeLogo, desc:'Shorts as MP4 or MP3'     },
  { href:'/x',                          name:'X (Twitter)',     color:'#8a8a8a', bg:'rgba(100,116,139,0.12)', Logo:XLogo, desc:'Tweets, Videos & Images'  },
  { href:'/tiktok',                     name:'TikTok',          color:'#00f2ea', bg:'rgba(0,242,234,0.18)',   Logo:TikTokLogo, desc:'No Watermark HD Videos'   },
];

const BTN_GRAD = {
  fb:'linear-gradient(135deg,#1877f2,#0d5fce)',
  ig:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
  yt:'linear-gradient(135deg,#ff0000,#cc0000)',
  pin:'linear-gradient(135deg,#e60023,#ad081b)',
  x:'linear-gradient(135deg,#14171a,#292f36)',
  tiktok:'linear-gradient(135deg,#00f2ea,#ff0050)',
  brand:'linear-gradient(135deg,#7c3aed,#ec4899)',
  green:'linear-gradient(135deg,#22c55e,#16a34a)',
  purple:'linear-gradient(135deg,#9333ea,#7c3aed)',
};

function detectPlatform(url) {
  const l = url.toLowerCase();
  if (l.includes('facebook.com') || l.includes('fb.watch')) return 'facebook';
  if (l.includes('instagram.com') || l.includes('instagr.am')) return 'instagram';
  if (l.includes('youtube.com') || l.includes('youtu.be')) return 'youtube';
  if (l.includes('pinterest.com') || l.includes('pin.it')) return 'pinterest';
  if (l.includes('x.com') || l.includes('twitter.com')) return 'x';
  if (l.includes('tiktok.com')) return 'tiktok';
  return null;
}

const ENDPOINT = { facebook:'/facebook/download', instagram:'/instagram/download', youtube:'/youtube/download', pinterest:'/pinterest/download', x:'/x/download', tiktok:'/tiktok/download' };

function mapResult(data, platform, urlToCheck) {
  if (platform === 'facebook') {
    const sd = data.sd||data.url||data?.data?.medias?.[0]?.url||'', hd = data.hd||'';
    const links = [];
    if (sd) links.push({ url:sd, label:'⬇ Download SD', subLabel:'Standard Quality', filename:'fb-video-sd.mp4', btnClass:'fb' });
    if (hd) links.push({ url:hd, label:'⬇ Download HD', subLabel:'High Quality', filename:'fb-video-hd.mp4', btnClass:'purple' });
    return { title: data.title||'Facebook Video', thumbnail: data.thumbnail||'', links };
  }
  if (platform === 'instagram') {
    if (data?.status === false) throw new Error(data.message || 'Private or unavailable.');
    let item = Array.isArray(data) ? data.find(i=>i?.url) : Array.isArray(data.result) ? data.result.find(i=>i?.url) : Array.isArray(data.data) ? data.data.find(i=>i?.url) : data.result||data.data||data;
    if (!item?.url) throw new Error('Private or unavailable Instagram post.');
    const vid = item.type?.toLowerCase()?.includes('video') || item.url?.includes('.mp4') || /\/(reel|reels|tv)\//.test(urlToCheck || '');
    return { title: vid ? '🎬 Video ready to download' : '🖼 Image ready to download', thumbnail: item.thumbnail||item.url, links: [{ url:item.url, label:`⬇ Download ${vid?'Video':'Image'}`, subLabel: vid?'High Quality':'Original Photo', filename:`instagram.${vid?'mp4':'jpg'}`, btnClass:'ig' }] };
  }
  if (platform === 'youtube') {
    const mp4 = data.mp4||data.videoUrl||data.HD||'', mp3 = data.mp3||data.audioUrl||'', t = data.title||'YouTube Content';
    const s = t.replace(/[^a-z0-9]/gi,'_').substring(0,40);
    const links = [];
    if (mp4) links.push({ url:mp4, label:'⬇ Download MP4', subLabel:'HD Video', filename:`${s}.mp4`, btnClass:'yt' });
    if (mp3) links.push({ url:mp3, label:'🎵 Download MP3', subLabel:'Audio Only', filename:`${s}.mp3`, btnClass:'green' });
    return { title:t, thumbnail: data.thumbnail||data.thumb||'', links };
  }
  if (platform === 'tiktok') {
    const links = [];
    if (data.video) links.push({ url:data.video, label:'⬇ Download Video', subLabel:'No Watermark (HD)', filename:`tiktok-${Date.now()}.mp4`, btnClass:'tiktok' });
    if (data.audio) links.push({ url:data.audio, label:'🎵 Download Audio', subLabel:'MP3', filename:`tiktok-audio-${Date.now()}.mp3`, btnClass:'green' });
    return { title: data.title||'TikTok Content', thumbnail: data.thumbnail||'', links };
  }
  if (platform === 'x') {
    if (!data.success||!data.data?.medias?.length) throw new Error('Private or unavailable tweet.');
    const m = data.data.medias[0]; const vid = m.type==='video';
    return { title: data.data.title||'X Content', thumbnail: data.data.thumbnail||m.url, links: [{ url:m.url, label:`⬇ Download ${vid?'MP4':'Image'}`, subLabel: vid?'HD Video':'HD Image', filename:`x-${Date.now()}`, btnClass:'x' }] };
  }
  if (platform === 'pinterest') {
    if (!data.success) throw new Error('Private or unavailable pin.');
    const item = data?.data||data; const url = item.url||item.link||item.downloadUrl||''; const vid = url.includes('.mp4');
    return { title: item.title||'Pinterest Content', thumbnail: item.thumbnail||item.image||'', links: [{ url, label:`⬇ Download ${vid?'MP4':'Image'}`, subLabel: vid?'HD Video':'HD Image', filename:`pin-${Date.now()}`, btnClass:'pin' }] };
  }
  return null;
}

export default function HomeDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e?.preventDefault();
    const raw = url.trim();
    if (!raw) { setError('Please paste a URL first.'); return; }
    const platform = detectPlatform(raw);
    if (!platform) { setError('Unsupported URL. Paste a link from Facebook, Instagram, YouTube, Pinterest, X, or TikTok.'); return; }
    
    setLoading(true);
    adBreakManager.showInterstitialAd(async () => {
      setError(''); setResult(null);
      try {
        const { data } = await axios.post(`${BACKEND}${ENDPOINT[platform]}`, { downloadUrl: raw });
        setResult(mapResult(data, platform, raw));
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.');
      } finally { setLoading(false); }
    });
  };

  const handleDownload = (link) => {
    adBreakManager.showInterstitialAd(async () => {
      // Standard frontend-only download trigger to match original project logic
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

  return (
    <>
      {/* ── Hero ── */}
      <section className="text-center px-5 pt-14 pb-10 relative overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-0"
          style={{ background:'radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 70%)' }} />

        <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full text-[0.78rem] font-semibold uppercase tracking-wider mb-5 relative z-10"
          style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.4)', color:'#a855f7' }}>
          ⬇ Free Social Media Downloader
        </div>

        <h1 className="font-black leading-[1.1] tracking-[-1.5px] mb-4 relative z-10"
          style={{ fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--txt)' }}>
          Download from{' '}
          <span style={{ background:'linear-gradient(135deg,#a78bfa,#ec4899,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Any Platform
          </span>
        </h1>

        <p className="text-[1.05rem] max-w-[560px] mx-auto mb-8 relative z-10" style={{ color:'var(--txt2)' }}>
          Save videos, reels, images & audio from Instagram, YouTube, Facebook, TikTok, Pinterest & X — free & instant.
        </p>

        {/* Search - Ensure high z-index to avoid ad overlap */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-[660px] mx-auto relative z-20 flex-col sm:flex-row">
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="Paste any social media URL here…"
            className="flex-1 px-5 py-[14px] rounded-[14px] text-[0.95rem] font-[inherit] outline-none border border-[var(--bdr)] text-[var(--txt)] placeholder:text-[var(--txt3)] transition-all focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
            style={{ background:'var(--bg-glass)' }} />
          <button type="submit" disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-7 py-[13px] rounded-[12px] text-[0.9rem] font-semibold text-white border-none cursor-pointer whitespace-nowrap disabled:opacity-80 transition-all hover:-translate-y-px"
            style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow:'0 4px 20px rgba(124,58,237,0.35)' }}>
            {loading ? '⏳ Searching…' : '🔍 Search'}
          </button>
        </form>

        <div className="max-w-[800px] mx-auto px-5 relative z-0">
           <AdSlot slot="1601408852" className="mt-8 mb-0" />
        </div>
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
            Detecting platform &amp; fetching media…
          </div>
        )}
        {result && !loading && (
          <div className="flex flex-col sm:flex-row gap-5 p-6 rounded-[20px] mt-4 border border-[var(--bdr)]" style={{ background:'var(--bg-glass)', animation:'fadeInUp 300ms ease' }}>
            {result.thumbnail && (
              <div className="w-full sm:max-w-[160px] min-h-[130px] rounded-xl overflow-hidden shrink-0" style={{ background:'var(--bg-surf)' }}>
                <img src={result.thumbnail} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              {result.title && <p className="text-base font-semibold mb-4 leading-snug" style={{ color:'var(--txt)' }}>{result.title}</p>}
              <div className="flex flex-wrap gap-[10px]">
                {(result.links||[]).map((link, i) => (
                  <div key={i}>
                    <button onClick={() => handleDownload(link)}
                      className="inline-flex items-center gap-2 px-6 py-[11px] rounded-[10px] text-[0.82rem] font-semibold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:brightness-110"
                      style={{ background: BTN_GRAD[link.btnClass]||BTN_GRAD.brand, boxShadow:'0 4px 20px rgba(0,0,0,0.25)' }}>
                      {link.label}
                    </button>
                    {link.subLabel && <span className="block text-center text-[0.72rem] mt-1.5 font-medium" style={{ color:'var(--txt3)' }}>{link.subLabel}</span>}
                  </div>
                ))}
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
        <h2 className="text-[1.5rem] font-bold text-center mb-8" style={{ color:'var(--txt)' }}>Supported Platforms</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))' }}>
          {PLATFORMS.map(({ href, name, color, bg, Logo, desc }) => (
            <a key={href} href={href}
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

        {/* Bottom Ad */}
        <AdSlot slot="9503261240" className="mt-16" />
      </section>

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  );
}
