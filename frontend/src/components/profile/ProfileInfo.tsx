import { User, Mail, FileText, Phone, MapPin, Calendar, Users } from "lucide-react";
import type { User as UserType } from "../../types/users.type";

interface ProfileInfoProps {
  user: UserType;
}

export const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const formatGender = (gender?: string) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  };

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <User size={20} className="text-red-600" />
        Thông tin cá nhân
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <User size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tên đăng nhập</p>
            <p className="text-gray-900 dark:text-white font-medium">{user.username}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Users size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark: text-gray-400">Giới tính</p>
            <p className="text-gray-900 dark:text-white font-medium">{formatGender(user.gender)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Mail size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark: text-gray-400">Email</p>
            <p className="text-gray-900 dark: text-gray font-medium">{user.useremail}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ngày sinh</p>
            <p className="text-gray-900 dark:text-white font-medium">{formatBirthDate(user.birthDate)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Phone size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
            <p className="text-gray-900 dark:text-white font-medium">{user.phone || 'Chưa cập nhật'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <MapPin size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
            <p className="text-gray-900 dark:text-white font-medium">{user.address || 'Chưa cập nhật'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:col-span-2">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <FileText size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Giới thiệu</p>
            <p className="text-gray-900 dark:text-white">
              {user.bio || "Chưa có thông tin giới thiệu"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};