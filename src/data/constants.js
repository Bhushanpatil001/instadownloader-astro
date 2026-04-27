// Shared constants for the Astro project
export const AD_CLIENT     = 'ca-pub-2219975169694529';
export const ADS_SLOT_TOP    = '1601408852';
export const ADS_SLOT_MID    = '6748959606';
export const ADS_SLOT_BOTTOM = '9503261240';
export const ADS_SLOT_STICKY = '3456789012';

export const BACKEND_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_BACKEND_URL)
    ? import.meta.env.PUBLIC_BACKEND_URL
    : 'https://backend.instadownloader.app/api';

export const SERVE_ADS =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SERVE_ADS === 'true');
