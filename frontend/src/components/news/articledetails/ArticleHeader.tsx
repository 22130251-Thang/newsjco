import { Calendar, User, Clock, Share2 } from "lucide-react";
import type { Article } from "../../../types/article.type";
import TTSButton from "../../shared/TTSButton";
import { BookmarkButton } from "../../BookmarkButton";
import { ArticleReactions } from "../../reactions/ArticleReactions";

interface ArticleHeaderProps {
  article: Article;
  slug?: string;
}

export const ArticleHeader = ({ article, slug }: ArticleHeaderProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    const title = article.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancel -> ignore
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      alert("Đã copy link bài viết!");
    } catch {
      alert("Không thể chia sẻ/copy link. Bạn thử copy thủ công nhé.");
    }
  };

  return (
    <header className="mb-10">
      {/* Category Label (Optional visual enhancement) */}
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-block px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold tracking-wider uppercase rounded-full">
          Công Nghệ
        </span>
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 font-heading tracking-tight">
        {article.title}
      </h1>

      <ArticleMeta article={article} slug={slug} onShare={handleShare} />

      {/* Improved Action Bar: TTS and Reactions separated nicely */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex-shrink-0">
          <TTSButton
            slug={article.slug}
            title={article.title}
            description={article.description}
            fullContent={article.fullContent || article.content}
          />
        </div>

        {slug && (
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <ArticleReactions slug={slug} />
          </div>
        )}
      </div>

      {article.description && (
        <p className="text-xl md:text-2xl font-serif font-medium text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
          {article.description}
        </p>
      )}
    </header>
  );
};

type ArticleMetaProps = {
  article: Article;
  slug?: string;
  onShare: () => void;
};

const ArticleMeta = ({ article, slug, onShare }: ArticleMetaProps) => (
  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-700 py-4 mb-6">
    <div className="flex items-center gap-1">
      <User size={14} className="text-red-500" />
      <span className="font-bold text-gray-800 dark:text-gray-200 uppercase">
        {article.author || "Báo Tin Tức"}
      </span>
    </div>

    <div className="flex items-center gap-1">
      <Calendar size={14} />
      <span>{new Date(article.pubDate).toLocaleDateString("vi-VN")}</span>
    </div>

    <div className="flex items-center gap-1">
      <Clock size={14} />
      <span>
        {new Date(article.pubDate).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>

    <div className="ml-auto flex items-center gap-3">
      {slug && <BookmarkButton slug={slug} size="sm" showText />}

      <button
        type="button"
        onClick={onShare}
        className="p-1.5 transition-colors hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
        title="Chia sẻ bài viết"
        aria-label="Chia sẻ bài viết"
      >
        <Share2 size={16} />
      </button>
    </div>
  </div>
);
