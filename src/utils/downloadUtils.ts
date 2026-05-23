import axios from 'axios';

const BACKEND = import.meta.env?.PUBLIC_BACKEND_URL ?? 'https://backend.instadownloader.app/api';

export const ENDPOINTS = {
  facebook: '/facebook/download',
  instagram: '/instagram/download',
  youtube: '/youtube/download',
  pinterest: '/pinterest/download',
  x: '/x/download',
  tiktok: '/tiktok/download'
};

export const BTN_GRAD = {
  fb: 'linear-gradient(135deg,#1877f2,#0d5fce)',
  ig: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
  yt: 'linear-gradient(135deg,#ff0000,#cc0000)',
  pin: 'linear-gradient(135deg,#e60023,#ad081b)',
  x: 'linear-gradient(135deg,#14171a,#292f36)',
  tiktok: 'linear-gradient(135deg,#00f2ea,#ff0050)',
  brand: 'linear-gradient(135deg,#7c3aed,#ec4899)',
  green: 'linear-gradient(135deg,#22c55e,#16a34a)',
  purple: 'linear-gradient(135deg,#9333ea,#7c3aed)',
};

export function detectPlatform(url: string) {
  const l = url.toLowerCase();
  if (l.includes('facebook.com') || l.includes('fb.watch')) return 'facebook';
  if (l.includes('instagram.com') || l.includes('instagr.am')) return 'instagram';
  if (l.includes('youtube.com') || l.includes('youtu.be')) return 'youtube';
  if (l.includes('pinterest.com') || l.includes('pin.it')) return 'pinterest';
  if (l.includes('x.com') || l.includes('twitter.com')) return 'twitter';
  if (l.includes('tiktok.com')) return 'tiktok';
  return null;
}

export function getProxiedImageUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('/') || url.startsWith('data:') || url.includes('placehold.co')) return url;
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

export function mapResult(data: any, platform: string, urlToCheck: string) {
  const plat = platform.toLowerCase();
  if (plat === 'facebook' || plat === 'fb') {
    const sd = data.sd || data.url || data?.data?.medias?.[0]?.url || '';
    const hd = data.hd || '';
    const links = [];
    if (sd) links.push({ url: sd, label: '⬇ Download SD', subLabel: 'Standard Quality', filename: 'fb-video-sd.mp4', btnClass: 'fb' });
    if (hd) links.push({ url: hd, label: '⬇ Download HD', subLabel: 'High Quality', filename: 'fb-video-hd.mp4', btnClass: 'purple' });
    return { title: data.title || 'Facebook Video', thumbnail: getProxiedImageUrl(data.thumbnail || data?.data?.thumbnail || ''), links };
  }
  if (plat === 'instagram' || plat === 'ig') {
    if (data?.status === false) throw new Error(data.message || 'Private or unavailable.');
    let item = Array.isArray(data) ? data.find((i: any) => i?.url) : Array.isArray(data.result) ? data.result.find((i: any) => i?.url) : Array.isArray(data.data) ? data.data.find((i: any) => i?.url) : data.result || data.data || data;
    if (!item?.url) throw new Error('Private or unavailable Instagram post.');
    const vid = item.type?.toLowerCase()?.includes('video') || item.url?.includes('.mp4') || /\/(reel|reels|tv)\//.test(urlToCheck || '');
    return {
      title: vid ? '🎬 Video Ready To Download' : ' Content Ready To Download',
      thumbnail: getProxiedImageUrl(item.thumbnail || item.url),
      links: [{ url: item.url, label: '⬇ Download', subLabel: vid ? 'Download Video' : 'Download Content', filename: `instagram.${vid ? 'mp4' : 'jpg'}`, btnClass: 'ig' }]
    };
  }
  if (plat === 'youtube' || plat === 'yt') {
    const mp4 = data.mp4 || data.videoUrl || data.HD || '';
    const mp3 = data.mp3 || data.audioUrl || '';
    const t = data.title || 'YouTube Content';
    const s = t.replace(/[^a-z0-9]/gi, '_').substring(0, 40);
    const links = [];
    if (mp4) links.push({ url: mp4, label: '⬇ Download MP4', subLabel: 'HD Video', filename: `${s}.mp4`, btnClass: 'yt' });
    if (mp3) links.push({ url: mp3, label: '🎵 Download MP3', subLabel: 'Audio Only', filename: `${s}.mp3`, btnClass: 'green' });
    return { title: t, thumbnail: getProxiedImageUrl(data.thumbnail || data.thumb || ''), links };
  }
  if (plat === 'tiktok' || plat === 'tt') {
    const links = [];
    if (data.video) links.push({ url: data.video, label: '⬇ Download Video', subLabel: 'No Watermark (HD)', filename: `tiktok-${Date.now()}.mp4`, btnClass: 'tiktok' });
    if (data.audio) links.push({ url: data.audio, label: '🎵 Download Audio', subLabel: 'MP3', filename: `tiktok-audio-${Date.now()}.mp3`, btnClass: 'green' });
    return { title: data.title || 'TikTok Content', thumbnail: getProxiedImageUrl(data.thumbnail || ''), links };
  }
  if (plat === 'x' || plat === 'twitter') {
    if (!data.success || !data.data?.medias?.length) throw new Error('Private or unavailable content.');
    const m = data.data.medias[0];
    const vid = m.type === 'video';
    return {
      title: data.data.title || 'X Content',
      thumbnail: getProxiedImageUrl(data.data.thumbnail || m.url),
      links: [{ url: m.url, label: `⬇ Download ${vid ? 'MP4' : 'Image'}`, subLabel: vid ? 'HD Video' : 'HD Image', filename: `x-${Date.now()}`, btnClass: 'x' }]
    };
  }
  if (plat === 'pinterest' || plat === 'pin') {
    if (!data.success) throw new Error('Private or unavailable pin.');
    const item = data?.data || data;
    const url = item.url || item.link || item.downloadUrl || '';
    const vid = url.includes('.mp4');
    return {
      title: item.title || 'Pinterest Content',
      thumbnail: getProxiedImageUrl(item.thumbnail || item.image || ''),
      links: [{ url, label: `⬇ Download ${vid ? 'MP4' : 'Image'}`, subLabel: vid ? 'HD Video' : 'HD Image', filename: `pin-${Date.now()}`, btnClass: 'pin' }]
    };
  }
  return null;
}

export async function fetchDownloadLinks(url: string, platformOverride?: string) {
  const platform = platformOverride || detectPlatform(url);
  if (!platform) throw new Error('Unsupported URL');

  const normalizedPlatform = platform.toLowerCase();
  let endpoint = '';

  if (normalizedPlatform === 'facebook' || normalizedPlatform === 'fb') endpoint = ENDPOINTS.facebook;
  else if (normalizedPlatform === 'instagram' || normalizedPlatform === 'ig') endpoint = ENDPOINTS.instagram;
  else if (normalizedPlatform === 'youtube' || normalizedPlatform === 'yt') endpoint = ENDPOINTS.youtube;
  else if (normalizedPlatform === 'pinterest' || normalizedPlatform === 'pin') endpoint = ENDPOINTS.pinterest;
  else if (normalizedPlatform === 'tiktok' || normalizedPlatform === 'tt') endpoint = ENDPOINTS.tiktok;
  else if (normalizedPlatform === 'twitter' || normalizedPlatform === 'x') endpoint = ENDPOINTS.x;

  if (!endpoint) throw new Error('Platform not supported');

  const { data } = await axios.post(`${BACKEND}${endpoint}`, { downloadUrl: url });

  return mapResult(data, platform, url);
}


export function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename || 'download');
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    if (document.body.contains(a)) document.body.removeChild(a);
  }, 1000);
}
