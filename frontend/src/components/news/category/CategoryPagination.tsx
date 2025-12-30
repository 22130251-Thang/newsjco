import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const CategoryPagination = ({ currentPage, totalPages, onPageChange }: CategoryPaginationProps) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-end gap-6">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 bg-white disabled:opacity-30 transition-all"
                >
                    <ChevronLeft size={18} />
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center border font-bold text-sm transition-all ${currentPage === page
                            ? "bg-primary border-primary text-white shadow-md scale-105"
                            : "border-gray-200"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 bg-white disabled:opacity-30 transition-all flex items-center gap-1"
                >
                    <span className="text-sm font-bold ml-1 hidden sm:block">Tiếp</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
