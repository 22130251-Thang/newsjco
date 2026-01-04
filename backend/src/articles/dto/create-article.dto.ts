import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  pubDate: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsString()
  fullContent: string;

  @IsString()
  author: string;

  @IsString()
  source: string;

  @IsOptional()
  @IsBoolean()
  isFeatures?: boolean;

  @IsNumber()
  position: number;

  @IsString()
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  category: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsString()
  guid: string;
}
