export class CreateCategoryDto {
  slug: string;
  name: string;
  description: string;
  parentId?: number | null;
}
