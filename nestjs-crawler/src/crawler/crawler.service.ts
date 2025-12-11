import { Injectable, Logger } from '@nestjs/common';
import {
  getFeedsByCategory,
  getAvailableCategories,
  FEED_CONFIGS,
} from './config/feed-config';
import { ArticleContentExtractor } from './extractors/article-content.extractor';
import { JsonFileExporter } from './exporters/json-file.exporter';
import { RssFeedFetcher } from './fetchers/rss-feed.fetcher';
import { NewsCategory, UnifiedNewsItem } from './types';

@Injectable()
export class CrawlerService {

  constructor(
    private readonly feedFetcher: RssFeedFetcher,
    private readonly contentExtractor: ArticleContentExtractor,
    private readonly exporter: JsonFileExporter,
  ) { }


  async crawlByCategory(category: NewsCategory): Promise<UnifiedNewsItem[]> {
    const feeds = getFeedsByCategory(category);
    if (feeds.length === 0) {
      return [];
    }

    const items = await this.feedFetcher.fetchFeeds(feeds);

    const enrichedItems = await this.enrichWithFullContent(items);

    this.exporter.exportByCategory(category, enrichedItems);

    return enrichedItems;
  }


  async crawlAllCategories(): Promise<Record<NewsCategory, UnifiedNewsItem[]>> {
    const categories = getAvailableCategories();
    const results: Record<string, UnifiedNewsItem[]> = {};

    for (const category of categories) {
      results[category] = await this.crawlByCategory(category);
    }

    return results as Record<NewsCategory, UnifiedNewsItem[]>;
  }


  private async enrichWithFullContent(
    items: UnifiedNewsItem[],
  ): Promise<UnifiedNewsItem[]> {
    const enriched: UnifiedNewsItem[] = [];

    for (const item of items) {
      const fullContent = await this.contentExtractor.extractContent(
        item.link,
        item.source,
      );
      enriched.push({
        ...item,
        fullContent: fullContent || item.content,
      });
    }

    return enriched;
  }
}
