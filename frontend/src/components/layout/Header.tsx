import { Rss, Phone, Mail, Smartphone, LogOut, Moon, Sun, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CategoriesList } from "../news/CategoriesList";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { logout } from "../../lib/store/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { NotificationBell } from "./NotificationBell";
import { SearchBar } from "../search/SearchBar";

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getAvatarUrl = (avatar?: string, displayName?: string) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName || "User"
    )}&background=cc0000&color=fff&size=32`;

    if (!avatar) return defaultAvatar;
    if (avatar.startsWith("http")) return avatar;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${API_URL}${avatar}`;
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900">
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container-main">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <a
                  href="tel:0914914999"
                  className="flex items-center gap-1 hover:text-primary dark:hover:text-orange-400"
                >
                  <Phone size={12} />
                  <span>0914.914.999</span>
                </a>

                <a
                  href="mailto:thuky@baotintuc.vn"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Mail size={12} />
                  <span>thuky@baotintuc.vn</span>
                </a>

                <div className="h-3 w-px bg-gray-300 mx-1"></div>

                <a
                  href="/rss"
                  className="flex items-center gap-1 hover:text-primary dark:hover:text-orange-300"
                >
                  <Rss size={12} />
                  <span>RSS</span>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary dark:hover:text-orange-300"
                >
                  Fanpage
                </a>

                <a
                  href="/"
                  className="flex items-center gap-1 hover:text-primary dark:hover:text-orange-300"
                >
                  <Smartphone size={12} />
                  <span>Bản mobile</span>
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative z-[9999]">
                  <SearchBar />
                </div>

                <NotificationBell />

                {isAuthenticated && user && (
                  <Link
                    to="/bookmarks"
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    title="Bài viết đã lưu"
                  >
                    <Bookmark size={16} />
                  </Link>
                )}

                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                  title="Toggle Dark Mode"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </button>

                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3 text-xs border-l border-gray-300 dark:border-gray-600 pl-4">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                      title="Xem thông tin cá nhân"
                    >
                      <img
                        src={getAvatarUrl(user.avatar, user.displayName)}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                      />
                      <div className="text-gray-700 dark:text-gray-300">
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </p>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 ml-2 cursor-pointer"
                      title="Đăng xuất"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs border-l border-gray-300 pl-4">
                    <Link
                      to="/login"
                      className="px-3 py-1 text-primary hover:text-red-700 font-medium"
                    >
                      Đăng nhập
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to="/signup"
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-red-700 font-medium"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container-main">
          <div className="flex items-end gap-4">
            <Link to="/" className="flex flex-col">
              <img
                src="https://cdnstatic.baotintuc.vn/web_images/baotintuc-logo.png?v=100"
                width={233}
                height={105}
                alt="Báo Tin Tức"
              />
            </Link>

            <div className="ml-auto w-[900px] h-[90px] bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs text-gray-400">
              Quảng cáo
            </div>
          </div>
        </div>
      </header>

      <CategoriesList />
    </>
  );
};
