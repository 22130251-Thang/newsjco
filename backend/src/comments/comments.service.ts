import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ArticlesService } from 'src/articles/articles.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Comment, CommentWithUser } from './comments.interface';
import {
  COMMENTS_TABLE,
  COMMENT_STATUS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from './comments.constants';

@Injectable()
export class CommentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) { }


  async create(createCommentDto: CreateCommentDto): Promise<CommentWithUser> {
    const article = this.getArticleOrThrow(createCommentDto.slug);

    const savedComment = this.saveComment(createCommentDto, article.guid);

    this.notifyParentCommentOwner(savedComment, createCommentDto.slug, article.category);

    return this.attachUserToComment(savedComment);
  }


  async findByArticleSlug(
    slug: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
  ) {
    const article = this.getArticleOrThrow(slug);
    const articleComments = this.getCommentsByArticle(article.guid);

    const { topLevelComments, replies } = this.separateTopLevelAndReplies(articleComments);
    const paginatedTopLevel = this.paginateComments(topLevelComments, page, limit);
    const relatedReplies = this.getRepliesForComments(replies, paginatedTopLevel);

    const allComments = [...paginatedTopLevel, ...relatedReplies];
    const commentsWithUser = allComments.map((comment) => this.attachUserToComment(comment));

    return {
      data: commentsWithUser,
      total: topLevelComments.length,
      page,
      limit,
    };
  }


  private getArticleOrThrow(slug: string) {
    const article = this.articlesService.findBySlug(slug);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }


  private saveComment(dto: CreateCommentDto, articleGuid: string): Comment {
    const now = new Date().toISOString();

    const newComment = {
      articleGuid,
      userId: dto.userId,
      content: dto.content,
      likes: 0,
      dislikes: 0,
      status: COMMENT_STATUS.APPROVED,
      createdAt: now,
      updatedAt: now,
      parentId: dto.parentId || null,
    };

    return this.databaseService.create<Comment>(COMMENTS_TABLE, newComment);
  }

  private notifyParentCommentOwner(
    comment: Comment,
    articleSlug: string,
    categorySlug: string,
  ): void {
    if (!comment.parentId) return;

    const parentComment = this.databaseService.findById<Comment>(
      COMMENTS_TABLE,
      comment.parentId,
    );

    const isReplyToSelf = parentComment?.userId === comment.userId;
    if (!parentComment || isReplyToSelf) return;

    const replierUser = this.usersService.findOne(comment.userId);
    const replierName = replierUser?.displayName || replierUser?.username || 'Ai đó';

    this.notificationsService.create({
      userId: parentComment.userId,
      type: 'reply',
      message: `${replierName} đã trả lời bình luận của bạn`,
      articleSlug,
      categorySlug,
      commentId: comment.id as number,
    });
  }


  private attachUserToComment(comment: Comment): CommentWithUser {
    const user = this.usersService.findOne(comment.userId);
    return { ...comment, user };
  }


  private getCommentsByArticle(articleGuid: string): Comment[] {
    return this.databaseService
      .findAll<Comment>(COMMENTS_TABLE)
      .filter((comment) => comment.articleGuid === articleGuid)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private separateTopLevelAndReplies(comments: Comment[]) {
    return {
      topLevelComments: comments.filter((c) => !c.parentId),
      replies: comments.filter((c) => !!c.parentId),
    };
  }


  private paginateComments(comments: Comment[], page: number, limit: number): Comment[] {
    const startIndex = (page - 1) * limit;
    return comments.slice(startIndex, startIndex + limit);
  }

  private getRepliesForComments(replies: Comment[], topLevelComments: Comment[]): Comment[] {
    const topLevelIds = new Set(topLevelComments.map((c) => c.id));
    return replies.filter((reply) => reply.parentId && topLevelIds.has(reply.parentId));
  }
}
