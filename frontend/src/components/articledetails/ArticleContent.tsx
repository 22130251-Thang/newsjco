import type { Article } from "../../types/article.type";

interface ArticleContentProps {
    article: Article;
}

export const ArticleContent = ({ article }: ArticleContentProps) => (
    <section
        className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-red-600"
        dangerouslySetInnerHTML={{ __html: article.fullContent || article.content }}
    />
);
