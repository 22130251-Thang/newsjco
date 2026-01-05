import { Link } from "react-router-dom";
import { Home, MoveLeft, FileQuestion } from "lucide-react";

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center animate-fadeIn">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 animate-scale-in">
                    <FileQuestion size={80} className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-2 -right-2 bg-primary text-white text-4xl font-black px-4 py-2 rounded-lg shadow-lg rotate-12 animate-bounce-in">
                    404
                </div>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                Không tìm thấy trang
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy thử tìm kiếm lại hoặc quay lại trang chủ.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    <Home size={20} />
                    Quay về Trang chủ
                </Link>

                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-full font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 active:scale-95"
                >
                    <MoveLeft size={20} />
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default NotFound;
