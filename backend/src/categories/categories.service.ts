import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Category } from 'src/types/category.type';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll(): Category[] {
    return this.databaseService.findAll<Category>('categories');
  }

  findOne(id: number): Category {
    return this.databaseService.findById<Category>('categories', id);
  }

  findBySlug(slug: string): Category {
    const category = this.databaseService.findOneBy<Category>(
      'categories',
      'slug',
      slug,
    );
    if (!category) {
      throw new NotFoundException(`Category not found with slug: ${slug}`);
    }
    return category;
  }

  create(createCategoryDto: CreateCategoryDto): Category {
    const now = new Date().toISOString();
    const categoryData = {
      ...createCategoryDto,
      createdAt: now,
      updatedAt: now,
    };
    return this.databaseService.create<Category>('categories', categoryData);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto): Category {
    const updateData = {
      ...updateCategoryDto,
      updatedAt: new Date().toISOString(),
    };
    return this.databaseService.update<Category>('categories', id, updateData);
  }

  remove(id: number): Category {
    return this.databaseService.remove<Category>('categories', id);
  }
}
