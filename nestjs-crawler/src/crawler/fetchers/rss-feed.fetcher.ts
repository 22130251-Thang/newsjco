import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import { HTTP_USER_AGENT } from '../constants';
import {
  CategoryFeedConfig,
  NewsCategory,
  NewsSource,
  UnifiedNewsItem,
} from '../types';

type RssItem = Parser.Item;

@Injectable()
export class RssFeedFetcher {
  private readonly logger = new Logger(RssFeedFetcher.name);
  private readonly parser: Parser;
  private readonly IMG_SRC_REGEX =
    /<img\s+(?:[^>]*?\s+)?src\s*=\s*(["'])(.*?)\1/i;
  constructor() {
    this.parser = new Parser({
      headers: { 'User-Agent': HTTP_USER_AGENT },
    });
  }

  async fetchFeed(config: CategoryFeedConfig): Promise<UnifiedNewsItem[]> {
    try {
      this.logger.log(
        `Fetching ${config.source}/${config.category} from ${config.url}`,
      );
      const parsed = await this.parser.parseURL(config.url);

      return parsed.items.map((item) =>
        this.normalizeItem(item, config.source, config.category),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch ${config.url}: ${message}`);
      return [];
    }
  }

  async fetchFeeds(configs: CategoryFeedConfig[]): Promise<UnifiedNewsItem[]> {
    const results = await Promise.all(
      configs.map((config) => this.fetchFeed(config)),
    );
    return results.flat();
  }

  private normalizeItem(
    item: RssItem,
    source: NewsSource,
    category: NewsCategory,
  ): UnifiedNewsItem {
    const anyItem = item as Record<string, unknown>;
    const primaryContent =
      item.content?.trim() ||
      (anyItem['content:encoded'] as string)?.trim() ||
      '';
    let imageUrl: string | undefined;
    const match = primaryContent.match(this.IMG_SRC_REGEX);
    if (match && match[2]) {
      imageUrl = match[2];
    }
    return {
      title: item.title?.trim() || 'No Title',
      link: item.link?.trim() || '',
      pubDate: item.pubDate || new Date().toISOString(),
      description: item.contentSnippet?.trim() || item.summary?.trim() || '',
      content: primaryContent,
      image: imageUrl,
      fullContent: '',
      author: item.creator || (anyItem.author as string) || 'Unknown',
      source,
      category,
      categories: item.categories || [],
      guid: item.guid || item.link || '',
    };
  }
}
