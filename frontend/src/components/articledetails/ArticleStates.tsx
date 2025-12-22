export const ArticleLoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
    </div>
);

interface ArticleErrorProps {
    error: string;
}

export const ArticleError = ({ error }: ArticleErrorProps) => (
    <div className="container-main py-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Lỗi</h1>
        <p className="text-gray-600 mt-2">{error}</p>
    </div>
);
