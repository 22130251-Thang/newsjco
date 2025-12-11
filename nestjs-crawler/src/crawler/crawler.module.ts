import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { RssFeedFetcher } from './fetchers/rss-feed.fetcher';
import { ArticleContentExtractor } from './extractors/article-content.extractor';
import { JsonFileExporter } from './exporters/json-file.exporter';

@Module({
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    RssFeedFetcher,
    ArticleContentExtractor,
    JsonFileExporter,
  ],
})
export class CrawlerModule {}
