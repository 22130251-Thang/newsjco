import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get('top-3-articles')
  findTopThreeArticles() {
    return this.articlesService.findTopThreeFeatures();
  }

  @Get('main-the-gioi')
  findMainTheGioiArticle() {
    return this.articlesService.findMainTheGioiArticle();
  }

  @Get('hot-news')
  findHotNews() {
    return this.articlesService.findHotNews();
  }

  @Get('homepage-categories')
  getHomePageCategories() {
    return this.articlesService.findHomePageCategories();
  }

  @Get('media')
  findMediaArticles() {
    return this.articlesService.findMediaArticles();
  }

  @Get('economic-articles')
  findEconomicArticles() {
    return this.articlesService.findEconomicArticles();
  }

  @Get('by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Get('by-category/:category')
  findByCategory(
    @Param('category') category: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.articlesService.findByCategory(
      category,
      +page,
      +limit,
      +offset,
    );
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    if (category) {
      return this.articlesService.findByCategory(
        category,
        +page,
        +limit,
        +offset,
      );
    }
    return this.articlesService.findAll();
  }

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }
}
