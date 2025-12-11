import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DATA_OUTPUT_DIR } from '../constants';
import { NewsCategory, UnifiedNewsItem } from '../types';


@Injectable()
export class JsonFileExporter {
  private readonly logger = new Logger(JsonFileExporter.name);
  private readonly outputDir: string;

  constructor() {
    this.outputDir = path.resolve(process.cwd(), DATA_OUTPUT_DIR);
    this.ensureOutputDir();
  }


  exportByCategory(category: NewsCategory, items: UnifiedNewsItem[]): string {
    const filename = `${category}.json`;
    const filePath = path.join(this.outputDir, filename);

    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
    this.logger.log(`Exported ${items.length} items to ${filePath}`);

    return filePath;
  }


  exportAll(items: UnifiedNewsItem[]): string {
    const filePath = path.join(this.outputDir, 'merged_news.json');

    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
    this.logger.log(`Exported ${items.length} items to ${filePath}`);

    return filePath;
  }


  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
}
