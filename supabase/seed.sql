-- ==============================================================================
-- biasly (Skew News) - Initial Seed Data
-- Core active news sources for scraping and analysis
-- ==============================================================================

INSERT INTO public.sources (name, listing_url, parser_strategy, is_active, logo_url)
VALUES
  (
    'Reuters',
    'https://www.reuters.com',
    'reuters',
    true,
    'https://www.reuters.com/pf/resources/images/reuters/logo-vertical-default-light.svg'
  ),
  (
    'BBC News',
    'https://www.bbc.com/news',
    'bbc',
    true,
    'https://nav.files.bbci.co.uk/searchbox/ebc14d9b4b9b9bfcf27732a3ea6be113/images/bbc-logo.svg'
  ),
  (
    'Fox News',
    'https://www.foxnews.com',
    'fox',
    true,
    'https://static.foxnews.com/static/orion/styles/img/fox-news/og/og-fox-news.png'
  ),
  (
    'CNN',
    'https://www.cnn.com',
    'cnn',
    true,
    'https://cdn.cnn.com/cnn/.e/img/3.0/global/icons/apple-touch-icon.png'
  ),
  (
    'The Guardian',
    'https://www.theguardian.com/us',
    'guardian',
    true,
    'https://assets.guim.co.uk/images/guardian-logo-100.png'
  ),
  (
    'NPR',
    'https://www.npr.org',
    'npr',
    true,
    'https://media.npr.org/chrome/news/nprlogo_138x46.gif'
  )
ON CONFLICT (listing_url) DO UPDATE SET
  name = EXCLUDED.name,
  parser_strategy = EXCLUDED.parser_strategy,
  is_active = EXCLUDED.is_active,
  logo_url = EXCLUDED.logo_url,
  updated_at = NOW();
