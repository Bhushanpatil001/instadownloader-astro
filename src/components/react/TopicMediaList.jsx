import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdSlot from './AdSlot';

const BACKEND = import.meta.env?.PUBLIC_BACKEND_URL ?? 'https://backend.instadownloader.app/api';

const TopicMediaCard = ({ url, platform, apiEndpoint, fallbackTitle }) => {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const { data } = await axios.post(`${BACKEND}${apiEndpoint}`, { downloadUrl: url }, { timeout: 30000 });
        if (!isMounted) return;

        let mapped = {
          title: data.title || fallbackTitle || 'Viral Video',
          thumbnail: data.thumbnail || data.thumb || '',
          downloadUrl: ''
        };

        if (platform === 'instagram') {
          const item = Array.isArray(data) ? data.find(i => i?.url) : (data.result?.[0] || data.result || data.data?.[0] || data.data || data);
          mapped.thumbnail = item?.thumbnail || item?.url || '';
          mapped.downloadUrl = item?.url || '';
        } else if (platform === 'youtube') {
          mapped.downloadUrl = data.mp4 || data.videoUrl || data.HD || '';
        } else if (platform === 'facebook') {
          mapped.downloadUrl = data.hd || data.sd || data.url || '';
        } else if (platform === 'tiktok') {
          mapped.downloadUrl = data.video || '';
        } else if (platform === 'x' || platform === 'twitter') {
          mapped.downloadUrl = data.data?.medias?.[0]?.url || '';
          mapped.thumbnail = data.data?.thumbnail || mapped.thumbnail;
        } else if (platform === 'pinterest') {
          mapped.downloadUrl = data.data?.url || data.url || '';
        }

        if (mapped.downloadUrl) setMedia(mapped);
        else setError(true);
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [url, platform, apiEndpoint]);

  if (loading) return (
    <div className="rounded-2xl border border-[var(--bdr)] animate-pulse h-[320px]" style={{ background: 'var(--bg-glass)' }}>
      <div className="w-full aspect-video bg-[var(--bg-surf)]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[var(--bg-surf)] rounded w-3/4" />
        <div className="h-10 bg-[var(--bg-surf)] rounded w-full" />
      </div>
    </div>
  );

  if (error || !media) return null;

  return (
    <div className="group rounded-2xl border border-[var(--bdr)] overflow-hidden transition-all hover:border-[var(--bdr-h)] hover:-translate-y-1"
      style={{ background: 'var(--bg-glass)', animation: 'fadeInUp 400ms ease' }}>
      <div className="w-full aspect-video overflow-hidden relative cursor-pointer bg-black" onClick={() => window.open(media.downloadUrl, '_blank')}>
        <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e1e2d/white?text=Preview+Ready'; }} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xl">▶</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <h3 className="text-[0.88rem] font-semibold leading-snug line-clamp-2 h-10" style={{ color: 'var(--txt)' }}>
          {media.title}
        </h3>
        <button onClick={() => window.open(media.downloadUrl, '_blank')}
          className="w-full py-[10px] rounded-xl text-[0.82rem] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}>
          ⬇ Download Original
        </button>
      </div>
    </div>
  );
};

export default function TopicMediaList({ platform, apiEndpoint, topicData }) {
  if (!topicData || topicData.length === 0) return null;

  const firstPart = topicData.slice(0, 3);
  const secondPart = topicData.slice(3);

  return (
    <div className="mt-8">
      {/* Top Ad */}
      <AdSlot slot="1601408852" className="mb-10" />

      <div className="text-center mb-10">
        <h2 className="text-[1.8rem] font-black mb-2" style={{ color: 'var(--txt)' }}>Latest & Viral Content</h2>
        <p className="text-[0.9rem]" style={{ color: 'var(--txt3)' }}>Browse and download popular content related to this topic.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {firstPart.map((item, idx) => (
          <TopicMediaCard key={idx} url={item.url} platform={platform} apiEndpoint={apiEndpoint} fallbackTitle={item.title} />
        ))}
      </div>

      {secondPart.length > 0 && (
        <>
          {/* Mid Ad */}
          <AdSlot slot="6748959606" className="my-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondPart.map((item, idx) => (
              <TopicMediaCard key={idx + 3} url={item.url} platform={platform} apiEndpoint={apiEndpoint} fallbackTitle={item.title} />
            ))}
          </div>
        </>
      )}

      {/* Bottom Ad */}
      <AdSlot slot="9503261240" className="mt-16" />

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
