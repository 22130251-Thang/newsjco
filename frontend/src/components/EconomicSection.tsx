import type { Article } from '../types/article.type';
import { EconomicCard } from './EconomicCard';
import { Carousel } from './Carousel';

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
                    [1, 2, 3, 4].map((i) => (
                        <div key={i} className="shrink-0 w-[240px] md:w-[280px] animate-pulse">
                            <div className="aspect-video bg-gray-100 rounded-sm mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                        </div>
                    ))
                ) : (
                    articles.map((article, index) => (
                        <EconomicCard key={article.guid || index} article={article} />
                    ))
                )}
            </Carousel>
        </div>
    );
};
