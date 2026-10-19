import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdSenseAdProps {
  slot?: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const AdSenseAd: React.FC<AdSenseAdProps> = ({
  slot = '2906167922',
  client = 'ca-pub-2269884583846743',
  format = 'auto',
  className = '',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (e) {
      console.warn('AdSense push notice:', e);
      setIsBlocked(true);
    }

    // Check after 2.5 seconds if the ad element got filled with an iframe
    timer = setTimeout(() => {
      if (adRef.current) {
        const hasIframe = adRef.current.querySelector('iframe');
        const hasFilled = adRef.current.getAttribute('data-ad-status') === 'filled';
        if (!hasIframe && !hasFilled) {
          setIsBlocked(true);
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full overflow-hidden rounded-2xl bg-[#121218] border border-white/10 p-2 my-3 text-center ${className}`}>
      {/* Top Label */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-2 pb-1.5 mb-1 border-b border-white/5">
        <span className="flex items-center gap-1.5 text-amber-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Google AdSense
        </span>
        <span className="font-mono text-[9px] text-slate-400">
          Slot: {slot}
        </span>
      </div>

      {/* Real Google AdSense Ins Tag */}
      <div className="min-h-[100px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>

      {/* Elegant Fallback for Development, Pre-Approval, or Adblock environments */}
      {isBlocked && (
        <div className="p-3 rounded-xl bg-[#161622] border border-white/5 text-left flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">M2A Sponsored Partner</h5>
              <p className="text-[10px] text-slate-400">
                Live AdSense unit ({client}) active on marketing2advertising.com
              </p>
            </div>
          </div>

          <a
            href="https://www.marketing2advertising.com"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black shrink-0 flex items-center gap-1"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
