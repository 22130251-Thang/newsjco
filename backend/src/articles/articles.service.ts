import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Article } from 'src/types/article.type';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  private readonly categories = [
    'cong-nghe',
    'doi-song',
    'giai-tri',
    'giao-duc',
    'kinh-doanh',
    'phap-luat',
    'suc-khoe',
    'the-gioi',
    'the-thao',
    'thoi-su',
  ];

  constructor(private readonly databaseService: DatabaseService) {}

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
  findTop10ThoiSuArticles(): Article[] {
    const articles = this.databaseService.findAll<Article>('thoi-su');
    articles.filter((a) => a.isFeatures == undefined);
    const top10Articles = articles.slice(0, 10);
    return top10Articles;
  }
  findByIndex(category: string, index: number): Article {
    const articles = this.databaseService.findAll<Article>(category);
    if (index < 0 || index >= articles.length) {
      throw new NotFoundException(
        `Article at index ${index} not found in category ${category}`,
      );
    }
    return articles[index];
  }

  findByGuid(guid: string): Article {
    for (const category of this.categories) {
      const article = this.databaseService.findOneBy<Article>(
        category,
        'guid',
        guid,
      );
      if (article) {
        return article;
      }
    }
    throw new NotFoundException(`Article not found with guid: ${guid}`);
  }

  create(createArticleDto: CreateArticleDto): Article {
    const category = createArticleDto.category;
    return this.databaseService.create<Article>(category, createArticleDto);
  }

  updateByIndex(
    category: string,
    index: number,
    updateArticleDto: UpdateArticleDto,
  ): Article {
    const articles = this.databaseService.findAll<Article>(category);
    if (index < 0 || index >= articles.length) {
      throw new NotFoundException(
        `Article at index ${index} not found in category ${category}`,
      );
    }
    const updatedArticle = { ...articles[index], ...updateArticleDto };
    articles[index] = updatedArticle;
    return updatedArticle;
  }

  removeByIndex(category: string, index: number): Article {
    const articles = this.databaseService.findAll<Article>(category);
    if (index < 0 || index >= articles.length) {
      throw new NotFoundException(
        `Article at index ${index} not found in category ${category}`,
      );
    }
    const [removedArticle] = articles.splice(index, 1);
    return removedArticle;
  }
  findTopThreeFeatures(): Article[] {
    const articles = this.databaseService.findAll<Article>('thoi-su');
    const featuresArticles = articles.filter(
      (a) => a.isFeatures && a.isFeatures == true,
    );
    return featuresArticles;
  }
}
