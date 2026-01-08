import { AlertCircle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: "danger" | "warning" | "info";
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    isLoading = false,
    variant = "danger",
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            iconBg: "bg-red-100 dark:bg-red-900/30",
            iconColor: "text-red-500 dark:text-red-400",
            confirmBtn: "bg-red-600 hover:bg-red-700",
        },
        warning: {
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-500 dark:text-amber-400",
            confirmBtn: "bg-amber-600 hover:bg-amber-700",
        },
        info: {
            iconBg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-500 dark:text-blue-400",
            confirmBtn: "bg-blue-600 hover:bg-blue-700",
        },
    };

    const styles = variantStyles[variant];

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    {/* Icon */}
                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${styles.iconBg} mb-5`}>
                        <AlertCircle className={`h-9 w-9 ${styles.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-3 ${styles.confirmBtn} text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
