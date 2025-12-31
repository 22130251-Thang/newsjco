
import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../lib/store/hooks";
import { AlertCircle } from "lucide-react";
import { WarningModal } from "../shared/WarningModal";

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export const CommentForm = ({ onSubmit, onCancel, placeholder = "Chia sẻ ý kiến của bạn...", autoFocus = false }: CommentFormProps) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(content);
            setContent("");
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || err?.message || String(err) || "";
            const isModeration = errorMsg.includes('không phù hợp') || errorMsg.includes('Bad Request');
            if (isModeration) {
                setShowWarning(true);
            } else {
                setError(errorMsg || "Có lỗi xảy ra khi gửi bình luận");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg text-center border border-dashed border-gray-300">
                <p className="text-gray-600">Vui lòng đăng nhập để thực hiện hành động này</p>
            </div>
        );
    }

    return (
        <>
            <WarningModal
                isOpen={showWarning}
                onClose={() => setShowWarning(false)}
                message="Comment của bạn chứa nội dung không đúng chuẩn mực. Vui lòng chỉnh sửa và thử lại!"
            />
            <form onSubmit={handleSubmit} className="w-full">
                {error && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                <div className="mb-3">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder={placeholder}
                        className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none h-28 transition-all ${error ? 'border-red-300' : 'border-gray-200'}`}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 rounded-lg font-semibold text-gray-600 bg-gray-100"
                        >
                            Hủy
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={async () => {
                            setIsSubmitting(true);
                            try {
                                await onSubmit("@AI summarize this");
                                setContent("");
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        className="px-4 py-2 rounded-lg font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-2"
                    >
                        Summarize with AI
                    </button>
                    <button
                        type="submit"
                        disabled={!content.trim() || isSubmitting}
                        className={`px-6 py-2 rounded-lg font-semibold text-white ${!content.trim() || isSubmitting
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600"
                            }`}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                    </button>
                </div>
            </form>
        </>
    );
};
