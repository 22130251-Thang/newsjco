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
  constructor(private readonly articlesService: ArticlesService) { }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.articlesService.findByCategory(category);
    }
    return this.articlesService.findAll();
  }
  @Get('by-category/:category')
  findFourByCategory(@Param('category') category: string) {
    return this.articlesService.findFourByCategory(category);
  }


  @Get('top-3-articles')
  findTopThreeArticles() {
    return this.articlesService.findTopThreeFeatures();
  }

  @Get('by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
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

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }
}
