import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Bookmark } from '../types/bookmark.type';
import { Article } from '../types/article.type';
import { ARTICLE_CATEGORIES } from '../config/categories';

@Injectable()
export class BookmarksService {
  private readonly logger = new Logger(BookmarksService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  findAllByUser(
    userId: number,
  ): { bookmark: Bookmark; article: Article | null }[] {
    const bookmarks = this.databaseService.findAll<Bookmark>('bookmarks');
    const userBookmarks = bookmarks.filter((b) => b.userId === userId);

    return userBookmarks.map((bookmark) => ({
      bookmark,
      article: this.findArticleBySlug(bookmark.articleSlug),
    }));
  }

  isBookmarked(userId: number, articleSlug: string): boolean {
    const bookmarks = this.databaseService.findAll<Bookmark>('bookmarks');
    return bookmarks.some(
      (b) => b.userId === userId && b.articleSlug === articleSlug,
    );
  }

  // Thêm bookmark
  addBookmark(userId: number, articleSlug: string): Bookmark {
    const article = this.findArticleBySlug(articleSlug);
    if (!article) {
      throw new NotFoundException(
        `Không tìm thấy bài viết với slug: ${articleSlug}`,
      );
    }

    if (this.isBookmarked(userId, articleSlug)) {
      throw new ConflictException('Bài viết đã được lưu trước đó');
    }

    const newBookmark: Omit<Bookmark, 'id'> = {
      userId,
      articleSlug,
      articleTitle: article.title,
      articleImage: article.image,
      articleCategory: article.category,
      createdAt: new Date().toISOString(),
    };

    return this.databaseService.create<Bookmark>('bookmarks', newBookmark);
  }

  removeBookmark(userId: number, articleSlug: string): { message: string } {
    const bookmarks = this.databaseService.findAll<Bookmark>('bookmarks');
    const bookmark = bookmarks.find(
      (b) => b.userId === userId && b.articleSlug === articleSlug,
    );

    if (!bookmark) {
      throw new NotFoundException('Không tìm thấy bookmark');
    }

    this.databaseService.remove<Bookmark>('bookmarks', bookmark.id);
    return { message: 'Đã xóa bài viết khỏi danh sách lưu' };
  }

  toggleBookmark(
    userId: number,
    articleSlug: string,
  ): { isBookmarked: boolean; message: string } {
    if (this.isBookmarked(userId, articleSlug)) {
      this.removeBookmark(userId, articleSlug);
      return { isBookmarked: false, message: 'Đã xóa khỏi danh sách lưu' };
    } else {
      this.addBookmark(userId, articleSlug);
      return { isBookmarked: true, message: 'Đã lưu bài viết' };
    }
  }

  private findArticleBySlug(slug: string): Article | null {
    for (const category of ARTICLE_CATEGORIES) {
      try {
        const articles = this.databaseService.findAll<Article>(category);
        const article = articles.find((a) => a.slug === slug);
        if (article) {
          return article;
        }
      } catch (error) {
        this.logger.warn(`Failed to search category ${category}: ${error}`);
      }
    }
    return null;
  }
}
