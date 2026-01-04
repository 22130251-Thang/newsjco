import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  findAll(@Request() req: { user: { userId: number } }) {
    return this.bookmarksService.findAllByUser(req.user.userId);
  }

  @Get('check/:slug')
  checkBookmark(
    @Request() req: { user: { userId: number } },
    @Param('slug') slug: string,
  ) {
    const isBookmarked = this.bookmarksService.isBookmarked(
      req.user.userId,
      slug,
    );
    return { isBookmarked };
  }

  // IMPORTANT: toggle route must be BEFORE :slug route to match correctly
  @Post('toggle/:slug')
  toggleBookmark(
    @Request() req: { user: { userId: number } },
    @Param('slug') slug: string,
  ) {
    return this.bookmarksService.toggleBookmark(req.user.userId, slug);
  }

  @Post(':slug')
  @HttpCode(HttpStatus.CREATED)
  addBookmark(
    @Request() req: { user: { userId: number } },
    @Param('slug') slug: string,
  ) {
    return this.bookmarksService.addBookmark(req.user.userId, slug);
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.OK)
  removeBookmark(
    @Request() req: { user: { userId: number } },
    @Param('slug') slug: string,
  ) {
    return this.bookmarksService.removeBookmark(req.user.userId, slug);
  }
}
