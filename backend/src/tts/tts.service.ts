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

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly storagePath = path.join(process.cwd(), 'data', 'tts');
  private readonly apiKey = 'c6489e80-c6e8-46f8-b20e-f95cea10ea57';
  private readonly apiHost = 'api.ttsforfree.com';
  private readonly defaultVoice =
    'v1:YPj2X6j04RZcJdGzo-CC0GBpkJ985PD5X_VWU_nJkNzppGtbnxJL-dU_hglv';

  constructor() {
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(this.storagePath)) {
      this.logger.log(`Creating storage directory at ${this.storagePath}`);
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async createOrGetAudio(
    slug: string,
    text: string,
  ): Promise<{ path: string; created: boolean }> {
    const fileName = `${slug}.mp3`;
    const localPath = path.join(this.storagePath, fileName);

    if (fs.existsSync(localPath)) {
      this.logger.log(`Cache hit for ${fileName}. Serving from local storage.`);
      return { path: `/tts/${fileName}`, created: false };
    }

    this.logger.log(`Cache miss for ${fileName}. Requesting new TTS job.`);
    const job = await this._createApiJob(text);

    if (job.Status === 'SUCCESS' && job.Data) {
        this.logger.log(`API has a cached version: ${job.Data}. Downloading...`);
        await this._downloadAudio(job.Data, localPath);
        return { path: `/tts/${fileName}`, created: true };
    }

    if (!job.Data) {
        throw new HttpException('Failed to create TTS job: No Job ID returned.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    this.logger.log(`Polling for job ID: ${job.Data}`);
    const finalFileName = await this._pollJobStatus(job.Data);

    this.logger.log(`Job finished. Downloading ${finalFileName} to ${localPath}`);
    await this._downloadAudio(finalFileName, localPath);

    return { path: `/tts/${fileName}`, created: true };
  }

  async streamAudio(filename: string, res: Response) {
    const filePath = path.join(this.storagePath, filename);

    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }


  private _createApiJob(text: string): Promise<{ Data: string, Status: string }> {
    const postData = JSON.stringify({
      Texts: text,
      Voice: this.defaultVoice,
      Pitch: 0,
      ConnectionId: '',
      CallbackUrl: '',
    });

    const options: https.RequestOptions = {
      hostname: this.apiHost,
      path: '/api/tts/createby',
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    return this._httpsRequest(options, postData);
  }

  private _pollJobStatus(jobId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const options: https.RequestOptions = {
            hostname: this.apiHost,
            path: `/api/tts/status/${jobId}`,
            method: 'GET',
            headers: { 'X-API-Key': this.apiKey },
          };

          const statusResult = await this._httpsRequest(options);

          if (statusResult.Status === 'SUCCESS') {
            clearInterval(interval);
            resolve(statusResult.Data); // Returns the final file name
          } else if (statusResult.Status === 'ERROR') {
            clearInterval(interval);
            reject(
              new HttpException(
                `TTS job failed: ${statusResult.Message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }
          // Otherwise, continue polling
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 5000); // Poll every 5 seconds as recommended
    });
  }

  private _downloadAudio(fileName: string, localPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: https.RequestOptions = {
        hostname: this.apiHost,
        path: `/api/tts/StreamFile?filename=${fileName}`,
        method: 'GET',
      };

      const request = https.get(options, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new HttpException(
              `Failed to download audio file. Status: ${res.statusCode}`,
              HttpStatus.BAD_GATEWAY,
            ),
          );
          return;
        }

        const fileStream = fs.createWriteStream(localPath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      });

      request.on('error', (err) => {
        fs.unlink(localPath, () => reject(err)); 
      });
    });
  }

  private _httpsRequest(
    options: https.RequestOptions,
    postData?: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const statusCode = res.statusCode ?? 500;
            if (statusCode >= 200 && statusCode < 300) {
              resolve(JSON.parse(data));
            } else {
              reject(
                new HttpException(
                  `API Error: ${data}`,
                  statusCode,
                ),
              );
            }
          } catch (e) {
            reject(new HttpException('Failed to parse API response', HttpStatus.INTERNAL_SERVER_ERROR));
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      if (postData) {
        req.write(postData);
      }

      req.end();
    });
  }
}