import { Calendar, User, Clock, Share2 } from "lucide-react";
import type { Article } from "../../types/article.type";
import TTSButton from "../TTSButton";

interface ArticleHeaderProps {
    article: Article;
}

export const ArticleHeader = ({ article }: ArticleHeaderProps) => (
    <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 font-heading">
            {article.title}
        </h1>

        <ArticleMeta article={article} />

        <div className="mb-4">
            <TTSButton text={article.fullContent || article.content || article.description || article.title} />
        </div>

        {article.description && (
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300 leading-relaxed italic mb-8 border-l-4 border-red-600 pl-4 py-1">
                {article.description}
            </p>
        )}
    </header>
);

const ArticleMeta = ({ article }: ArticleHeaderProps) => (
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
            <button className="p-1.5 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                <Share2 size={16} />
            </button>
        </div>
    </div>
);

