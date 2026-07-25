import { MockArticle, mockArticles } from "./mock-data";

export interface RelatedStory {
  id: number;
  image: string;
  category: string;
  location: string;
  title: string;
  date: string;
  readTime: string;
}

export interface SourceItem {
  name: string;
  biasLabel: "Left" | "Center" | "Right";
}

export interface ArticleDetail extends MockArticle {
  author: string;
  publishedDate: string;
  readTime: string;
  imageCaption: string;
  photoCredit: string;
  bodyParagraphs: string[];
  quoteText: string;
  quoteAuthor: string;
  aiSummaryBullets: string[];
  aiSummaryDate: string;
  aiSummaryReadTime: string;
  overallBiasScore: string;
  overallBiasLabel: string;
  totalSourcesCount: number;
  sourcesBreakdown: {
    leftCount: number;
    leftPercentage: number;
    centerCount: number;
    centerPercentage: number;
    rightCount: number;
    rightPercentage: number;
  };
  topSources: SourceItem[];
  relatedStories: RelatedStory[];
}

export const defaultArticleDetail: ArticleDetail = {
  ...mockArticles[0],
  author: "David Morgan",
  publishedDate: "May 31, 2026",
  readTime: "12 min read",
  imageCaption:
    "President Donald Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026.",
  photoCredit: "Andrew Harrer/Bloomberg via Getty Images",
  bodyParagraphs: [
    "The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.",
    "The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.",
    "Iran has not yet officially responded to the proposal. However, Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran's right to peaceful nuclear energy and include the lifting of all U.S. sanctions.",
    "The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon.",
    "European allies have urged both sides to continue negotiations. \"We believe diplomacy is still the best path forward,\" said a spokesperson for the EU's foreign policy chief.",
    "Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump administration's tougher stance. \"This is the kind of leadership that was missing in the past,\" said Israeli Prime Minister Benjamin Netanyahu in a statement.",
    "The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached—or if tensions will escalate further.",
  ],
  quoteText:
    "This is a take-it-or-leave-it proposal. The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk.",
  quoteAuthor: "Senior administration official told the Wall Street Journal",
  aiSummaryBullets: [
    "The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a complete halt of enriched uranium stockpiles.",
    "The proposal also demands unrestricted inspector access to all nuclear sites, including military facilities.",
    "Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy and include sanctions relief.",
    "The U.S. warns it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.",
    "Israel supports the tougher stance, praising the administration's determination to prevent Iran from acquiring nuclear weapons.",
  ],
  aiSummaryDate: "May 31, 2026",
  aiSummaryReadTime: "3 min read",
  overallBiasScore: "49%",
  overallBiasLabel: "Right 49%",
  totalSourcesCount: 12,
  sourcesBreakdown: {
    leftCount: 2,
    leftPercentage: 20,
    centerCount: 4,
    centerPercentage: 31,
    rightCount: 6,
    rightPercentage: 49,
  },
  topSources: [
    { name: "Fox News", biasLabel: "Right" },
    { name: "The Wall Street Journal", biasLabel: "Center" },
    { name: "Reuters", biasLabel: "Center" },
    { name: "BBC", biasLabel: "Center" },
    { name: "CNN", biasLabel: "Left" },
    { name: "The New York Times", biasLabel: "Center" },
    { name: "The Washington Post", biasLabel: "Center" },
    { name: "Newsmax", biasLabel: "Right" },
  ],
  relatedStories: [
    {
      id: 101,
      image: "/images/news-4.png",
      category: "World",
      location: "Middle East",
      title: "Iran Says It Will Not Negotiate Under 'Maximum Pressure'",
      date: "May 28, 2026",
      readTime: "8 min read",
    },
    {
      id: 102,
      image: "/images/news-10.png",
      category: "Politics",
      location: "United States",
      title: "Bipartisan Group Urges Diplomacy With Iran",
      date: "May 28, 2026",
      readTime: "5 min read",
    },
    {
      id: 103,
      image: "/images/news-5.png",
      category: "Politics",
      location: "United States",
      title: "US Sanctions More Iranian Entities Over Nuclear Program",
      date: "May 26, 2026",
      readTime: "6 min read",
    },
    {
      id: 104,
      image: "/images/news-3.png",
      category: "Science",
      location: "Nuclear Policy",
      title: "What's in the 2015 Iran Nuclear Deal?",
      date: "May 25, 2026",
      readTime: "10 min read",
    },
    {
      id: 105,
      image: "/images/news-6.png",
      category: "World",
      location: "Middle East",
      title: "Oman Hosts Another Round of US-Iran Nuclear Talks",
      date: "May 27, 2026",
      readTime: "7 min read",
    },
    {
      id: 106,
      image: "/images/news-7.png",
      category: "World",
      location: "Middle East",
      title: "Israel Reaffirms Red Line Over Iranian Nuclear Program",
      date: "May 24, 2026",
      readTime: "6 min read",
    },
  ],
};

export function getArticleDetailById(id: number | string): ArticleDetail {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  const foundArticle = mockArticles.find((a) => a.id === numericId);

  if (!foundArticle) {
    return defaultArticleDetail;
  }

  // Create article detail adapted from base mock article
  return {
    ...defaultArticleDetail,
    ...foundArticle,
    // Keep consistent bias values from matching base mock article if found
    overallBiasScore: `${foundArticle.right}%`,
    overallBiasLabel:
      foundArticle.right > foundArticle.left && foundArticle.right > foundArticle.center
        ? `Right ${foundArticle.right}%`
        : foundArticle.left > foundArticle.right && foundArticle.left > foundArticle.center
        ? `Left ${foundArticle.left}%`
        : `Center ${foundArticle.center}%`,
    sourcesBreakdown: {
      leftCount: Math.round((foundArticle.sources * foundArticle.left) / 100),
      leftPercentage: foundArticle.left,
      centerCount: Math.round((foundArticle.sources * foundArticle.center) / 100),
      centerPercentage: foundArticle.center,
      rightCount: Math.round((foundArticle.sources * foundArticle.right) / 100),
      rightPercentage: foundArticle.right,
    },
  };
}
