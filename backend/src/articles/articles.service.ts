import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Article } from 'src/types/article.type';
import { CreateArticleDto } from './dto/create-article.dto';
import { PaginationResult } from '../types/pagination.type';
import { ARTICLE_CATEGORIES } from '../config/categories';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(private readonly databaseService: DatabaseService) { }

  findAll(): Article[] {
    let allArticles: Article[] = [];
    for (const category of ARTICLE_CATEGORIES) {
      const articles = this.databaseService.findAll<Article>(category);
      allArticles = allArticles.concat(articles);
    }
    return allArticles;
  }

  findByCategory(
    category: string,
    page: number = 1,
    limit: number = 10,
    offset: number = 0,
  ): PaginationResult<Article> {
    const allArticles = this.databaseService.findAll<Article>(category);

    const totalItems = allArticles.length;

    const startIndex = offset + (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = allArticles.slice(startIndex, endIndex);

    const totalPages = Math.ceil(Math.max(0, totalItems - offset) / limit);

    return {
      data: paginatedArticles,
      meta: {
        totalItems,
        itemCount: paginatedArticles.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  findFourByCategory(category: string): Article[] {
    const articles = this.databaseService.findAll<Article>(category);
    return articles.slice(0, 4);
  }

  findBySlug(slug: string): Article {
    for (const category of ARTICLE_CATEGORIES) {
      const articles = this.databaseService.findAll<Article>(category);
      const article = articles.find((a) => a.slug === slug);
      if (article) {
        return article;
      }
    }
    throw new NotFoundException(`Article with slug ${slug} not found`);
  }

  create(createArticleDto: CreateArticleDto): Article {
    const category = createArticleDto.category;
    return this.databaseService.create<Article>(category, createArticleDto);
  }

  findTopThreeFeatures(): Article[] {
    const articles = this.databaseService.findAll<Article>('thoi-su');
    const featuresArticles = articles.filter(
      (a) => a.isFeatures && a.isFeatures == true,
    );
    return featuresArticles;
  }

  findMainTheGioiArticle(): Article | null {
    const articles = this.databaseService.findAll<Article>('the-gioi');
    const mainArticle = articles.find((a) => a.isMain && a.isMain === true);
    return mainArticle || null;
  }

  findHotNews(): Article[] {
    const hotNews: Article[] = [];
    for (const category of ARTICLE_CATEGORIES) {
      const articles = this.databaseService.findAll<Article>(category);
      if (articles.length > 0) {
        hotNews.push(articles[0]);
      }
    }
    return hotNews;
  }

  findHomePageCategories() {
    const result: { category: string; articles: Article[] }[] = [];
    const categoriesToFetch = ARTICLE_CATEGORIES.slice(0, 10);
    for (const category of categoriesToFetch) {
      try {
        const articles = this.databaseService.findAll<Article>(category);
        if (articles.length > 0) {
          result.push({
            category,
            articles: articles.slice(0, 4),
          });
        }
      } catch (error) {
        this.logger.warn(`Failed to load category ${category}: ${error}`);
      }
    }
    return result;
  }

  findMediaArticles(): Article[] {
    const anhArticles = this.databaseService.findAll<Article>('anh');
    const infographicArticles =
      this.databaseService.findAll<Article>('infographics');
    return [...anhArticles, ...infographicArticles];
  }

  findEconomicArticles(): Article[] {
    return this.databaseService.findAll<Article>('kinh-te');
  }

  private normalizeText(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .trim();
  }

  private isArticleMatch(article: Article, normalizedQuery: string): boolean {
    const titleNormalized = this.normalizeText(article.title);
    const descriptionNormalized = this.normalizeText(article.description);
    const contentNormalized = this.normalizeText(article.content);
    const fullContentNormalized = this.normalizeText(article.fullContent);

    return (
      titleNormalized.includes(normalizedQuery) ||
      descriptionNormalized.includes(normalizedQuery) ||
      contentNormalized.includes(normalizedQuery) ||
      fullContentNormalized.includes(normalizedQuery)
    );
  }

  private calculateRelevanceScore(
    article: Article,
    normalizedQuery: string,
  ): number {
    let score = 0;

    const titleNormalized = this.normalizeText(article.title);
    const descriptionNormalized = this.normalizeText(article.description);

    if (titleNormalized.includes(normalizedQuery)) {
      score += 100;
      if (titleNormalized.startsWith(normalizedQuery)) {
        score += 50;
      }
    }

    if (descriptionNormalized.includes(normalizedQuery)) {
      score += 50;
    }

    const contentNormalized = this.normalizeText(article.content);
    if (contentNormalized.includes(normalizedQuery)) {
      score += 25;
    }

    const pubDate = new Date(article.pubDate).getTime();
    const now = Date.now();
    const ageInDays = (now - pubDate) / (1000 * 60 * 60 * 24);
    if (ageInDays < 1) score += 20;
    else if (ageInDays < 7) score += 10;
    else if (ageInDays < 30) score += 5;

    return score;
  }

  search(
    query: string,
    page: number = 1,
    limit: number = 10,
    category?: string,
  ): PaginationResult<Article> {
    if (!query || query.trim().length === 0) {
      return {
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page,
        },
      };
    }

    const normalizedQuery = this.normalizeText(query);
    let allArticles: Article[] = [];

    if (category && (ARTICLE_CATEGORIES as readonly string[]).includes(category)) {
      allArticles = this.databaseService.findAll<Article>(category);
    } else {
      for (const cat of ARTICLE_CATEGORIES) {
        const articles = this.databaseService.findAll<Article>(cat);
        allArticles = allArticles.concat(articles);
      }
    }

    const matchedArticles = allArticles.filter((article) =>
      this.isArticleMatch(article, normalizedQuery),
    );

    const sortedArticles = matchedArticles
      .map((article) => ({
        article,
        score: this.calculateRelevanceScore(article, normalizedQuery),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.article);

    const totalItems = sortedArticles.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = sortedArticles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: paginatedArticles,
      meta: {
        totalItems,
        itemCount: paginatedArticles.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  searchSuggestions(query: string, limit: number = 5): Article[] {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const normalizedQuery = this.normalizeText(query);
    let allArticles: Article[] = [];

    for (const category of ARTICLE_CATEGORIES) {
      const articles = this.databaseService.findAll<Article>(category);
      allArticles = allArticles.concat(articles);
    }

    const matchedArticles = allArticles
      .filter((article) => this.isArticleMatch(article, normalizedQuery))
      .map((article) => ({
        article,
        score: this.calculateRelevanceScore(article, normalizedQuery),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.article);

    return matchedArticles;
  }

  getTrendingKeywords(): string[] {
    return [
      'thời sự',
      'kinh tế',
      'thể thao',
      'giải trí',
      'công nghệ',
      'sức khỏe',
      'giáo dục',
      'thế giới',
    ];
  }
}
