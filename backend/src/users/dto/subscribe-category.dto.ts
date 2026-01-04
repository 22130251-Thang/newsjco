import { IsString, IsNotEmpty } from 'class-validator';

export class SubscribeCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Slug danh mục không được để trống' })
  categorySlug: string;
}

export class UnsubscribeCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Slug danh mục không được để trống' })
  categorySlug: string;
}
