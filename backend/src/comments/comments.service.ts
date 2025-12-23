import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ArticlesService } from 'src/articles/articles.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BaseRecord } from 'src/types/baserecord.type';
import { UsersService } from 'src/users/users.service';

export interface Comment extends BaseRecord {
    articleGuid: string;
    userId: number;
    content: string;
    likes: number;
    dislikes: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable()
export class CommentsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly articlesService: ArticlesService,
        private readonly usersService: UsersService,
    ) { }

    async create(createCommentDto: CreateCommentDto) {
        const article = this.articlesService.findBySlug(createCommentDto.slug);
        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const newComment = {
            articleGuid: article.guid,
            userId: createCommentDto.userId,
            content: createCommentDto.content,
            likes: 0,
            dislikes: 0,
            status: 'approved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const savedComment = this.databaseService.create<Comment>('comments', newComment);
        const user = this.usersService.findOne(savedComment.userId);
        return { ...savedComment, user };
    }

    async findByArticleSlug(slug: string) {
        const article = this.articlesService.findBySlug(slug);
        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const allComments = this.databaseService.findAll<Comment>('comments');
        const articleComments = allComments.filter(
            (comment) => comment.articleGuid === article.guid,
        );

        return articleComments.map((comment) => {
            const user = this.usersService.findOne(comment.userId);
            return { ...comment, user };
        });
    }
}
