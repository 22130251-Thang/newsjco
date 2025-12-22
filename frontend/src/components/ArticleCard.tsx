import { Link } from "react-router-dom";
import type { Article } from "../types/article.type";

interface ArticleCardProps {
    article: Article;
    variant?: "horizontal" | "vertical";
    showBorder?: boolean;
    showCategory?: boolean;
    showDescription?: boolean;
    imageClassName?: string;
    containerClassName?: string;
}

export const ArticleCard = ({
    article,
    variant = "horizontal",
    showBorder = false,
    showCategory = false,
    showDescription = false,
    imageClassName = "",
    containerClassName = "",
}: ArticleCardProps) => {
    if (variant === "horizontal") {
        return (
            <Link
                to={`/${article.category}/${article.slug}`}
                className={`flex gap-4 py-4 ${showBorder ? "border-b border-gray-200" : ""} group ${containerClassName}`}
            >
                <div className={`shrink-0 overflow-hidden ${imageClassName || "w-[200px] h-[120px]"}`}>
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-start">
                    {showCategory && (
                        <span className="text-[#cc0000] text-xs uppercase font-medium mb-1.5">
                            {article.category.replace("-", " ")}
                        </span>
                    )}
                    <h3 className="text-[17px] font-bold font-heading leading-snug text-gray-800 transition-colors line-clamp-3 mb-2">
                        {article.title}
                    </h3>
                    {showDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed hidden sm:block">
                            {article.description || article.content?.substring(0, 150)}
                        </p>
                    )}
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/${article.category}/${article.slug}`}
            className={`flex flex-col group ${containerClassName}`}
        >
            <div className={`overflow-hidden mb-4 ${imageClassName}`}>
                <img
                    src={article.image || "/placeholder-article.jpg"}
                    alt={article.title}
                    className="w-full h-[180px] object-cover"
                />
            </div>
            {showCategory && (
                <span className="text-[#cc0000] text-xs uppercase font-medium mb-1.5">
                    {article.category.replace("-", " ")}
                </span>
            )}
            <h3 className="text-[17px] font-bold text-gray-900 leading-snug line-clamp-3 font-heading mb-2">
                {article.title}
            </h3>
            {showDescription && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {article.description || article.content?.substring(0, 150)}
                </p>
            )}
        </Link>
    );
};
