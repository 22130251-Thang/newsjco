interface LoadMoreButtonProps {
    loading: boolean;
    onClick: () => void;
}

export const LoadMoreButton = ({ loading, onClick }: LoadMoreButtonProps) => {
    const baseStyles = "px-8 py-3 rounded-xl font-bold transition-all border-2";
    const loadingStyles = "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed";
    const activeStyles = "border-indigo-100 text-indigo-600 cursor-pointer hover:bg-indigo-50";

    return (
        <div className="mt-8 text-center">
            <button
                onClick={onClick}
                disabled={loading}
                className={`${baseStyles} ${loading ? loadingStyles : activeStyles}`}
            >
                {loading ? "Đang tải..." : "Xem thêm bình luận"}
            </button>
        </div>
    );
};
