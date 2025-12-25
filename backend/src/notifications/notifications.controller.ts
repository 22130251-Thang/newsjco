import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req: { user: { userId: number } }) {
    return this.notificationsService.findByUserId(req.user.userId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: { user: { userId: number } }) {
    return { count: this.notificationsService.getUnreadCount(req.user.userId) };
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: { user: { userId: number } }) {
    this.notificationsService.markAllAsRead(req.user.userId);
    return { success: true };
  }
}
