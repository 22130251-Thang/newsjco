import { Link } from 'react-router-dom';
import type { Article } from '../types/article.type';

interface EconomicCardProps {
    article: Article;
}

export const EconomicCard = ({ article }: EconomicCardProps) => {
    return (
        <Link
            to={`/${article.category}/${article.slug}`}
            className="min-w-[280.8px] min-h-[202px] group"
        >
            <div className="aspect-video overflow-hidden mb-3 bg-gray-300 dark:bg-gray-700">
                <img
                    src={article.image}
                    alt={article.title}
                    width={280}
                    height={156}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
            </div>
            <h3 className="text-[15px] font-bold leading-[1.4] text-gray-800 dark:text-gray-200 group-hover:text-[#cc0000] dark:group-hover:text-orange-300 transition-colors line-clamp-3">
                {article.title}
            </h3>
        </Link>
    );
};
