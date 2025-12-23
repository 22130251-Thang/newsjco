import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { registerUser, clearError, fetchCurrentUser } from "../../lib/store/slices/authSlice";
import type { RegisterRequest } from "../../types/users.type";

export const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
    username: "",
    useremail: "",
    password: "",
    displayName: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Mật khẩu không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    dispatch(clearError());
    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(registerUser(registerData));
    if (result.meta.requestStatus === "fulfilled") {
      await dispatch(fetchCurrentUser());
      navigate("/");
    }
  };

  return (
    <div className="container-main py-12 bg-white dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1"></div>
        <div className="col-span-1 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Đăng Ký Tài Khoản
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên hiển thị
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="useremail"
                value={formData.useremail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Xác nhận mật khẩu"
              />
            </div>

            {(validationError || error) && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{validationError || error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 font-medium transition"
            >
              {loading ? "Đang xử lý..." : "Đăng Ký"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-primary dark:text-orange-300 hover:text-red-700 dark:hover:text-orange-200 font-medium">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
};
