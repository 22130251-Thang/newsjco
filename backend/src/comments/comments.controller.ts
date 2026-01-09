import { Body, Controller, Get, Param, Post, Query, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  // IMPORTANT: This route must be BEFORE ':id' routes
  @Get('user/:userId')
  findByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit: string = '20',
  ) {
    return this.commentsService.findByUserId(+userId, +limit);
  }

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
    return this.commentsService.findByArticleSlug(
      slug,
      +page,
      +limit,
      userId ? +userId : undefined,
    );
  }

  @Post(':id/react')
  react(
    @Param('id') id: string,
    @Body()
    body: {
      userId: number;
      type: 'like' | 'dislike';
      articleSlug: string;
      categorySlug: string;
    },
  ) {
    return this.commentsService.reactToComment(
      +id,
      body.userId,
      body.type,
      body.articleSlug,
      body.categorySlug,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto & { userId: number },
  ) {
    return this.commentsService.updateComment(
      +id,
      updateCommentDto.userId,
      updateCommentDto.content,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() body: { userId: number },
  ) {
    return this.commentsService.deleteComment(+id, body.userId);
  }
}

