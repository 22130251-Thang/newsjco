import type { Article } from '../types/article.type';
import { MediaCard } from './MediaCard';
import { Carousel } from './Carousel';

interface MediaCarouselProps {
    articles: Article[];
}

export const MediaCarousel = ({ articles }: MediaCarouselProps) => {
    if (!articles || articles.length === 0) return null;

    return (
        <Carousel
            gap={5}
            buttonOffset="-12px"
            buttonTop="40%"
            className="mt-4"
        >
            {articles.map((article, index) => (
                <MediaCard key={article.guid || index} article={article} />
            ))}
        </Carousel>
    );
};
