import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { loginUser, clearError, fetchCurrentUser } from "../../lib/store/slices/authSlice";
import type { LoginRequest } from "../../types/users.type";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      await dispatch(fetchCurrentUser());
      navigate("/");
    }
  };

  return (
    <div className="container-main py-12">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1"></div>
        <div className="col-span-1 bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Đăng Nhập
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium transition"
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Chưa có tài khoản?{" "}
              <Link to="/signup" className="text-primary hover:text-red-700 font-medium">
                Đăng ký tại đây
              </Link>
            </p>
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
};
