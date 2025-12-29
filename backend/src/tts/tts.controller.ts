import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TtsService } from './tts.service';

interface CreateTtsDto {
  slug: string;
  title?: string;
  description?: string;
  fullContent?: string;
}

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post('generate')
  generateAudio(@Body() body: CreateTtsDto) {
    return this.ttsService.generateAudioAsync(body.slug, body.title, body.description, body.fullContent);
  }

  @Get('status/:taskId')
  getStatus(@Param('taskId') taskId: string) {
    return this.ttsService.getTaskStatus(taskId);
  }

  @Get('stream/:taskId')
  streamAudio(@Param('taskId') taskId: string, @Res() res: Response) {
    return this.ttsService.streamAudio(taskId, res);
  }
}
