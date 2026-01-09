import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
    @MinLength(1, { message: 'Nội dung bình luận không được để trống' })
    content: string;
}
