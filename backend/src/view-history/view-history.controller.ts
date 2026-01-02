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
@UseGuards(JwtAuthGuard)
export class ViewHistoryController {
    constructor(private readonly viewHistoryService: ViewHistoryService) { }

    @Post(':slug')
    addView(
        @Request() req: { user: { userId: number } },
        @Param('slug') slug: string,
    ) {
        return this.viewHistoryService.addView(req.user.userId, slug);
    }

    @Get()
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
    clearHistory(@Request() req: { user: { userId: number } }) {
        return this.viewHistoryService.clearHistory(req.user.userId);
    }

    @Delete(':slug')
    removeView(
        @Request() req: { user: { userId: number } },
        @Param('slug') slug: string,
    ) {
        return this.viewHistoryService.removeView(req.user.userId, slug);
    }
}
