import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TtsService } from './tts.service';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  async createTts(@Body() body: { slug: string; text: string }) {
    return this.ttsService.createOrGetAudio(body.slug, body.text);
  }

  @Get(':filename')
  async streamAudio(@Param('filename') filename: string, @Res() res: Response) {
    return this.ttsService.streamAudio(filename, res);
  }
}
