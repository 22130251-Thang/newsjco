import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  HTTP_TIMEOUT_MS,
  HTTP_USER_AGENT,
  CONTENT_MAX_LENGTH,
} from '../constants';
import { NewsSource } from '../types';
import { sanitizeHtmlForTypography } from '../utils/content-sanitizer';

const CONTENT_SELECTORS: Record<NewsSource, string[]> = {
  [NewsSource.VnExpress]: ['article.fck_detail', '.fck_detail'],
};

const FALLBACK_SELECTORS = ['article', 'main', '.content'];

@Injectable()
export class ArticleContentExtractor {
  private readonly logger = new Logger(ArticleContentExtractor.name);

  async extractContent(url: string, source: NewsSource): Promise<string> {
    try {
      const html = await this.fetchPage(url);
      const rawContent = this.extractFromHtml(html, source);
      const sanitized = sanitizeHtmlForTypography(rawContent);

      return sanitized.substring(0, CONTENT_MAX_LENGTH);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to extract content from ${url}: ${message}`);
      return '';
    }
  }

  private async fetchPage(url: string): Promise<string> {
    const response = await axios.get<string>(url, {
      headers: { 'User-Agent': HTTP_USER_AGENT },
      timeout: HTTP_TIMEOUT_MS,
    });
    return response.data;
  }

  private extractFromHtml(html: string, source: NewsSource): string {
    const $ = cheerio.load(html);

    const sourceSelectors = CONTENT_SELECTORS[source] || [];
    for (const selector of sourceSelectors) {
      const content = $(selector).html()?.trim();
      if (content) return content;
    }

    for (const selector of FALLBACK_SELECTORS) {
      const content = $(selector).html()?.trim();
      if (content) return content;
    }

    return '';
  }
}
