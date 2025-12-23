import type { Article } from "../../types/article.type";

interface ArticleContentProps {
    article: Article;
}

export const ArticleContent = ({ article }: ArticleContentProps) => (
    <section
        className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-red-600 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-orange-400"
        dangerouslySetInnerHTML={{ __html: article.fullContent || article.content }}
    />
);
