import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as crypto from 'crypto';
import gTTS from 'gtts';

interface TaskStatus {
  id: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  buffer?: Buffer;
  error?: string;
  createdAt: number;
}

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly taskMap = new Map<string, TaskStatus>();
  private readonly taskTimeout = 60000; // 60 seconds

  constructor() {
    // Cleanup expired tasks every 30 seconds
    setInterval(() => this.cleanupExpiredTasks(), 30000);
  }

  generateTaskId(): string {
    return crypto.randomBytes(8).toString('hex');
  }

  generateAudioAsync(
    slug: string,
    title?: string,
    description?: string,
    fullContent?: string,
  ): { taskId: string; status: string } {
    const taskId = this.generateTaskId();
    
    // Store task with pending status
    this.taskMap.set(taskId, {
      id: taskId,
      status: 'pending',
      createdAt: Date.now(),
    });

    // Start generation in background (without await)
    this.generateInBackground(taskId, slug, title, description, fullContent);

    return { taskId, status: 'pending' };
  }

  private async generateInBackground(
    taskId: string,
    slug: string,
    title?: string,
    description?: string,
    fullContent?: string,
  ): Promise<void> {
    try {
      const task = this.taskMap.get(taskId);
      if (!task) return;

      task.status = 'generating';

      const textParts: string[] = [];
      if (title) textParts.push(title);
      if (description) textParts.push(description);
      if (fullContent) textParts.push(fullContent);

      const combinedText = textParts.join('. ');
      const cleanedText = this.cleanText(combinedText);

      this.logger.log(`[${taskId}] Generating TTS audio for slug: ${slug}`);

      const buffer = await this.generateAudioBuffer(cleanedText);

      task.buffer = buffer;
      task.status = 'ready';
      this.logger.log(`[${taskId}] TTS audio generated successfully, size: ${buffer.length} bytes`);
    } catch (error) {
      const task = this.taskMap.get(taskId);
      if (task) {
        task.status = 'error';
        task.error = error instanceof Error ? error.message : 'Unknown error';
      }
      this.logger.error(`[${taskId}] TTS generation failed: ${error}`);
    }
  }

  getTaskStatus(taskId: string): { status: string; error?: string } {
    const task = this.taskMap.get(taskId);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    if (task.status === 'error') {
      return { status: 'error', error: task.error };
    }

    return { status: task.status };
  }

  streamAudio(taskId: string, res: Response): void {
    const task = this.taskMap.get(taskId);
    
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    if (task.status !== 'ready') {
      throw new HttpException('Audio not ready', HttpStatus.BAD_REQUEST);
    }

    if (!task.buffer) {
      throw new HttpException('Buffer not available', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', task.buffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    
    const range = res.req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : task.buffer.length - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${task.buffer.length}`,
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      });
      res.end(task.buffer.slice(start, end + 1));
    } else {
      res.end(task.buffer);
    }
  }

  private async generateAudioBuffer(text: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const gtts = new gTTS(text, 'vi');
        const chunks: Buffer[] = [];

        gtts.stream()
          .on('data', (chunk: Buffer) => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks)))
          .on('error', (error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);
  }

  private cleanupExpiredTasks(): void {
    const now = Date.now();
    const expiredTasks = Array.from(this.taskMap.entries())
      .filter(([_, task]) => now - task.createdAt > this.taskTimeout)
      .map(([id]) => id);

    expiredTasks.forEach((taskId) => {
      this.taskMap.delete(taskId);
      this.logger.log(`[${taskId}] Task expired and removed`);
    });
  }
}
