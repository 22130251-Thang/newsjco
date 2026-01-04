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
import { ArticleReactions } from "../../components/reactions/ArticleReactions";
import { ThumbsUp } from "lucide-react";

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

              {/* Article Reactions - At bottom of article */}
              {slug && (
                <div className="mt-8 py-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <ThumbsUp size={18} />
                      <span className="text-sm font-medium">Bài viết này có hữu ích không?</span>
                    </div>
                    <ArticleReactions slug={slug} size="md" showCount />
                  </div>
                </div>
              )}
            </article>

            {slug && <CommentList slug={slug} />}
          </main>

          <RelatedArticlesSidebar articles={relatedArticles} maxItems={6} />
        </div>
      </div>
    </div>
  );
};
