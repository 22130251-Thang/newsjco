import { useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { fetchReactionCount, toggleArticleReaction } from '../../lib/store/slices/reactionSlice';
import type { ReactionType } from '../../types/reaction.type';

interface ArticleReactionsProps {
  slug: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const ArticleReactions = ({
  slug,
  size = 'md',
  showCount = true
}: ArticleReactionsProps) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const reactionData = useAppSelector((state) => state.reactions. reactions[slug]);
  const isLoading = useAppSelector((state) => state.reactions.loading[slug]);

  useEffect(() => {
    dispatch(fetchReactionCount({ slug, userId: user?. id }));
  }, [dispatch, slug, user?. id]);

  const handleReaction = (type: ReactionType) => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thực hiện thao tác này! ');
      return;
    }
    dispatch(toggleArticleReaction({ slug, type }));
  };

  const likes = reactionData?. likes ??  0;
  const dislikes = reactionData?. dislikes ?? 0;
  const userReaction = reactionData?.userReaction;

  const sizeClasses = {
    sm: { icon: 16, text: 'text-xs', padding: 'px-2 py-1', gap: 'gap-1' },
    md: { icon: 20, text: 'text-sm', padding: 'px-3 py-1. 5', gap: 'gap-1.5' },
    lg: { icon: 24, text: 'text-base', padding: 'px-4 py-2', gap: 'gap-2' },
  };

  const { icon: iconSize, text: textClass, padding, gap } = sizeClasses[size];

  return (
    <div className={`flex items-center ${gap}`}>
      <button
        onClick={() => handleReaction('like')}
        disabled={isLoading}
        className={`
          flex items-center ${gap} ${padding} rounded-full
          transition-all duration-200 ease-in-out
          ${userReaction === 'like'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-500'
            : 'bg-gray-100 dark: bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-green-50 dark: hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={isAuthenticated ? 'Thích bài viết' : 'Đăng nhập để thích'}
      >
        {isLoading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <ThumbsUp
            size={iconSize}
            className={userReaction === 'like' ? 'fill-current' : ''}
          />
        )}
        {showCount && (
          <span className={`font-medium ${textClass}`}>
            {likes}
          </span>
        )}
      </button>

      <button
        onClick={() => handleReaction('dislike')}
        disabled={isLoading}
        className={`
          flex items-center ${gap} ${padding} rounded-full
          transition-all duration-200 ease-in-out
          ${userReaction === 'dislike'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark: text-red-400 border-2 border-red-500'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={isAuthenticated ? 'Không thích bài viết' : 'Đăng nhập để bày tỏ'}
      >
        {isLoading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <ThumbsDown
            size={iconSize}
            className={userReaction === 'dislike' ? 'fill-current' : ''}
          />
        )}
        {showCount && (
          <span className={`font-medium ${textClass}`}>
            {dislikes}
          </span>
        )}
      </button>
    </div>
  );
};