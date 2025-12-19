import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Article } from 'src/types/article.type';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  private readonly categories = [
    'khoa-hoc-cong-nghe',
    'doi-song',
    'giai-tri',
    'giao-duc',
    'kinh-doanh',
    'phap-luat',
    'suc-khoe',
    'the-gioi',
    'the-thao',
    'thoi-su',
    'dia-phuong',
    'kinh-te',
    'van-hoa',
    'quan-su',
    'anh',
    'infographics',
    'giai-ma-muon-mat',
    'tin-moi-nhat',
  ];

  constructor(private readonly databaseService: DatabaseService) { }

  findAll(): Article[] {
    let allArticles: Article[] = [];
    for (const category of this.categories) {
      const articles = this.databaseService.findAll<Article>(category);
      allArticles = allArticles.concat(articles);
    }
    return allArticles;
  }

  findByCategory(category: string): Article[] {
    return this.databaseService.findAll<Article>(category);
  }

  findFourByCategory(category: string): Article[] {
    const articles = this.databaseService.findAll<Article>(category);
    return articles.slice(0, 4);
  }
  findBySlug(slug: string): Article {
    for (const category of this.categories) {
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
    for (const category of this.categories) {
      const articles = this.databaseService.findAll<Article>(category);
      if (articles.length > 0) {
        hotNews.push(articles[0]);
      }
    }
    return hotNews;
  }

  findHomePageCategories() {
    const result: { category: string; articles: Article[] }[] = [];
    const categoriesToFetch = this.categories.slice(0, 10);
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
        // Silently skip if category cannot be fetched
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
}
