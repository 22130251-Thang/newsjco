import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import { ChangePasswordModal } from "../../components/profile/ChangePasswordModal";
import { UserComments } from "../../components/profile/UserComments";
import { SubscribedCategories } from "../../components/profile/SubscribedCategories";
import { ViewHistory } from "../../components/profile/ViewHistory";
import { UserBookmarks } from "../../components/profile/UserBookmarks";
import { Camera, Heart, Clock, MessageSquare, Bookmark } from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { setUser } from "../../lib/store/slices/authSlice";

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, updateLoading } = useAppSelector(
    (state) => state.auth
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"categories" | "history" | "comments" | "bookmarks">("categories");

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
      if (!file.type.startsWith("image/")) {
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
      formData.append("avatar", avatarFile);

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/avatar/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const updatedUser = await response.json();
          dispatch(setUser(updatedUser));
          setIsAvatarModalOpen(false);
          setAvatarFile(null);
          setAvatarPreview("");
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Upload thất bại!" }));
          console.error("Upload error:", errorData);
          alert(errorData.message || "Upload thất bại!");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Có lỗi xảy ra khi upload!");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container-main max-w-3xl mx-auto px-4">
        <ProfileHeader
          user={user}
          onAvatarClick={() => setIsAvatarModalOpen(true)}
          onEditClick={() => setIsEditModalOpen(true)}
          onPasswordClick={() => setIsPasswordModalOpen(true)}
        />

        <ProfileInfo user={user} />

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-6 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "categories"
              ? "bg-linear-to-r from-red-600 to-red-700 text-white shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"

              }`}
          >
            <Heart size={18} />
            <span className="hidden sm:inline">Danh mục theo dõi</span>
            <span className="sm:hidden">Theo dõi</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "history"
              ? "bg-linear-to-r from-red-600 to-red-700 text-white shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"

              }`}
          >
            <Clock size={18} />
            <span className="hidden sm:inline">Lịch sử xem</span>
            <span className="sm:hidden">Lịch sử</span>
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "comments"
              ? "bg-linear-to-r from-red-600 to-red-700 text-white shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"

              }`}
          >
            <MessageSquare size={18} />
            <span className="hidden sm:inline">Bình luận</span>
            <span className="sm:hidden">Bình luận</span>
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${activeTab === "bookmarks"
              ? "bg-linear-to-r from-red-600 to-red-700 text-white shadow-md"

              : "text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
              }`}
          >
            <Bookmark size={18} />
            <span className="hidden sm:inline">Đã lưu</span>
            <span className="sm:hidden">Đã lưu</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "categories" && <SubscribedCategories />}
        {activeTab === "history" && <ViewHistory />}
        {activeTab === "comments" && <UserComments />}
        {activeTab === "bookmarks" && <UserBookmarks />}

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
          <form onSubmit={handleAvatarSubmit} className="space-y-6">
            {/* Preview Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={avatarPreview || (user?.avatar?.startsWith('http') ? user.avatar : user?.avatar ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=cc0000&color=fff&size=128`)}
                  alt="Avatar Preview"
                  className="w-40 h-40 rounded-full object-cover border-4 border-red-500 shadow-xl"
                />
                {avatarPreview && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {avatarPreview ? "Ảnh mới đã sẵn sàng" : "Ảnh đại diện hiện tại"}
              </p>
            </div>

            {/* Upload Zone */}
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col items-center justify-center py-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full mb-2">
                    <Camera className="w-5 h-5 text-red-500 dark:text-red-400" />
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    Nhấn để chọn ảnh <span className="text-gray-400 font-normal">• JPG, PNG, GIF, WEBP (Max 5MB)</span>
                  </p>

                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setAvatarFile(null);
                  setAvatarPreview("");
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updateLoading || !avatarFile}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl cursor-pointer"
              >
                {updateLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Cập nhật
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
