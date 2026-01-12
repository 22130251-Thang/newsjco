import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ViewHistoryService } from './view-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('view-history')
export class ViewHistoryController {
  constructor(private readonly viewHistoryService: ViewHistoryService) { }

  // Public endpoint - no auth required
  @Get('count/:slug')
  getViewCount(@Param('slug') slug: string) {
    return this.viewHistoryService.getViewCount(slug);
  }

  @Post(':slug')
  @UseGuards(JwtAuthGuard)
  addView(
    @Request() req: { user: { userId: number } },
    @Param('slug') slug: string,
  ) {
    return this.viewHistoryService.addView(req.user.userId, slug);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getHistory(
    @Request() req: { user: { userId: number } },
    @Query('limit') limit?: string,
  ) {
    return this.viewHistoryService.getHistory(
      req.user.userId,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  clearHistory(@Request() req: { user: { userId: number } }) {
    return this.viewHistoryService.clearHistory(req.user.userId);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  removeView(
    @Request() req: { user: { userId: number } },
    @Param('slug') slug: string,
  ) {
    return this.viewHistoryService.removeView(req.user.userId, slug);
  }
}

