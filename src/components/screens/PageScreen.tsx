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
    const fullUrl = `https://www.marketing2advertising.com${path}`;
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
          <span>← Back</span>
        </button>

        <div className="flex items-center gap-2">
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

        {/* AdMob Banner Slot */}
        <AdMobBanner format="banner" />

        {loading ? (
          <div className="space-y-3 py-8 animate-pulse">
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-4/5 h-3 bg-white/5 rounded" />
            <div className="w-2/3 h-3 bg-white/5 rounded" />
            <div className="w-3/4 h-3 bg-white/5 rounded" />
          </div>
        ) : data?.contentHtml ? (
          <div
            className="article-content text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 font-normal [&_h1]:text-base [&_h1]:font-black [&_h1]:text-white [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-amber-400 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-amber-400 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
          />
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            <p>Could not load content for this page.</p>
            <button
              onClick={loadPage}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold"
            >
              Retry
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 text-center">
          <a
            href={`https://www.marketing2advertising.com${path}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
          >
            <span>Open Original Page on marketing2advertising.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
