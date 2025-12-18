import { Video, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '../types/article.type';

interface MediaCardProps {
    article: Article;
}

export const MediaCard = ({ article }: MediaCardProps) => {
    const titleLower = article.title.toLowerCase();
    const categoryLower = (article.category || '').toLowerCase();

    const isVideo = titleLower.includes('video') || categoryLower.includes('video');
    const isInfographic = titleLower.includes('infographic') || categoryLower.includes('infographic');

    let label = 'MEDIA';
    if (isVideo) label = 'VIDEO';
    else if (isInfographic) label = 'INFOGRAPHICS';

    return (
        <Link
            to={`/${article.category}/${article.slug}`}
            className="shrink-0 w-[240px] md:w-[275px] group/card snap-start"
        >
            <div className="relative aspect-16/10 overflow-hidden rounded-sm mb-3">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                <div className="absolute bottom-3 left-3">
                    <span className="text-white text-[11px] font-bold uppercase tracking-tight">
                        {label}
                    </span>
                </div>
            </div>

            <h3 className="text-[15px] font-bold leading-[1.3] text-gray-800 line-clamp-3">
                {article.title}
                {isVideo ? (
                    <span className="inline-flex items-center ml-1 align-baseline">
                        <Video size={14} fill="#cc0000" stroke="none" className="translate-y-px" />
                    </span>
                ) : (
                    <span className="inline-flex items-center ml-1 align-baseline">
                        <Camera size={14} fill="#cc0000" stroke="none" className="translate-y-px" />
                    </span>
                )}
            </h3>
        </Link>
    );
};
