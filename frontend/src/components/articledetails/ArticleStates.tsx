export const ArticleLoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[60vh] bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
    </div>
);

interface ArticleErrorProps {
    error: string;
}

export const ArticleError = ({ error }: ArticleErrorProps) => (
    <div className="container-main py-10 text-center bg-white dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 dark:text-orange-400">Lỗi</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
    </div>
);
