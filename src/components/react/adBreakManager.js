// adBreakManager.js – singleton for interstitial ads
class AdBreakManager {
  static instance = null;
  adBreak = null;
  adLoaded = false;
  isInitialized = false;

  constructor() {
    if (!AdBreakManager.instance) {
      AdBreakManager.instance = this;
      this.initializeAdConfig();
    }
    return AdBreakManager.instance;
  }

  initializeAdConfig() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;
    const init = () => {
      this.adBreak = (o) => { window.adsbygoogle = window.adsbygoogle || []; window.adsbygoogle.push(o); };
      this.adBreak({ preloadAdBreaks: 'on', sound: 'on', onReady: () => { this.adLoaded = true; } });
    };
    window.adsbygoogle ? init() : (() => {
      const poll = setInterval(() => { if (window.adsbygoogle) { clearInterval(poll); init(); } }, 500);
    })();
  }

  showAdWithCallback(cb) {
    if (typeof window === 'undefined' || !this.adBreak || !this.adLoaded) { cb({ status: 'not_available' }); return; }
    this.adBreak({ type: 'start', name: 'restart_game', adBreakDone: cb });
  }

  showInterstitialAd(cb) { this.showAdWithCallback(cb); }
}

const adBreakManager = new AdBreakManager();
export default adBreakManager;
