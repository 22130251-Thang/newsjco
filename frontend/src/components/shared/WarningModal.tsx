import { AlertTriangle } from "lucide-react";

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export const WarningModal = ({ isOpen, onClose, message }: WarningModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-8 animate-scale-in">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                        <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Cảnh báo
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};
