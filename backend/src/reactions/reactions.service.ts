import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Reaction, ReactionCount, ReactionType } from '../types/reaction.type';

@Injectable()
export class ReactionsService {
  private readonly TABLE_NAME = 'reactions';

  constructor(private readonly databaseService: DatabaseService) {}

  toggleReaction(
    articleSlug: string,
    userId: number,
    type: ReactionType,
  ): { action: 'created' | 'removed' | 'changed'; reaction: Reaction | null } {
    const reactions = this.databaseService.findAll<Reaction>(this.TABLE_NAME);

    const existingIndex = reactions.findIndex(
      (r) => r.articleSlug === articleSlug && r.userId === userId,
    );

    if (existingIndex === -1) {
      const newReaction = this.databaseService.create<Reaction>(
        this.TABLE_NAME,
        {
          articleSlug,
          userId,
          type,
        } as Omit<Reaction, 'id'>,
      );

      return { action: 'created', reaction: newReaction };
    }

    const existingReaction = reactions[existingIndex];

    if (existingReaction.type === type) {
      this.databaseService.remove<Reaction>(
        this.TABLE_NAME,
        existingReaction.id,
      );
      return { action: 'removed', reaction: null };
    }

    const updatedReaction = this.databaseService.update<Reaction>(
      this.TABLE_NAME,
      existingReaction.id,
      { type, updatedAt: new Date().toISOString() },
    );

    return { action: 'changed', reaction: updatedReaction };
  }

  getReactionCount(articleSlug: string, userId?: number): ReactionCount {
    const reactions = this.databaseService.findAll<Reaction>(this.TABLE_NAME);

    const articleReactions = reactions.filter(
      (r) => r.articleSlug === articleSlug,
    );

    const likes = articleReactions.filter((r) => r.type === 'like').length;
    const dislikes = articleReactions.filter(
      (r) => r.type === 'dislike',
    ).length;

    let userReaction: ReactionType | null = null;
    if (userId) {
      const userReactionRecord = articleReactions.find(
        (r) => r.userId === userId,
      );
      userReaction = userReactionRecord?.type || null;
    }

    return { likes, dislikes, userReaction };
  }

  getUserReaction(articleSlug: string, userId: number): Reaction | null {
    const reactions = this.databaseService.findAll<Reaction>(this.TABLE_NAME);
    return (
      reactions.find(
        (r) => r.articleSlug === articleSlug && r.userId === userId,
      ) || null
    );
  }
}
