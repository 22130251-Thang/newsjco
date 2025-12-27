import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import { ChangePasswordModal } from "../../components/profile/ChangePasswordModal";
import { UserComments } from "../../components/profile/UserComments";
import { Edit, Key, Camera } from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { updateUserAvatar } from "../../lib/store/slices/authSlice";

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, updateLoading } = useAppSelector((state) => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  if (!isAuthenticated || ! user) {
    return <Navigate to="/" replace />;
  }

  const handleAvatarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarUrl. trim()) {
      dispatch(updateUserAvatar(avatarUrl));
      setIsAvatarModalOpen(false);
      setAvatarUrl("");
    }
  };

  const mockComments = [
    {
      id:  1,
      content: "Bài viết rất hay và bổ ích! ",
      articleTitle: "Tin thời sự mới nhất hôm nay",
      articleSlug: "tin-thoi-su-moi-nhat",
      categorySlug: "thoi-su",
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id:  2,
      content: "Cảm ơn tác giả đã chia sẻ thông tin hữu ích này",
      articleTitle: "Kinh tế Việt Nam năm 2025",
      articleSlug: "kinh-te-viet-nam-2025",
      categorySlug:  "kinh-te",
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container-main max-w-3xl mx-auto px-4">
        <ProfileHeader
          user={user}
          onAvatarClick={() => setIsAvatarModalOpen(true)}
        />

        <ProfileInfo user={user} />

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark: border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Edit size={18} />
            Chỉnh sửa thông tin
          </button>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Key size={18} />
            Đổi mật khẩu
          </button>
        </div>

        <UserComments comments={mockComments} />

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />

        <Modal
          isOpen={isAvatarModalOpen}
          onClose={() => {
            setIsAvatarModalOpen(false);
            setAvatarUrl("");
          }}
          title="Đổi ảnh đại diện"
        >
          <form onSubmit={handleAvatarSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL ảnh đại diện
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/avatar.jpg"
                required
              />
            </div>

            {avatarUrl && (
              <div className="flex justify-center">
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setAvatarUrl("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark: border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updateLoading || !avatarUrl. trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                Cập nhật
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};