import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'Từ khóa tìm kiếm không được để trống' })
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Trang phải lớn hơn 0' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Số lượng kết quả phải lớn hơn 0' })
  limit?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
