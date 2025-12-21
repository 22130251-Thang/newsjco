import { Module } from '@nestjs/common';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';

@Module({
  imports: [],
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}