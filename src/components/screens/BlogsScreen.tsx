import React, { useEffect, useState } from 'react';
import {
  Search,
  RotateCw,
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  ExternalLink,
  Film,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { BlogPost } from '../../types';
import { fetchBloggerPosts } from '../../services/blogger';
import { AdMobBanner } from '../AdMobBanner';
import { AdSenseAd } from '../AdSenseAd';
import { showToast } from '../Toast';

interface BlogsScreenProps {
  selectedPost: BlogPost | null;
  onSelectPost: (post: BlogPost | null) => void;
}

export const BlogsScreen: React.FC<BlogsScreenProps> = ({
  selectedPost,
  onSelectPost,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [activeLabel, setActiveLabel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startIndex, setStartIndex] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  // Blogger labels from main site marketing2advertising.com
  const labels = [
    'All',
    'AI',
    'Tools',
    'Careers',
    'Software',
    'Hosting',
    'Online Learning',
    'Time',
    'Info',
  ];

  const loadPosts = async (label = activeLabel, query = searchQuery, index = 1, isAppend = false) => {
    if (isAppend) setLoadingMore(true);
    else setLoading(true);

    try {
      const data = await fetchBloggerPosts({
        site: 'main',
        maxResults: 12,
        startIndex: index,
        label: label === 'All' ? undefined : label,
        q: query || undefined,
      });

      if (isAppend) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setTotalResults(data.totalResults);
      setStartIndex(index);
    } catch (err) {
      console.warn('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(activeLabel, searchQuery, 1, false);
  }, [activeLabel]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts(activeLabel, searchQuery, 1, false);
  };

  const handleLoadMore = () => {
    loadPosts(activeLabel, searchQuery, startIndex + 12, true);
  };

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: post.url || window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(post.url || window.location.href);
      showToast('Post link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="pb-28 max-w-xl mx-auto px-3.5 space-y-4 animate-in fade-in duration-300">
      {/* Post Detail View */}
      {selectedPost ? (
        <article className="space-y-4">
          {/* Top Back bar */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#14141e] border border-white/5 sticky top-14 z-30 backdrop-blur-md">
            <button
              onClick={() => onSelectPost(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 hover:text-amber-400 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Firimu & Posts</span>
            </button>

            <button
              onClick={() => handleShare(selectedPost)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Article Header & Thumbnail */}
          <div className="rounded-3xl bg-[#14141e] border border-white/10 overflow-hidden shadow-2xl">
            {selectedPost.thumbnail && (
              <div className="w-full aspect-video bg-black relative">
                <img
                  src={selectedPost.thumbnail}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] via-transparent to-black/30" />
              </div>
            )}

            <div className="p-5 space-y-3">
              {/* Category labels */}
              {selectedPost.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedPost.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-lg sm:text-xl font-black text-white leading-snug">
                {selectedPost.title}
              </h1>

              {/* Author & Published Date */}
              <div className="flex items-center gap-4 text-xs text-slate-400 pb-3 border-b border-white/10">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  {selectedPost.author.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(selectedPost.published).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Google AdSense In-Article Ad */}
              <AdSenseAd slot="2906167922" />

              {/* Rendered HTML Body */}
              <div
                className="article-content text-sm text-slate-200 leading-relaxed space-y-4 pt-2 font-normal [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-6 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-amber-300 [&_img]:rounded-2xl [&_img]:max-w-full [&_img]:my-3 [&_img]:border [&_img]:border-white/10 [&_a]:text-amber-400 [&_a]:underline [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-2xl [&_iframe]:my-4 [&_p]:mb-3 [&_table]:w-full [&_table]:border-collapse"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              {/* Bottom Post Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                <a
                  href={selectedPost.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
                >
                  <span>View Original Post on marketing2advertising.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => handleShare(selectedPost)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-black shadow-lg"
                >
                  Share This Post
                </button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        /* Posts Catalog View */
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                M2A <span className="text-amber-400">Blogs</span>
              </h2>
              <p className="text-xs text-slate-400">
                AI tools, freelancing, software & careers from marketing2advertising.com
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400/90 font-mono">
              {totalResults > 0 ? `${totalResults} total articles` : 'Live Feed'}
            </span>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, AI tools, or keywords…"
              className="w-full h-11 pl-10 pr-20 rounded-xl bg-[#14141e] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition"
            >
              Search
            </button>
          </form>

          {/* Label Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {labels.map((label) => {
              const isActive = activeLabel === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveLabel(label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-[#14141e] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Google AdSense Slot */}
          <AdSenseAd slot="2906167922" />

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3.5 rounded-2xl bg-[#14141e] border border-white/5 animate-pulse"
                >
                  <div className="w-28 h-24 rounded-xl bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="w-4/5 h-4 bg-white/10 rounded" />
                    <div className="w-2/3 h-2.5 bg-white/5 rounded" />
                    <div className="w-1/3 h-2 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Post Items Grid */}
          {!loading && posts.length > 0 && (
            <div className="space-y-3">
              {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  {index === 3 && <AdMobBanner format="native" />}

                  <div
                    onClick={() => {
                      onSelectPost(post);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group flex gap-3.5 p-3 rounded-2xl bg-[#14141e] border border-white/5 hover:border-amber-500/40 cursor-pointer transition active:scale-[0.99] shadow-sm"
                  >
                    <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      {post.categories.length > 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/80 backdrop-blur-sm text-[8px] font-black text-amber-300 uppercase">
                          {post.categories[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        {post.summary && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {post.summary}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(post.published).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          4 min read
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Load More Button */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-2 mx-auto transition disabled:opacity-50"
                >
                  {loadingMore ? (
                    <RotateCw className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{loadingMore ? 'Loading Posts…' : 'Load More Posts'}</span>
                </button>
              </div>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-[#14141e] border border-white/5">
              <p className="text-xs text-slate-400">No blog posts found for this query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveLabel('All');
                }}
                className="mt-2 text-xs font-bold text-amber-400"
              >
                Reset search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
