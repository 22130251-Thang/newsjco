import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { changeUserPassword, clearUpdateStatus } from "../../lib/store/slices/authSlice";
import { Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const dispatch = useAppDispatch();
  const { updateLoading, updateError, updateSuccess } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationError("");
      dispatch(clearUpdateStatus());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        onClose();
      }, 2000);
    }
  }, [updateSuccess, dispatch, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (formData.newPassword.length < 6) {
      setValidationError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp");
      return;
    }

    dispatch(changeUserPassword(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const renderPasswordInput = (
    name: "currentPassword" | "newPassword" | "confirmPassword",
    label: string,
    placeholder: string,
    showField: "current" | "new" | "confirm"
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[showField] ? "text" : "password"}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(showField)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
        >
          {showPasswords[showField] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đổi mật khẩu">
      <form onSubmit={handleSubmit} className="space-y-4">
        {updateSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
            <CheckCircle size={20} />
            <span>Đổi mật khẩu thành công!</span>
          </div>
        )}

        {(updateError || validationError) && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {validationError || updateError}
          </div>
        )}

        {renderPasswordInput("currentPassword", "Mật khẩu hiện tại", "Nhập mật khẩu hiện tại", "current")}
        {renderPasswordInput("newPassword", "Mật khẩu mới", "Nhập mật khẩu mới (ít nhất 6 ký tự)", "new")}
        {renderPasswordInput("confirmPassword", "Xác nhận mật khẩu mới", "Nhập lại mật khẩu mới", "confirm")}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Yêu cầu mật khẩu: </p>
          <ul className="list-disc list-inside ml-2">
            <li>Ít nhất 6 ký tự</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={updateLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updateLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đổi mật khẩu"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};