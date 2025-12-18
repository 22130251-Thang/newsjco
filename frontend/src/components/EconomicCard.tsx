import { Link } from 'react-router-dom';
import type { Article } from '../types/article.type';

interface EconomicCardProps {
    article: Article;
}

export const EconomicCard = ({ article }: EconomicCardProps) => {
    return (
        <Link
            to={`/${article.category}/${article.slug}`}
            className="shrink-0 w-[240px] md:w-[280px] group/card snap-start"
        >
            <div className="relative aspect-video overflow-hidden rounded-sm mb-3">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                />
            </div>
            <h3 className="text-[15px] font-bold leading-[1.4] text-gray-800 hover:text-[#cc0000] transition-colors line-clamp-3">
                {article.title}
            </h3>
        </Link>
    );
};
