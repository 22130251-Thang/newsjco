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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user/avatar/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(updateUserAvatar(data.avatar));
          setIsAvatarModalOpen(false);
          setAvatarFile(null);
          setAvatarPreview("");
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Upload thất bại!' }));
          console.error('Upload error:', errorData);
          alert(errorData.message || 'Upload thất bại!');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert("Có lỗi xảy ra khi upload!");
      }
    }
  };

  const mockComments = [
    {
      id: 1,
      content: "Bài viết rất hay và bổ ích! ",
      articleTitle: "Tin thời sự mới nhất hôm nay",
      articleSlug: "tin-thoi-su-moi-nhat",
      categorySlug: "thoi-su",
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 2,
      content: "Cảm ơn tác giả đã chia sẻ thông tin hữu ích này",
      articleTitle: "Kinh tế Việt Nam năm 2025",
      articleSlug: "kinh-te-viet-nam-2025",
      categorySlug: "kinh-te",
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
            setAvatarFile(null);
            setAvatarPreview("");
          }}
          title="Đổi ảnh đại diện"
        >
          <form onSubmit={handleAvatarSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn ảnh đại diện
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/20 dark:file:text-red-400"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Chấp nhận: JPG, PNG, GIF, WEBP. Tối đa 5MB
              </p>
            </div>

            {avatarPreview && (
              <div className="flex justify-center">
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-lg"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setAvatarFile(null);
                  setAvatarPreview("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updateLoading || !avatarFile}
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