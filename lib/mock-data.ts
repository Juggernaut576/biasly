export interface MockArticle {
  id: number;
  image: string;
  category: string;
  location: string;
  title: string;
  left: number;
  center: number;
  right: number;
  sources: number;
}

export const mockArticles: MockArticle[] = [
  {
    id: 1,
    image: "/images/news-1.png",
    category: "Politics",
    location: "United States",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    left: 20,
    center: 31,
    right: 49,
    sources: 12,
  },
  {
    id: 2,
    image: "/images/news-2.png",
    category: "Health",
    location: "United States",
    title:
      "Researchers Make Case for Grapes as a 'Superfood' After Review of Health Evidence",
    left: 18,
    center: 42,
    right: 40,
    sources: 7,
  },
  {
    id: 3,
    image: "/images/news-3.png",
    category: "Science",
    location: "Switzerland",
    title:
      "CERN Finds High-Significance Hint of Physics Beyond Standard Model",
    left: 16,
    center: 62,
    right: 22,
    sources: 8,
  },
  {
    id: 4,
    image: "/images/news-4.png",
    category: "World",
    location: "Nicaragua",
    title:
      "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention",
    left: 54,
    center: 28,
    right: 18,
    sources: 63,
  },
  {
    id: 5,
    image: "/images/news-5.png",
    category: "World",
    location: "Middle East",
    title:
      "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon",
    left: 29,
    center: 38,
    right: 43,
    sources: 15,
  },
  {
    id: 6,
    image: "/images/news-6.png",
    category: "Business",
    location: "Global",
    title:
      "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand",
    left: 25,
    center: 50,
    right: 28,
    sources: 11,
  },
  {
    id: 7,
    image: "/images/news-7.png",
    category: "Technology",
    location: "United States",
    title:
      "SpaceX Launches Starship Test Flight in Milestone for Mars Program",
    left: 12,
    center: 45,
    right: 49,
    sources: 9,
  },
  {
    id: 8,
    image: "/images/news-8.png",
    category: "Business",
    location: "United States",
    title:
      "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac",
    left: 18,
    center: 40,
    right: 45,
    sources: 10,
  },
  {
    id: 9,
    image: "/images/news-9.png",
    category: "Climate",
    location: "Global",
    title:
      "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says",
    left: 33,
    center: 34,
    right: 35,
    sources: 14,
  },
  {
    id: 10,
    image: "/images/news-10.png",
    category: "Economy",
    location: "United States",
    title:
      "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook",
    left: 30,
    center: 45,
    right: 25,
    sources: 13,
  },
  {
    id: 11,
    image: "/images/news-11.png",
    category: "Soccer",
    location: "Europe",
    title:
      "Real Madrid Win Champions League After Comeback Victory in Final",
    left: 10,
    center: 20,
    right: 70,
    sources: 26,
  },
  {
    id: 12,
    image: "/images/news-12.png",
    category: "Environment",
    location: "Canada",
    title:
      "Wildfires Force Thousands to Evacuate Across Western Canada",
    left: 27,
    center: 33,
    right: 40,
    sources: 17,
  },
];
