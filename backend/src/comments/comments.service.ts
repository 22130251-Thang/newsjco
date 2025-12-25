import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ArticlesService } from 'src/articles/articles.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BaseRecord } from 'src/types/baserecord.type';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';

export interface Comment extends BaseRecord {
  articleGuid: string;
  userId: number;
  content: string;
  likes: number;
  dislikes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  parentId?: number;
}

@Injectable()
export class CommentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
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
      parentId: createCommentDto.parentId || null,
    };

    const savedComment = this.databaseService.create<Comment>(
      'comments',
      newComment,
    );

    if (savedComment.parentId) {
      const parentComment = this.databaseService.findById<Comment>(
        'comments',
        savedComment.parentId,
      );

      if (parentComment && parentComment.userId !== savedComment.userId) {
        const replierUser = this.usersService.findOne(savedComment.userId);
        const replierName =
          replierUser?.displayName || replierUser?.username || 'Ai đó';

        this.notificationsService.create({
          userId: parentComment.userId,
          type: 'reply',
          message: `${replierName} đã trả lời bình luận của bạn`,
          articleSlug: createCommentDto.slug,
          categorySlug: article.category,
          commentId: savedComment.id as number,
        });
      }
    }

    const user = this.usersService.findOne(savedComment.userId);
    return { ...savedComment, user };
  }

  async findByArticleSlug(slug: string, page: number = 1, limit: number = 10) {
    const article = this.articlesService.findBySlug(slug);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const allComments = this.databaseService.findAll<Comment>('comments');
    const articleComments = allComments
      .filter((comment) => comment.articleGuid === article.guid)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    const roots = articleComments.filter((c) => !c.parentId);
    const repliesBase = articleComments.filter((c) => !!c.parentId);

    const total = roots.length;
    const paginatedRoots = roots.slice((page - 1) * limit, page * limit);

    const rootIds = new Set(paginatedRoots.map((r) => r.id));
    const resultComments = [
      ...paginatedRoots,
      ...repliesBase.filter((reply) => {
        return reply.parentId && rootIds.has(reply.parentId);
      }),
    ];

    const data = resultComments.map((comment) => {
      const user = this.usersService.findOne(comment.userId);
      return { ...comment, user };
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
