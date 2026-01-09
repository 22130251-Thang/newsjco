import type { User } from "../../types/users.type";
import { getVietnameseFormattedDate } from "../../lib/utils/date-utils";

interface CommentHeaderProps {
    user?: User;
    userId: number;
    createdAt: string;
    isReply?: boolean;
    isEdited?: boolean;
}

export const CommentHeader = ({ user, userId, createdAt, isReply, isEdited }: CommentHeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {user?.displayName || `User #${userId}`}
                {isReply && (
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded font-normal uppercase">Phản hồi</span>
                )}
                {isEdited && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal italic">(đã chỉnh sửa)</span>
                )}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                {getVietnameseFormattedDate(new Date(createdAt))}
            </span>
        </div>
    );
};

