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

  @Post()
  async createTts(@Body() body: CreateTtsDto) {
    return this.ttsService.createOrGetAudio(body.slug, body.title, body.description, body.fullContent);
  }

  @Get(':filename')
  async streamAudio(@Param('filename') filename: string, @Res() res: Response) {
    return this.ttsService.streamAudio(filename, res);
  }
}
