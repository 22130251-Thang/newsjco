import { useEffect } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import { toggleArticleBookmark, checkIsBookmarked } from '../lib/store/slices/bookmarkSlice';
import { useNavigate } from 'react-router-dom';

interface BookmarkButtonProps {
  slug: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BookmarkButton = ({
  slug,
  size = 'md',
  showText = false,
  className = '',
}:  BookmarkButtonProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { bookmarkedSlugs, toggleLoading } = useAppSelector((state) => state.bookmarks);

  const isBookmarked = bookmarkedSlugs.has(slug);
  const isLoading = toggleLoading[slug] || false;

  useEffect(() => {
    if (isAuthenticated && slug) {
      dispatch(checkIsBookmarked(slug));
    }
  }, [dispatch, isAuthenticated, slug]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (! isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(toggleArticleBookmark(slug));
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 rounded-full transition-all duration-200
        ${sizeClasses[size]}
        ${isBookmarked
          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' :  'cursor-pointer'}
        ${className}
      `}
      title={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
    >
      {isLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck size={iconSizes[size]} className="fill-current" />
      ) : (
        <Bookmark size={iconSizes[size]} />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isBookmarked ? 'Đã lưu' : 'Lưu bài'}
        </span>
      )}
    </button>
  );
};