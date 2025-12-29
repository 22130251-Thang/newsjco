import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('article/:slug')
  findByArticleSlug(
    @Param('slug') slug: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('userId') userId?: string,
  ) {
    return this.commentsService.findByArticleSlug(slug, +page, +limit, userId ? +userId : undefined);
  }

  @Post(':id/react')
  react(
    @Param('id') id: string,
    @Body() body: { userId: number; type: 'like' | 'dislike'; articleSlug: string; categorySlug: string },
  ) {
    return this.commentsService.reactToComment(+id, body.userId, body.type, body.articleSlug, body.categorySlug);
  }
}
