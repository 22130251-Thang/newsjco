import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useArticleDetail } from "../../lib/hooks/useArticleDetail";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { addArticleView } from "../../lib/store/slices/viewHistorySlice";
import {
  ArticleBreadcrumb,
  ArticleHeader,
  ArticleContent,
  RelatedArticlesSidebar,
  ArticleLoadingSpinner,
  ArticleError,
} from "../../components/news/articledetails";
import { CommentList } from "../../components/comments/CommentList";

export const ArticleDetail = () => {
  const { category, slug } = useParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { article, loading, error, relatedArticles } = useArticleDetail({
    slug,
    category,
  });

  // Track article view when user is authenticated
  useEffect(() => {
    if (isAuthenticated && slug && article) {
      dispatch(addArticleView(slug));
    }
  }, [isAuthenticated, slug, article, dispatch]);

  if (loading) return <ArticleLoadingSpinner />;
  if (error) return <ArticleError error={error} />;
  if (!article) return null;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container-main py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <main className="flex-1 min-w-0">
            <ArticleBreadcrumb category={article.category} />

            <article>
              <ArticleHeader article={article} slug={slug} />

              <ArticleContent article={article} />
            </article>

            {slug && <CommentList slug={slug} />}
          </main>

          <RelatedArticlesSidebar articles={relatedArticles} maxItems={6} />
        </div>
      </div>
    </div>
  );
};
