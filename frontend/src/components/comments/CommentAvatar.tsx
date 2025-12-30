interface CommentAvatarProps {
    displayName?: string;
}

export const CommentAvatar = ({ displayName }: CommentAvatarProps) => {
    return (
        <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm">
                {displayName?.charAt(0).toUpperCase() || "U"}
            </div>
        </div>
    );
};
