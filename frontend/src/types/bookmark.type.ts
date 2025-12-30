import { Article } from './article.type';

export interface Bookmark {
  id: number;
  userId: number;
  articleSlug: string;
  articleTitle: string;
  articleImage: string;
  articleCategory: string;
  createdAt: string;
}

export interface BookmarkWithArticle {
  bookmark: Bookmark;
  article: Article | null;
}

export interface ToggleBookmarkResponse {
  isBookmarked:  boolean;
  message: string;
}

export interface CheckBookmarkResponse {
  isBookmarked: boolean;
}