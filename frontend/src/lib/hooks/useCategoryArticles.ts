import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getArticlesByCategory, getFeaturedArticlesByCat } from "../store/slices/articleSlice";

interface UseCategoryArticlesOptions {
    category?: string;
    page?: number;
    limit?: number;
}

export const useCategoryArticles = ({ category, page = 1, limit = 10 }: UseCategoryArticlesOptions) => {
    const dispatch = useAppDispatch();

    const { data: listData, loading: listLoading } = useAppSelector(
        (state) => state.article.articlesByCategory
    );
    const { data: features, loading: featuresLoading } = useAppSelector(
        (state) => state.article.featuredArticlesByCat
    );
    const error = useAppSelector((state) => state.article.error);

    useEffect(() => {
        if (category) {
            dispatch(getFeaturedArticlesByCat(category));
        }
    }, [category, dispatch]);

    useEffect(() => {
        if (category) {
            dispatch(getArticlesByCategory({ category, page, limit, offset: 4 }));
            window.scrollTo(0, 0);
        }
    }, [category, page, limit, dispatch]);

    return {
        articles: listData?.data || [],
        features: features || [],
        meta: listData?.meta,
        loading: listLoading || featuresLoading,
        error,
    };
};
