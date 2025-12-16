export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
  fullContent: string;
  author: string;
  source: string;
  isFeatures?: boolean;
  position: number;
  category: string;
  image: string;
  categories: string[];
  guid: string;
}
