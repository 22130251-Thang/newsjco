import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import * as https from 'https';
import * as crypto from 'crypto';
import { HTTP_USER_AGENT } from '../constants';
import {
  CategoryFeedConfig,
  NewsCategory,
  NewsSource,
  UnifiedNewsItem,
} from '../types';
import { generateSlug } from 'src/utils/utils';

type RssItem = Parser.Item;

@Injectable()
export class RssFeedFetcher {
  private readonly logger = new Logger(RssFeedFetcher.name);
  private readonly parser: Parser;
  /**
   * Regex trích xuất URL ảnh từ thẻ <img>
   * - Match: <img src="URL"> hoặc <img src='URL'>
   * - Group 1: Ký tự nháy (" hoặc ')
   * - Group 2: URL ảnh (giá trị cần lấy)
   * - \1: Backreference đảm bảo dấu nháy đóng giống dấu nháy mở
   */
  private readonly IMG_SRC_REGEX =
    /<img\s+(?:[^>]*?\s+)?src\s*=\s*(["'])(.*?)\1/i;
  constructor() {
    const httpsAgent = new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    });

    this.parser = new Parser({
      headers: { 'User-Agent': HTTP_USER_AGENT },
      requestOptions: {
        agent: httpsAgent,
      },
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
    const primaryContent = item.content?.trim() || '';
    let imageUrl: string | undefined;
    const match = primaryContent.match(this.IMG_SRC_REGEX);
    if (match && match[2]) {
      imageUrl = match[2];
    }

    const title = item.title?.trim() || 'No Title';

    const slug = generateSlug(title);

    return {
      title: title,
      slug: slug,
      link: item.link?.trim() || '',
      pubDate: item.pubDate || new Date().toISOString(),
      description: item.contentSnippet?.trim() || item.summary?.trim() || '',
      content: primaryContent,
      image: imageUrl,
      fullContent: '',
      source,
      category: category,
      categories: item.categories || [],
      guid: item.guid || item.link || '',
    };
  }
}
