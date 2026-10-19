import { BlogPost } from '../types';

interface BloggerEntry {
  id?: { $t: string };
  title?: { $t: string };
  published?: { $t: string };
  updated?: { $t: string };
  content?: { $t: string };
  summary?: { $t: string };
  category?: Array<{ term: string }>;
  author?: Array<{ name: { $t: string }; gd$image?: { src?: string } }>;
  link?: Array<{ rel: string; href: string }>;
  media$thumbnail?: { url: string };
}

interface BloggerFeedResponse {
  feed?: {
    openSearch$totalResults?: { $t: string };
    openSearch$startIndex?: { $t: string };
    entry?: BloggerEntry[];
  };
}

const CACHE_KEY_PREFIX = 'm2a_feed_';

export async function fetchBloggerPosts(options: {
  site?: 'main' | 'naka';
  maxResults?: number;
  startIndex?: number;
  label?: string;
  q?: string;
  id?: string;
}): Promise<{ posts: BlogPost[]; totalResults: number }> {
  const { site = 'main', maxResults = 12, startIndex = 1, label, q, id } = options;

  const queryParams = new URLSearchParams();
  queryParams.set('site', site);
  queryParams.set('maxResults', String(maxResults));
  queryParams.set('startIndex', String(startIndex));
  if (label && label !== 'All') queryParams.set('label', label);
  if (q) queryParams.set('q', q);
  if (id) queryParams.set('id', id);

  const cacheKey = `${CACHE_KEY_PREFIX}${queryParams.toString()}`;

  try {
    const response = await fetch(`/api/blogger/feed?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Feed request failed: ${response.statusText}`);
    }

    const data: BloggerFeedResponse = await response.json();
    const entries = data.feed?.entry || [];
    const totalResults = parseInt(data.feed?.openSearch$totalResults?.$t || '0', 10);

    const posts: BlogPost[] = entries.map((entry) => {
      const postIdMatch = entry.id?.$t.match(/post-(\d+)/);
      const postId = postIdMatch ? postIdMatch[1] : (entry.id?.$t || Math.random().toString());

      const rawContent = entry.content?.$t || entry.summary?.$t || '';

      // Extract high resolution thumbnail if possible
      let thumbnail = entry.media$thumbnail?.url || '';
      if (!thumbnail) {
        const imgMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
          thumbnail = imgMatch[1];
        }
      }
      // Upgrade blogger thumbnail resolution (replace /s72-c/ with /w800-h450-c/)
      if (thumbnail.includes('/s72-c/')) {
        thumbnail = thumbnail.replace('/s72-c/', '/w800-h450-c/');
      }

      // Generate clean summary text
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = rawContent;
      const cleanSummary = (tempDiv.textContent || tempDiv.innerText || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 140);

      const altLink = (entry.link || []).find((l) => l.rel === 'alternate')?.href || '';
      const categories = (entry.category || []).map((c) => c.term);

      return {
        id: postId,
        title: entry.title?.$t || 'Untitled Post',
        published: entry.published?.$t || new Date().toISOString(),
        updated: entry.updated?.$t,
        content: rawContent,
        summary: cleanSummary ? `${cleanSummary}...` : '',
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        author: {
          name: entry.author?.[0]?.name?.$t || 'M2A Team',
          avatar: entry.author?.[0]?.gd$image?.src
        },
        categories,
        url: altLink
      };
    });

    // Save to local storage for offline reading
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ posts, totalResults, time: Date.now() }));
    } catch {
      // LocalStorage full or quota exceeded, silent ignore
    }

    return { posts, totalResults };
  } catch (err) {
    console.warn('Network feed error, checking offline cache:', err);
    // Try offline cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return { posts: parsed.posts || [], totalResults: parsed.totalResults || 0 };
      } catch {
        // invalid cache
      }
    }
    throw err;
  }
}
