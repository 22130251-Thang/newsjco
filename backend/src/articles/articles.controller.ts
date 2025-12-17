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
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.articlesService.findByCategory(category);
    }
    return this.articlesService.findAll();
  }

  @Get('guid')
  findByGuid(@Query('url') guid: string) {
    return this.articlesService.findByGuid(guid);
  }

  @Get(':category/:index')
  findByIndex(
    @Param('category') category: string,
    @Param('index') index: string,
  ) {
    return this.articlesService.findByIndex(category, +index);
  }

  @Get('top-3-articles')
  findTopThreeArticles() {
    return this.articlesService.findTopThreeFeatures();
  }

  @Get('top-10-thoi-su-articles')
  findTop10ThoiSuArticles() {
    return this.articlesService.findTop10ThoiSuArticles();
  }

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Patch(':category/:index')
  update(
    @Param('category') category: string,
    @Param('index') index: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.updateByIndex(
      category,
      +index,
      updateArticleDto,
    );
  }

  @Delete(':category/:index')
  remove(@Param('category') category: string, @Param('index') index: string) {
    return this.articlesService.removeByIndex(category, +index);
  }
}
