export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  children?: Category[];
}
