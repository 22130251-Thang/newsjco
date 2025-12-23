
import { useState } from "react";
import { useAppSelector } from "../../lib/store/hooks";

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
}

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent("");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">Please login to perform this action</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chia sẻ ý kiến của bạn..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32"
                    disabled={isSubmitting}
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${!content.trim() || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                </button>
            </div>
        </form>
    );
};
