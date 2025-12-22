import { Link } from "react-router-dom";
import type { Article } from "../types/article.type";

interface CategoryBlockProps {
  category: string;
  articles: Article[];
}

export const CategoryBlock = ({ category, articles }: CategoryBlockProps) => {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const subArticles = articles.slice(1, 4);

  const formatCategoryName = (slug: string) => {
    return slug.replace(/-/g, " ").toUpperCase();
  };

  return (
    <div className="bg-gray-100 p-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            to={`/${category}`}
            className="text-primary font-bold text-sm uppercase pl-3 border-l-4 border-primary leading-none hover:text-red-700 transition-colors"
          >
            {formatCategoryName(category)}
          </Link>
          <div className="hidden md:flex gap-4 text-xs text-gray-500"></div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Link to={`/${mainArticle.category}/${mainArticle.slug}`} className="flex gap-4 group">
          <div className="w-[260px] h-[160px] overflow-hidden bg-gray-100">
            <img
              src={mainArticle.image}
              alt={mainArticle.title}
              className="w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold font-heading text-gray-800 mb-2 leading-tight transition-colors">
              {mainArticle.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3 text-justify">
              {mainArticle.description}
            </p>
          </div>
        </Link>

        {subArticles.length > 0 && (
          <div className="space-y-2 mt-2">
            {subArticles.map((article, index) => (
              <Link
                key={`${category}-${article.id || article.slug}-${index}`}
                to={`/${article.category}/${article.slug}`}
                className="block transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold text-lg leading-none">
                    •
                  </span>
                  <span className="text-xs font-medium font-heading text-gray-700">
                    {article.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
