import * as cheerio from 'cheerio';

/**
 * Non-article reject patterns (AGENTS.md Section 9 canonical reject list)
 */
const NON_ARTICLE_PATTERNS = [
  /\/category\//i,
  /\/sections?\//i,
  /\/topics?\//i,
  /\/tags?\//i,
  /\/authors?\//i,
  /\/search/i,
  /\/nav/i,
  /\/menu/i,
  /\/footer/i,
  /\/shows?\//i,
  /\/programs?\//i,
  /\/podcasts?\//i,
  /\/live\//i,
  /\/liveblog\//i,
  /\/games?\//i,
  /\/product/i,
  /\/reviews?\//i,
  /\/shopping/i,
  /\/corporate/i,
  /\/support/i,
  /\/help/i,
  /\/newsletters?\//i,
  /\/subscribe/i,
  /\/about/i,
  /\/contact/i,
  /\/privacy/i,
  /\/terms/i,
  /\/video\//i,
  /\/audio\//i,
];

/**
 * Checks if candidate URL matches non-article reject list
 */
export function isNonArticleUrl(url: string): boolean {
  return NON_ARTICLE_PATTERNS.some((pattern) => pattern.test(url));
}

/**
 * Enforces source-specific candidate URL filtering (AGENTS.md Section 11 & 12)
 */
export function isValidArticleCandidate(urlStr: string, sourceUrl: string): boolean {
  try {
    const url = new URL(urlStr, sourceUrl);

    // Skip external domain links
    const sourceHostname = new URL(sourceUrl).hostname.replace(/^www\./, '');
    const urlHostname = url.hostname.replace(/^www\./, '');
    if (!urlHostname.includes(sourceHostname) && !sourceHostname.includes(urlHostname)) {
      return false;
    }

    const pathname = url.pathname;

    // Must have a path longer than root '/'
    if (!pathname || pathname === '/' || pathname.length < 5) {
      return false;
    }

    // Apply canonical non-article reject list
    if (isNonArticleUrl(urlStr)) {
      return false;
    }

    // Source specific heuristic rules
    if (sourceHostname.includes('reuters.com')) {
      // Reuters articles have date path or specific article slugs with ID at end or date
      return /\/202[0-9]-/i.test(pathname) || /\-[0-9]{4}\-[0-9]{2}\-[0-9]{2}\/?$/i.test(pathname) || (pathname.split('/').length >= 3 && !/^\/(world|business|markets|technology|legal)\/?$/i.test(pathname));
    }

    if (sourceHostname.includes('bbc.com')) {
      return pathname.includes('/articles/') || (pathname.includes('/news/') && /\-[0-9]{6,}$/i.test(pathname)) || pathname.split('/').length >= 3;
    }

    if (sourceHostname.includes('foxnews.com')) {
      return /\/(politics|us|world|media|opinion|entertainment|lifestyle)\/[a-z0-9\-]+$/i.test(pathname);
    }

    if (sourceHostname.includes('cnn.com')) {
      return /\/202[0-9]\/[0-9]{2}\/[0-9]{2}\//i.test(pathname) || pathname.includes('/index.html');
    }

    if (sourceHostname.includes('theguardian.com')) {
      return /\/202[0-9]\/[a-z]{3}\/[0-9]{2}\//i.test(pathname);
    }

    if (sourceHostname.includes('npr.org')) {
      return /\/202[0-9]\/[0-9]{2}\/[0-9]{2}\/[0-9]{7,}\//i.test(pathname) || (pathname.includes('/npr/') && /\-[0-9]{5,}/i.test(pathname));
    }

    // Generic fallback: path must have at least 2 segments and contain a story slug
    const segments = pathname.split('/').filter(Boolean);
    return segments.length >= 2 && segments[segments.length - 1].length >= 10;
  } catch {
    return false;
  }
}

/**
 * Extract visible story card links from source homepage HTML
 */
export function extractHomepageArticleLinks(homepageHtml: string, sourceUrl: string): string[] {
  const $ = cheerio.load(homepageHtml);
  const linksSet = new Set<string>();

  // Target story card containers and main content elements
  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href) return;

    try {
      const fullUrl = new URL(href, sourceUrl).href;
      // Clean query params & hash
      const cleanUrl = fullUrl.split('#')[0].split('?')[0];

      if (isValidArticleCandidate(cleanUrl, sourceUrl)) {
        linksSet.add(cleanUrl);
      }
    } catch {
      // Ignore invalid URL parse errors
    }
  });

  return Array.from(linksSet);
}
