import { ReactionType } from '../../types/reaction.type';

export class CreateReactionDto {
  articleSlug: string;
  userId: number;
  type: ReactionType;
}

export class ToggleReactionDto {
  type: ReactionType;
}
