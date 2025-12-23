import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly apiKey = 'f1f42de3-7985-4478-a0c8-8d1468c384ce';
  private readonly apiHost = 'api.ttsforfree.com';
  private readonly storagePath = path.join(process.cwd(), 'data', 'tts');
  private readonly defaultVoice =
    'v1:o8v2E5HAj_zW0Zn2DMp8VJGA6Udz_46V1nHU1P4naSyjD2_E1joZLno4zWA';

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
      return { audioUrl: `/tts/${fileName}`, cached: true };
    }
    

    const job = await this.createApiJob(cleanedText);
    this.logger.log(`TTS job created: ${JSON.stringify(job)}`);

    if (job.Status === 'SUCCESS' && job.Data) {
      this.logger.log(`TTS job success (cache hit), downloading: ${job.Data}`);
      await this.downloadAudio(job.Data, localPath);
      return { audioUrl: `/tts/${fileName}`, cached: false };
    }

    if (job.Status === 'PENDING' && job.Id) {
      this.logger.log(`TTS job pending, polling for status: ${job.Id}`);
      const finalFileName = await this.pollJobStatus(job.Id);
      this.logger.log(`TTS polling finished, downloading: ${finalFileName}`);
      await this.downloadAudio(finalFileName, localPath);
      return { audioUrl: `/tts/${fileName}`, cached: false };
    }
    this.logger.error(`TTS DATA = ${job.Data}`);
    throw new HttpException(
      job.Message || 'TTS job creation failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
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

  private createApiJob(text: string): Promise<any> {
    const postData = JSON.stringify({
      Texts: text,
      Voice: this.defaultVoice,
      Pitch: 0,
      ConnectionId: '',
      CallbackUrl: '',
    });

    return this.httpsRequest(
      {
        hostname: this.apiHost,
        path: '/api/tts/createby',
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      postData,
    );
  }

  private pollJobStatus(jobId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 10;

      const interval = setInterval(async () => {
        try {
          const result = await this.httpsRequest({
            hostname: this.apiHost,
            path: `/api/tts/status/${jobId}`,
            method: 'GET',
            headers: {
              'X-API-Key': this.apiKey,
            },
          });

          if (result.Status === 'SUCCESS' && result.Data) {
            clearInterval(interval);
            resolve(result.Data);
          }

          if (result.Status === 'ERROR') {
            clearInterval(interval);
            reject(
              new HttpException(
                result.Message || 'TTS job failed',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }

          if (++attempts >= maxAttempts) {
            clearInterval(interval);
            reject(
              new HttpException(
                'TTS job timeout',
                HttpStatus.GATEWAY_TIMEOUT,
              ),
            );
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 5000);
    });
  }
private downloadAudio(fileRef: string, localPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let url: string;

    if (fileRef.startsWith('http')) {
      url = fileRef;
    } else if (fileRef.startsWith('/')) {
      url = `https://${this.apiHost}${fileRef}`;
    } else {
      url = `https://${this.apiHost}/api/tts/StreamFile?filename=${encodeURIComponent(fileRef)}`;
    }

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(
          new HttpException(
            `Download failed (${res.statusCode})`,
            HttpStatus.BAD_GATEWAY,
          ),
        );
        return;
      }

      const fileStream = fs.createWriteStream(localPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => resolve());
    }).on('error', reject);
  });
}


  private httpsRequest(
    options: https.RequestOptions,
    postData?: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(
              new HttpException(
                'Invalid API response',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }
        });
      });

      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }
}
