import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getArticleBySlug, getArticlesByCategory } from "../store/slices/articleSlice";

interface UseArticleDetailOptions {
    slug?: string;
    category?: string;
    scrollToTop?: boolean;
}

export const useArticleDetail = ({ slug, category, scrollToTop = true }: UseArticleDetailOptions) => {
    const dispatch = useAppDispatch();
    const { data: article, loading } = useAppSelector(
        (state) => state.article.selectedArticleBySlug
    );
    const { data: articlesByCategory } = useAppSelector(
        (state) => state.article.articlesByCategory
    );
    const error = useAppSelector((state) => state.article.error);

    useEffect(() => {
        if (slug) {
            dispatch(getArticleBySlug(slug));
            if (scrollToTop) {
                window.scrollTo(0, 0);
            }
        }
    }, [slug, dispatch, scrollToTop]);

    useEffect(() => {
        if (category) {
            dispatch(getArticlesByCategory({ category }));
        }
    }, [category, dispatch]);

    const relatedArticles = articlesByCategory?.data.filter((a) => a.slug !== slug) || [];

    return {
        article,
        loading,
        error,
        relatedArticles,
    };
};
