import React, { useEffect, useRef, useState } from 'react';

const AD_CLIENT = 'ca-pub-2219975169694529';

// Build-time env var — identical on server AND client. Never use typeof window at module scope.
const SERVE_ADS_ENV = import.meta.env.PUBLIC_SERVE_ADS === 'true';
export default function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' },
  minHeight = '90px'
}) {
  const [mounted, setMounted] = useState(false);
  const insRef = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const serveAds = SERVE_ADS_ENV || window.__SERVE_ADS__;
    if (!serveAds || !slot) return;
    const ins = insRef.current;
    if (!ins) return;
    if (pushedRef.current) return;
    if (ins.getAttribute('data-adsbygoogle-status')) return;
    if (ins.firstChild) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {
      // Swallow TagError from rare AdSense races; AdSense logs internally.
    }
  }, [mounted, slot]);

  if (!mounted) return null;
  const serveAds = SERVE_ADS_ENV || window.__SERVE_ADS__;
  if (!serveAds || !slot) return null;

  return (
    <div className={`ad-slot-container ${className}`} style={{ minHeight }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
