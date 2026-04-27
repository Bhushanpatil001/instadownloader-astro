import React, { useEffect, useRef } from 'react';

const SERVE_ADS = typeof window !== 'undefined' && (import.meta.env?.PUBLIC_SERVE_ADS === 'true' || window.__SERVE_ADS__);
const AD_CLIENT = 'ca-pub-2219975169694529';

/**
 * AdSlot – Unified AdSense component.
 * Replaces manual pushes with a clean, idempotent logic.
 */
export default function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' },
  minHeight = '90px'
}) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!SERVE_ADS || !slot) return;

    // Small delay to ensure DOM is ready and prevent "Adsbygoogle.js:134 Uncaught Error"
    const timer = setTimeout(() => {
      if (!adRef.current || pushed.current) return;
      
      // Check if this specific element already has an ad
      if (adRef.current.getAttribute('data-adsbygoogle-status') === 'done') {
        pushed.current = true;
        return;
      }

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (err) {
        console.error('AdSense push error:', err);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [slot]);

  if (!SERVE_ADS || !slot) return null;

  return (
    <div className={`ad-slot-container ${className}`} style={{ minHeight }}>
      <ins
        ref={adRef}
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
