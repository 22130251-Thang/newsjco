import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import gTTS from 'gtts';

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly storagePath = path.join(process.cwd(), 'data', 'tts');

  constructor() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async createOrGetAudio(
    slug: string,
    text: string,
  ): Promise<{ audioUrl: string; cached: boolean }> {
    const cleanedText = this.cleanText(text);
    const hash = this.hash(cleanedText);
    const fileName = `${slug}-${hash}.mp3`;
    const localPath = path.join(this.storagePath, fileName);

    if (fs.existsSync(localPath)) {
      this.logger.log(`TTS file found in cache: ${fileName}`);
      return { audioUrl: `/tts/${fileName}`, cached: true };
    }

    try {
      this.logger.log(`Generating TTS audio for slug: ${slug}`);
      await this.generateAudioWithEdgeTTS(cleanedText, localPath);
      this.logger.log(`TTS audio generated successfully: ${fileName}`);
      return { audioUrl: `/tts/${fileName}`, cached: false };
    } catch (error) {
      this.logger.error(`TTS generation failed: ${error.message}`, error.stack);
      throw new HttpException(
        'Failed to generate audio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  streamAudio(filename: string, res: Response) {
    const filePath = path.join(this.storagePath, filename);
    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', 404);
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    fs.createReadStream(filePath).pipe(res);
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);
  }

  private hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex').slice(0, 8);
  }

  private async generateAudioWithEdgeTTS(text: string, outputPath: string): Promise<void> {
    const gtts = new gTTS(text, 'vi'); // Tiếng Việt
    await gtts.save(outputPath);
  }
}
