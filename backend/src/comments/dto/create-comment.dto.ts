export class CreateCommentDto {
  slug: string;
  content: string;
  userId: number;
  parentId?: number;
}
