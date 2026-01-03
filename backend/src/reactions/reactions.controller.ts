import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ToggleReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService:  ReactionsService) {}

  @Get('article/:slug')
  getReactionCount(
    @Param('slug') slug: string,
    @Query('userId') userId?: string,
  ) {
    return this.reactionsService. getReactionCount(
      slug,
      userId ?  parseInt(userId) : undefined,
    );
  }

  @Post('article/:slug/toggle')
  @UseGuards(JwtAuthGuard)
  toggleReaction(
    @Param('slug') slug: string,
    @Body() toggleReactionDto: ToggleReactionDto,
    @Request() req,
  ) {
    const userId = req.user. id;
    const result = this.reactionsService.toggleReaction(
      slug,
      userId,
      toggleReactionDto.type,
    );

    const counts = this.reactionsService. getReactionCount(slug, userId);

    return {
      ... result,
      counts,
    };
  }
}