import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { getAvailableCategories } from './config/feed-config';
import { NewsCategory, UnifiedNewsItem } from './types';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) { }

  @Get('run/:category')
  async runByCategory(
    @Param('category') category: string,
  ): Promise<UnifiedNewsItem[]> {
    const validCategories = getAvailableCategories();

    if (!validCategories.includes(category as NewsCategory)) {
      throw new BadRequestException(
        `Invalid category: ${category}. Available: ${validCategories.join(', ')}`,
      );
    }

    return this.crawlerService.crawlByCategory(category as NewsCategory);
  }


  @Get('run')
  async runAll(): Promise<Partial<Record<NewsCategory, UnifiedNewsItem[]>>> {
    return this.crawlerService.crawlAllCategories();
  }


  @Get('categories')
  getCategories(): NewsCategory[] {
    return getAvailableCategories();
  }
}
