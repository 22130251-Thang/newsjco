import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Slug bài viết không được để trống' })
  slug: string;

  @IsString()
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  content: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
