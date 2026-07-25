import * as cheerio from 'cheerio';

export interface ValidatedArticleContent {
  title: string;
  imageUrl: string;
  publishedAt: string;
  canonicalUrl?: string;
  rawText: string;
  isValid: boolean;
  rejectReason?: string;
}

/**
 * Clean raw text by stripping ads, scripts, styles, newsletter blocks, CSS class dumps
 */
export function cleanRawArticleText(htmlContent: string): { cleanText: string; paragraphs: string[] } {
  const $ = cheerio.load(htmlContent);

  // Remove non-article DOM elements
  $(
    'script, style, iframe, noscript, nav, header, footer, svg, button, form, .ad, .advertisement, .social-share, .newsletter, .related-articles, .most-popular, .comments'
  ).remove();

  const paragraphs: string[] = [];

  // Extract text from article paragraphs or main article container
  const articleElements = $('article p, main p, div[class*="article"] p, div[class*="story"] p, p');

  articleElements.each((_, el) => {
    const pText = $(el).text().trim();
    // Filter out short captions, share buttons, inline copyright notices
    if (
      pText.length > 30 &&
      !/^(share|tweet|facebook|instagram|subscribe|copyright|all rights reserved|read more|advertisement)/i.test(pText)
    ) {
      paragraphs.push(pText);
    }
  });

  // Deduplicate consecutive identical paragraphs
  const uniqueParagraphs = paragraphs.filter((text, idx) => paragraphs.indexOf(text) === idx);
  const cleanText = uniqueParagraphs.join('\n\n');

  return { cleanText, paragraphs: uniqueParagraphs };
}

/**
 * Parses and validates article detail HTML against Article Content Gate (AGENTS.md Section 13)
 */
export function parseAndValidateArticle(htmlContent: string, articleUrl: string): ValidatedArticleContent {
  const $ = cheerio.load(htmlContent);

  // Extract title
  const title =
    $('meta[property="og:title"]').attr('content')?.trim() ||
    $('h1').first().text().trim() ||
    $('title').text().trim();

  // Extract image URL
  const imageUrl =
    $('meta[property="og:image"]').attr('content')?.trim() ||
    $('meta[name="twitter:image"]').attr('content')?.trim() ||
    $('article img').first().attr('src')?.trim() ||
    $('main img').first().attr('src')?.trim() ||
    '';

  // Extract published date
  const publishedAt =
    $('meta[property="article:published_time"]').attr('content')?.trim() ||
    $('meta[name="pubdate"]').attr('content')?.trim() ||
    $('time[datetime]').first().attr('datetime')?.trim() ||
    $('meta[name="date"]').attr('content')?.trim() ||
    new Date().toISOString();

  // Extract canonical URL
  const canonicalUrl = $('link[rel="canonical"]').attr('href')?.trim() || articleUrl;

  // Clean raw text and paragraphs
  const { cleanText, paragraphs } = cleanRawArticleText(htmlContent);

  // Validation Checks (AGENTS.md Section 13 Article Content Gate)
  if (!title || title.length < 10) {
    return { title: title || '', imageUrl, publishedAt, canonicalUrl, rawText: cleanText, isValid: false, rejectReason: 'Missing or generic title' };
  }

  if (!imageUrl) {
    return { title, imageUrl: '', publishedAt, canonicalUrl, rawText: cleanText, isValid: false, rejectReason: 'Missing image URL' };
  }

  if (!publishedAt) {
    return { title, imageUrl, publishedAt: '', canonicalUrl, rawText: cleanText, isValid: false, rejectReason: 'Missing published date' };
  }

  // Body quality gate: 3 or more paragraphs OR >= 900 clean characters
  const isValidBody = paragraphs.length >= 3 || cleanText.length >= 900;
  if (!isValidBody) {
    return {
      title,
      imageUrl,
      publishedAt,
      canonicalUrl,
      rawText: cleanText,
      isValid: false,
      rejectReason: `Insufficient body text (found ${paragraphs.length} paragraphs, ${cleanText.length} chars)`,
    };
  }

  return {
    title,
    imageUrl,
    publishedAt,
    canonicalUrl,
    rawText: cleanText,
    isValid: true,
  };
}
