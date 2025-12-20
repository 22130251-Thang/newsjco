import { Link } from 'react-router-dom';
import type { Article } from '../types/article.type';

interface EconomicCardProps {
    article: Article;
}

export const EconomicCard = ({ article }: EconomicCardProps) => {
    return (
        <Link
            to={`/${article.category}/${article.slug}`}
            className="min-w-[280.8px] min-h-[202px]"
        >
            <div className="aspect-video overflow-hidden mb-3">
                <img
                    src={article.image}
                    alt={article.title}
                    width={280}
                    height={156}
                />
            </div>
            <h3 className="text-[15px] font-bold leading-[1.4] hover:text-[#cc0000] transition-colors line-clamp-3 text-gray-500">
                {article.title}
            </h3>
        </Link>
    );
};
