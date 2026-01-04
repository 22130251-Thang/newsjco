export const COMMENTS_TABLE = 'comments';
export const COMMENT_REACTIONS_TABLE = 'comment_reactions';

export const COMMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
