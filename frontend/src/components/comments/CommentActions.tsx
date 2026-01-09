import { ThumbsUp, ThumbsDown, MessageSquare, Pencil, Trash2 } from "lucide-react";

interface CommentActionsProps {
    likes: number;
    dislikes: number;
    userReaction?: 'like' | 'dislike' | null;
    isReplying: boolean;
    isOwner: boolean;
    isEditing?: boolean;
    onReact: (type: 'like' | 'dislike') => void;
    onReplyClick: () => void;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
}

export const CommentActions = ({
    likes,
    dislikes,
    userReaction,
    isReplying,
    isOwner,
    isEditing,
    onReact,
    onReplyClick,
    onEditClick,
    onDeleteClick
}: CommentActionsProps) => {
    return (
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 font-medium">
            <button
                onClick={() => onReact('like')}
                className={`flex items-center gap-1.5 transition-all group px-2 py-1 rounded-md ${userReaction === 'like' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-blue-50'}`}
            >
                <ThumbsUp size={16} className={userReaction === 'like' ? 'fill-blue-600' : 'group-hover:fill-blue-50'} />
                <span>{likes}</span>
            </button>
            <button
                onClick={() => onReact('dislike')}
                className={`flex items-center gap-1.5 transition-all group px-2 py-1 rounded-md ${userReaction === 'dislike' ? 'text-red-600 bg-red-50' : 'hover:text-red-600 hover:bg-red-50'}`}
            >
                <ThumbsDown size={16} className={userReaction === 'dislike' ? 'fill-red-600' : 'group-hover:fill-red-50'} />
                <span>{dislikes}</span>
            </button>
            <button
                onClick={onReplyClick}
                className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-md hover:bg-gray-100 ${isReplying ? 'text-blue-600 bg-blue-50' : 'hover:text-gray-900 text-gray-500'}`}
            >
                <MessageSquare size={16} />
                <span>Phản hồi</span>
            </button>

            {isOwner && (
                <>
                    <button
                        onClick={onEditClick}
                        className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-md hover:bg-blue-50 hover:text-blue-600 ${isEditing ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
                    >
                        <Pencil size={14} />
                        <span>Sửa</span>
                    </button>
                    <button
                        onClick={onDeleteClick}
                        className="flex items-center gap-1.5 transition-all px-2 py-1 rounded-md hover:bg-red-50 hover:text-red-600 text-gray-500"
                    >
                        <Trash2 size={14} />
                        <span>Xóa</span>
                    </button>
                </>
            )}
        </div>
    );
};

