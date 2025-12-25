import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCategoryArticles } from "../../lib/hooks/useCategoryArticles";
import {
    CategoryHeader,
    CategoryFeatured,
    CategoryArticleList,
    CategorySidebar,
    CategoryPagination,
} from "../../components/category";
import { ArticleLoadingSpinner, ArticleError } from "../../components/articledetails/ArticleStates";

export const CategoryPage = () => {
    const { category } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const { articles, features, meta, loading, error } = useCategoryArticles({
        category,
        page: currentPage,
        limit: 10
    });

    if (loading && currentPage === 1 && features.length === 0) {
        return <ArticleLoadingSpinner />;
    }

    if (error) {
        return <ArticleError error={error} />;
    }

    if ((!articles || articles.length === 0) && features.length === 0) {
        return (
            <div className="container-main py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400">Không tìm thấy bài viết cho chuyên mục này.</h2>
            </div>
        );
    }

    const featuredArticles = features;
    const displayedRegularArticles = articles;

    const combinedArticles = [...features, ...articles];
    const trendingArticles = combinedArticles.slice(0, 5);
    const mostReadArticles = combinedArticles.slice(5, 8);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <div className="container-main py-8 flex flex-col gap-10">
                <CategoryHeader
                    category={category || ""}
                />

                {currentPage === 1 && featuredArticles.length > 0 && (
                    <CategoryFeatured articles={featuredArticles} />
                )}

                <div className="flex gap-10 mt-10">
                    <div className="lg:w-[842px] shrink-0">
                        <CategoryArticleList articles={displayedRegularArticles} />

                        {meta && meta.totalPages > 1 && (
                            <CategoryPagination
                                currentPage={currentPage}
                                totalPages={meta.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <CategorySidebar
                            trendingArticles={trendingArticles}
                            mostReadArticles={mostReadArticles}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
