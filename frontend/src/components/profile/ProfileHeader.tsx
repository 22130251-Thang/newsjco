import { Camera, Calendar } from "lucide-react";
import type { User } from "../../types/users.type";

interface ProfileHeaderProps {
  user: User;
  onAvatarClick: () => void;
}

export const ProfileHeader = ({ user, onAvatarClick }: ProfileHeaderProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.displayName || user.username
  )}&background=cc0000&color=fff&size=128`;

  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return defaultAvatar;
    if (avatar.startsWith('http')) return avatar;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${API_URL}${avatar}`;
  };

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-800 dark:from-gray-800 dark:to-gray-900 rounded-t-lg p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <img
            src={getAvatarUrl(user.avatar)}
            alt={user.displayName}
            className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-700 object-cover shadow-lg"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
          <button
            onClick={onAvatarClick}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera size={24} className="text-white" />
          </button>
        </div>

        <div className="text-center sm:text-left text-white">
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-red-100 dark:text-gray-400">@{user.username}</p>
          <p className="text-red-100 dark:text-gray-400">{user.useremail}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-red-100 dark:text-gray-400">
            <Calendar size={14} />
            <span>Tham gia:  {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};