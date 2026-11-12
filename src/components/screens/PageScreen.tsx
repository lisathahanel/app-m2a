import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  RotateCw,
  ExternalLink,
  Shield,
  FileText,
  Mail,
  Info,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { StaticPageData } from '../../types';
import { AdMobBanner } from '../AdMobBanner';
import { showToast } from '../Toast';

interface PageScreenProps {
  path: string;
  defaultTitle: string;
  onBack: () => void;
}

export const PageScreen: React.FC<PageScreenProps> = ({
  path,
  defaultTitle,
  onBack,
}) => {
  const [data, setData] = useState<StaticPageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fullUrl = `https://www.marketing2advertising.com${path}`;

  const getIcon = () => {
    if (path.includes('privacy')) return <Shield className="w-5 h-5 text-amber-400" />;
    if (path.includes('terms')) return <FileText className="w-5 h-5 text-amber-400" />;
    if (path.includes('contact')) return <Mail className="w-5 h-5 text-amber-400" />;
    if (path.includes('about')) return <Info className="w-5 h-5 text-amber-400" />;
    return <AlertCircle className="w-5 h-5 text-amber-400" />;
  };

  const loadPage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogger/page?path=${encodeURIComponent(path)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Failed to load static page:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [path]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: data?.title || defaultTitle, url: fullUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(fullUrl);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="pb-28 max-w-xl mx-auto px-3.5 space-y-4 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-[#14141e] border border-white/5 sticky top-14 z-30 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
            title="Open on site"
          >
            <span>Open on Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={loadPage}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition"
            title="Reload"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="rounded-3xl bg-[#14141e] border border-white/10 p-5 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              {data?.title || defaultTitle}
            </h1>
            <p className="text-[10px] text-slate-400">marketing2advertising.com</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 py-6 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-5/6" />
            <div className="h-3 bg-white/5 rounded w-4/6" />
          </div>
        ) : (
          <div
            className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 pt-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-4 [&_p]:mb-2 [&_a]:text-amber-400 [&_a]:underline"
            dangerouslySetInnerHTML={{
              __html:
                data?.contentHtml ||
                (data as unknown as { content?: string })?.content ||
                `<p class="text-slate-400">Loading information from marketing2advertising.com…</p>`,
            }}
          />
        )}

        {/* Bottom Direct Link */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amber-400 hover:underline font-bold"
          >
            <span>View official page on marketing2advertising.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <AdMobBanner format="banner" />
    </div>
  );
};
