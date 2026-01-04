interface CommentAvatarProps {
    displayName?: string;
    avatar?: string;
}

const getAvatarUrl = (avatar?: string, displayName?: string) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName || "User"
    )}&background=4f46e5&color=fff&size=40`;

    if (!avatar) return defaultAvatar;
    if (avatar.startsWith("http")) return avatar;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${API_URL}${avatar}`;
};

export const CommentAvatar = ({ displayName, avatar }: CommentAvatarProps) => {
    const avatarUrl = getAvatarUrl(avatar, displayName);

    return (
        <div className="shrink-0">
            <img
                src={avatarUrl}
                alt={displayName || "User"}
                className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
        </div>
    );
};
