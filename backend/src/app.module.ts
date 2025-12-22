import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ArticlesModule } from './articles/articles.module';
import { TtsModule } from './tts/tts.module';

@Module({
  imports: [UsersModule, AuthModule, CategoriesModule, ArticlesModule, TtsModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule { }


