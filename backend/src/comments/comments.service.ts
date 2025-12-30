import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ArticlesService } from 'src/articles/articles.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Comment, CommentWithUser, ReactionType, CommentReaction } from './comments.interface';
import {
  COMMENTS_TABLE,
  COMMENT_STATUS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  COMMENT_REACTIONS_TABLE,
} from './comments.constants';

import { AiService } from 'src/ai/ai.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class CommentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly aiService: AiService,
    private readonly notificationsGateway: NotificationsGateway,
  ) { }


  async create(createCommentDto: CreateCommentDto): Promise<CommentWithUser> {
    const article = this.getArticleOrThrow(createCommentDto.slug);
    const savedComment = this.saveComment(createCommentDto, article.slug);

    this.notifyParentCommentOwner(savedComment, createCommentDto.slug, article.category);

    if (createCommentDto.content.toLowerCase().includes('@ai summarize this')) {
      this.handleAiSummarization(savedComment.id, createCommentDto.slug, article.category, article.content || 'Article content not available.');
    }

    const commentWithUser = this.attachUserToComment(savedComment);
    this.notificationsGateway.sendCommentToArticle(createCommentDto.slug, commentWithUser);

    return commentWithUser;
  }

  private async handleAiSummarization(replyToId: number | string, articleSlug: string, categorySlug: string, articleContent: string) {
    const summary = await this.aiService.summarize(articleContent);
    if (!summary) return;

    let aiUser;
    try {
      aiUser = this.usersService.findByUserName('aibot');
    } catch (e) {
      aiUser = null;
    }
    const aiUserId = aiUser ? aiUser.id : 999;

    const now = new Date().toISOString();
    const aiComment = this.databaseService.create<Comment>(COMMENTS_TABLE, {
      articleSlug,
      userId: aiUserId as number,
      content: summary,
      likes: 0,
      dislikes: 0,
      status: COMMENT_STATUS.APPROVED,
      createdAt: now,
      updatedAt: now,
      parentId: Number(replyToId),
    });

    const aiCommentWithUser = this.attachUserToComment(aiComment);
    this.notificationsGateway.sendCommentToArticle(articleSlug, aiCommentWithUser);

    const originalComment = this.databaseService.findById<Comment>(COMMENTS_TABLE, replyToId);
    if (originalComment) {
      this.sendNotification(originalComment.userId, 'reply', aiUserId as number, articleSlug, categorySlug, aiComment.id as number);
    }
  }


  async findByArticleSlug(
    slug: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
    userId?: number,
  ) {
    const article = this.getArticleOrThrow(slug);
    const articleComments = this.getCommentsByArticle(article.slug);

    const { topLevelComments, replies } = this.separateTopLevelAndReplies(articleComments);
    const paginatedTopLevel = this.paginateComments(topLevelComments, page, limit);
    const relatedReplies = this.getRepliesForComments(replies, paginatedTopLevel);

    const allComments = [...paginatedTopLevel, ...relatedReplies];

    const userReactions = userId
      ? this.databaseService.findAll<CommentReaction>(COMMENT_REACTIONS_TABLE).filter(r => r.userId === userId)
      : [];

    const commentsWithUser = allComments.map((comment) => {
      const commentWithUser = this.attachUserToComment(comment);
      if (userId) {
        const reaction = userReactions.find(r => r.commentId === comment.id);
        commentWithUser.userReaction = reaction ? reaction.type : null;
      }
      return commentWithUser;
    });

    return {
      data: commentsWithUser,
      total: topLevelComments.length,
      page,
      limit,
    };
  }

  async reactToComment(
    commentId: number,
    userId: number,
    type: ReactionType,
    articleSlug: string,
    categorySlug: string,
  ) {
    const comment = this.databaseService.findById<Comment>(COMMENTS_TABLE, commentId);
    const existing = this.findUserReaction(commentId, userId);

    let { likes, dislikes } = comment;
    let userReaction: ReactionType | null = type;

    if (existing?.type === type) {
      this.databaseService.remove(COMMENT_REACTIONS_TABLE, existing.id);
      type === 'like' ? likes-- : dislikes--;
      userReaction = null;
    } else if (existing) {
      this.databaseService.update(COMMENT_REACTIONS_TABLE, existing.id, { type });
      if (type === 'like') { likes++; dislikes--; }
      else { likes--; dislikes++; }
      this.notifyReaction(comment, userId, type, articleSlug, categorySlug);
    } else {
      this.databaseService.create(COMMENT_REACTIONS_TABLE, { commentId, userId, type });
      type === 'like' ? likes++ : dislikes++;
      this.notifyReaction(comment, userId, type, articleSlug, categorySlug);
    }

    const updated = this.databaseService.update<Comment>(COMMENTS_TABLE, commentId, { likes, dislikes });
    return { ...this.attachUserToComment(updated), userReaction };
  }


  private getArticleOrThrow(slug: string) {
    const article = this.articlesService.findBySlug(slug);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  private saveComment(dto: CreateCommentDto, articleSlug: string): Comment {
    const now = new Date().toISOString();
    return this.databaseService.create<Comment>(COMMENTS_TABLE, {
      articleSlug,
      userId: dto.userId,
      content: dto.content,
      likes: 0,
      dislikes: 0,
      status: COMMENT_STATUS.APPROVED,
      createdAt: now,
      updatedAt: now,
      parentId: dto.parentId || null,
    });
  }


  private getCommentsByArticle(articleSlug: string): Comment[] {
    return this.databaseService
      .findAll<Comment>(COMMENTS_TABLE)
      .filter((comment) => comment.articleSlug === articleSlug)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private separateTopLevelAndReplies(allComments: Comment[]) {
    return {
      topLevelComments: allComments.filter((c) => !c.parentId),
      replies: allComments.filter((c) => !!c.parentId),
    };
  }

  private paginateComments(comments: Comment[], page: number, limit: number): Comment[] {
    return comments.slice((page - 1) * limit, page * limit);
  }

  private getRepliesForComments(replies: Comment[], visibleParents: Comment[]): Comment[] {
    const visibleIds = new Set(visibleParents.map((c) => c.id as number));
    const result: Comment[] = [];
    const includedIds = new Set<number>(visibleIds);

    let added;
    do {
      added = false;
      for (const r of replies) {
        if (r.parentId && includedIds.has(r.parentId) && !includedIds.has(r.id as number)) {
          result.push(r);
          includedIds.add(r.id as number);
          added = true;
        }
      }
    } while (added);

    return result;
  }


  private notifyParentCommentOwner(comment: Comment, articleSlug: string, categorySlug: string) {
    if (!comment.parentId) return;
    const parent = this.databaseService.findById<Comment>(COMMENTS_TABLE, comment.parentId);
    if (!parent || parent.userId === comment.userId) return;

    this.sendNotification(parent.userId, 'reply', comment.userId, articleSlug, categorySlug, comment.id as number);
  }

  private notifyReaction(comment: Comment, reactorId: number, type: ReactionType, articleSlug: string, categorySlug: string) {
    if (comment.userId === reactorId) return;
    this.sendNotification(comment.userId, 'reaction', reactorId, articleSlug, categorySlug, comment.id as number, type);
  }

  private sendNotification(targetId: number, type: 'reply' | 'reaction', actorId: number, slug: string, cat: string, commentId: number, reactionType?: ReactionType) {
    const actor = this.usersService.findOne(actorId);
    const actorName = actor?.displayName || actor?.username || 'Ai đó';
    const action = type === 'reply' ? 'đã trả lời bình luận' : `đã ${reactionType === 'like' ? 'thích' : 'không thích'} bình luận`;

    this.notificationsService.create({
      userId: targetId,
      type,
      message: `${actorName} ${action} của bạn`,
      articleSlug: slug,
      categorySlug: cat,
      commentId,
    });
  }

  private findUserReaction(commentId: number, userId: number): CommentReaction | undefined {
    return this.databaseService.findAll<CommentReaction>(COMMENT_REACTIONS_TABLE)
      .find(r => r.commentId === commentId && r.userId === userId);
  }

  private attachUserToComment(comment: Comment): CommentWithUser {
    return { ...comment, user: this.usersService.findOne(comment.userId) };
  }
}
