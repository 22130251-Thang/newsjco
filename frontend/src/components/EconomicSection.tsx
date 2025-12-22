import type { Article } from '../types/article.type';
import { EconomicCard } from './EconomicCard';
import { Carousel } from './Carousel';
import { CarouselCardSkeleton } from './Skeleton';

interface EconomicSectionProps {
    articles: Article[];
    loading?: boolean;
}

export const EconomicSection = ({ articles, loading }: EconomicSectionProps) => {
    if (!loading && (!articles || articles.length === 0)) return null;

    return (
        <div className="container-main py-8 border-t border-gray-100 mt-4">
            <div className="flex mb-6">
                <h2 className="bg-[#cc0000] text-white px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide">
                    DOANH NGHIỆP - SẢN PHẨM - DỊCH VỤ
                </h2>
            </div>

            <Carousel
                gap={6}
                buttonOffset="-20px"
                buttonTop="35%"
            >
                {loading ? (
                    <CarouselCardSkeleton count={4} cardWidth="280px" />
                ) : (
                    articles.map((article, index) => (
                        <EconomicCard key={article.guid || index} article={article} />
                    ))
                )}
            </Carousel>
        </div>
    );
};
