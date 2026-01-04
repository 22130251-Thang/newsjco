import { IsString, IsNumber, IsNotEmpty, IsIn } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty({ message: 'Slug bài viết không được để trống' })
  articleSlug: string;

  @IsNumber()
  userId: number;

  @IsIn(['like', 'dislike'], { message: 'Loại reaction không hợp lệ' })
  type: 'like' | 'dislike';
}

export class ToggleReactionDto {
  @IsIn(['like', 'dislike'], { message: 'Loại reaction không hợp lệ' })
  type: 'like' | 'dislike';
}
