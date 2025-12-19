import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { getArticleBySlug, getArticlesByCategory } from "../../lib/store/slices/articleSlice";
import { LeftSidebar } from "../../components/LeftSidebar";
import { RightSidebar } from "../../components/RightSidebar";
import { Calendar, User, Clock, Share2 } from "lucide-react";

export const ArticleDetail = () => {
    const { category, slug } = useParams();
    const dispatch = useAppDispatch();
    const { SelectedarticleBySlug: article, loadingArticleBySlug: loading, error, articlesByCategory } = useAppSelector((state) => state.article);

    useEffect(() => {
        if (slug) {
            dispatch(getArticleBySlug(slug));
            window.scrollTo(0, 0);
        }
        if (category) {
            dispatch(getArticlesByCategory(category));
        }
    }, [category, slug, dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-main py-10 text-center">
                <h1 className="text-2xl font-bold text-red-600">Lỗi</h1>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="bg-white min-h-screen">
            <div className="container-main py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Section: Article */}
                    <main className="flex-1 min-w-0">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 uppercase tracking-wider font-semibold">
                            <span className="text-red-600 font-bold">{article.category}</span>
                            <span className="text-gray-300">/</span>
                            <span className="truncate whitespace-nowrap overflow-hidden">Chi tiết bài viết</span>
                        </nav>

                        <article>
                            <header className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 font-heading">
                                    {article.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-y border-gray-100 py-4 mb-6">
                                    <div className="flex items-center gap-1">
                                        <User size={14} className="text-red-500" />
                                        <span className="font-bold text-gray-800 uppercase">{article.author || "Báo Tin Tức"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{new Date(article.pubDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{new Date(article.pubDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="ml-auto flex items-center gap-3">
                                        <button className="p-1.5 transition-colors">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {article.description && (
                                    <p className="text-lg font-bold text-gray-700 leading-relaxed italic mb-8 border-l-4 border-red-600 pl-4 py-1">
                                        {article.description}
                                    </p>
                                )}
                            </header>

                            {/* Main Content with Typography */}
                            <section
                                className="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-red-600"
                                dangerouslySetInnerHTML={{ __html: article.fullContent || article.content }}
                            />
                        </article>
                    </main>

                    {/* Right Section: Related News */}
                    <aside className="w-full lg:w-[350px] shrink-0 sticky top-24">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-red-600"></span>
                                TIN LIÊN QUAN
                            </h2>
                            <div className="flex flex-col gap-6">
                                {articlesByCategory.filter(a => a.slug !== slug).slice(0, 6).map((item) => (
                                    <div key={item.slug} className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                        {item.image && (
                                            <div className="w-24 h-16 shrink-0 overflow-hidden rounded bg-gray-200">
                                                <img
                                                    src={item.image}
                                                    className="w-full h-full object-cover"
                                                    alt={item.title}
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-between py-0.5">
                                            <h3 className="text-sm font-bold leading-snug line-clamp-2 text-gray-900">
                                                {item.title}
                                            </h3>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-extrabold tracking-tight">
                                                {item.category}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};