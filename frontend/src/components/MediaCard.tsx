import { Video, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '../types/article.type';

interface MediaCardProps {
    article: Article;
}

export const MediaCard = ({ article }: MediaCardProps) => {

    return (
        <Link
            to={`/${article.category}/${article.slug}`}
            className="shrink-0 w-[240px] md:w-[275px] snap-start"
        >
            <div className="relative aspect-16/10 overflow-hidden mb-3">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80" />
            </div>

            <h3 className="text-[15px] font-bold leading-[1.3] text-gray-800 line-clamp-3">
                {article.title}

            </h3>
        </Link>
    );
};
