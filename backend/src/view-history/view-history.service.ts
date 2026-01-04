import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ViewHistory } from '../types/view-history.type';
import { Article } from '../types/article.type';
import { ARTICLE_CATEGORIES } from '../config/categories';

const VIEW_HISTORY_TABLE = 'view-history';

@Injectable()
export class ViewHistoryService {
  private readonly logger = new Logger(ViewHistoryService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  private findAllArticles(): Article[] {
    let allArticles: Article[] = [];
    for (const category of ARTICLE_CATEGORIES) {
      try {
        const articles = this.databaseService.findAll<Article>(category);
        allArticles = allArticles.concat(articles);
      } catch (error) {
        this.logger.warn(`Failed to load articles from ${category}`);
      }
    }
    return allArticles;
  }

  addView(
    userId: number,
    articleSlug: string,
  ): { success: boolean; message: string } {
    const allHistory =
      this.databaseService.findAll<ViewHistory>(VIEW_HISTORY_TABLE);
    const existing = allHistory.find(
      (r) => r.userId === userId && r.articleSlug === articleSlug,
    );

    if (existing) {
      this.databaseService.update<ViewHistory>(
        VIEW_HISTORY_TABLE,
        existing.id,
        {
          viewedAt: new Date().toISOString(),
        },
      );
    } else {
      this.databaseService.create<ViewHistory>(VIEW_HISTORY_TABLE, {
        userId,
        articleSlug,
        viewedAt: new Date().toISOString(),
      } as Omit<ViewHistory, 'id'>);
    }

    return { success: true, message: 'View recorded' };
  }

  getHistory(userId: number, limit: number = 20) {
    const allHistory =
      this.databaseService.findAll<ViewHistory>(VIEW_HISTORY_TABLE);
    const articles = this.findAllArticles();

    const userHistory = allHistory
      .filter((r) => r.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
      )
      .slice(0, limit);

    return userHistory.map((record) => {
      const article = articles.find((a) => a.slug === record.articleSlug);
      return {
        id: record.id,
        articleSlug: record.articleSlug,
        viewedAt: record.viewedAt,
        article: article
          ? {
              title: article.title,
              category: article.category,
              thumbnail: article.thumbnail || article.image,
            }
          : null,
      };
    });
  }

  clearHistory(userId: number): { success: boolean; message: string } {
    const allHistory =
      this.databaseService.findAll<ViewHistory>(VIEW_HISTORY_TABLE);
    const userRecords = allHistory.filter((r) => r.userId === userId);

    for (const record of userRecords) {
      this.databaseService.remove<ViewHistory>(VIEW_HISTORY_TABLE, record.id);
    }

    return { success: true, message: 'History cleared' };
  }

  removeView(
    userId: number,
    articleSlug: string,
  ): { success: boolean; message: string } {
    const allHistory =
      this.databaseService.findAll<ViewHistory>(VIEW_HISTORY_TABLE);
    const record = allHistory.find(
      (r) => r.userId === userId && r.articleSlug === articleSlug,
    );

    if (record) {
      this.databaseService.remove<ViewHistory>(VIEW_HISTORY_TABLE, record.id);
    }

    return { success: true, message: 'View removed' };
  }
}
