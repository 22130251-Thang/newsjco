import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  fetchReactionCount,
  toggleArticleReaction,
} from "../../lib/store/slices/reactionSlice";
import type { ReactionType } from "../../types/reaction.type";

interface ArticleReactionsProps {
  slug: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export const ArticleReactions = ({
  slug,
  size = "md",
  showCount = true,
}: ArticleReactionsProps) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const reactionData = useAppSelector((state) => state.reactions.reactions[slug]);
  const isLoading = !!useAppSelector((state) => state.reactions.loading[slug]);

  const [activeType, setActiveType] = useState<ReactionType | null>(null);

  useEffect(() => {
    dispatch(fetchReactionCount({ slug, userId: user?.id }));
  }, [dispatch, slug, user?.id]);

  useEffect(() => {
    if (!isLoading) setActiveType(null);
  }, [isLoading]);

  const handleReaction = (type: ReactionType) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thực hiện thao tác này!");
      return;
    }
    setActiveType(type);
    dispatch(toggleArticleReaction({ slug, type }));
  };

  const likes = reactionData?.likes ?? 0;
  const dislikes = reactionData?.dislikes ?? 0;
  const userReaction = reactionData?.userReaction;

  const sizeClasses = {
    sm: { icon: 16, text: "text-xs", padding: "px-3 py-1.5", gap: "gap-1.5" },
    md: { icon: 18, text: "text-sm", padding: "px-4 py-2", gap: "gap-2" },
    lg: { icon: 22, text: "text-base", padding: "px-5 py-2.5", gap: "gap-2.5" },
  } as const;

  const { icon: iconSize, text: textClass, padding, gap } = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3`}>
      {/* Like Button */}
      <button
        type="button"
        onClick={() => handleReaction("like")}
        disabled={isLoading}
        aria-pressed={userReaction === "like"}
        title={isAuthenticated ? "Thích bài viết" : "Đăng nhập để thích"}
        className={`
          flex items-center ${gap} ${padding} rounded-full cursor-pointer
          border transition-all duration-200 ease-in-out
          ${userReaction === "like"
            ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-500"
            : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          }
          disabled:opacity-50 disabled:cursor-default
        `}
      >
        {isLoading && activeType === "like" ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <ThumbsUp size={iconSize} className={userReaction === "like" ? "fill-current" : ""} />
        )}
        {showCount && <span className={`font-semibold ${textClass}`}>{likes}</span>}
      </button>

      {/* Dislike Button */}
      <button
        type="button"
        onClick={() => handleReaction("dislike")}
        disabled={isLoading}
        aria-pressed={userReaction === "dislike"}
        title={isAuthenticated ? "Không thích bài viết" : "Đăng nhập để bày tỏ"}
        className={`
          flex items-center ${gap} ${padding} rounded-full cursor-pointer
          border transition-all duration-200 ease-in-out
          ${userReaction === "dislike"
            ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-500"
            : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          }
          disabled:opacity-50 disabled:cursor-default
        `}
      >
        {isLoading && activeType === "dislike" ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <ThumbsDown
            size={iconSize}
            className={userReaction === "dislike" ? "fill-current" : ""}
          />
        )}
        {showCount && <span className={`font-semibold ${textClass}`}>{dislikes}</span>}
      </button>
    </div>
  );
};
