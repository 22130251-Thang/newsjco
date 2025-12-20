import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getCategories } from "../lib/store/slices/categorySlice";
import { Link } from "react-router-dom";
import { Home, MoreVertical } from "lucide-react";
import { getVietnameseFormattedDate } from "../lib/utils/date-utils";

export const CategoriesList = () => {
  const dispatch = useAppDispatch();

  const { categories, loading, error } = useAppSelector(
    (state) => state.category,
  );

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  if (loading) return null;
  if (error) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#d21d21] text-white">
        <div className="container-main">
          <div className="flex items-center h-[40px]">
            <Link
              to="/"
              className="px-3 h-full flex items-center justify-center transition-colors"
            >
              <Home size={18} fill="currentColor" />
            </Link>

            <ul className="flex items-center flex-1 overflow-x-auto no-scrollbar h-full">
              {categories &&
                categories.slice(1).map((category) => (
                  <li key={category.id} className="h-full">
                    <Link
                      to={`/${category.slug}`}
                      className="text-[12px] flex items-center px-2 h-full font-bold uppercase hover:text-yellow-200 transition-colors whitespace-nowrap"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
            </ul>

            <button className="px-3 h-full flex items-center justify-center hover:bg-[#a01c1c] transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Phần SỰ KIỆN - scroll bình thường */}
      <div className="container-main bg-gray-100 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4 p-2">
            <span className="font-bold text-red-500">SỰ KIỆN</span>
            <div className="flex items-center gap-2 truncate text-gray-700">
              <Link to="/su-kien/1" className="bg-white rounded-xl px-2 py-2">
                Báo Tin tức - 40 năm đổi mới
              </Link>
              <Link to="/su-kien/2" className="bg-white rounded-xl px-2 py-2">
                Việt Nam: Kỷ nguyên mới
              </Link>
            </div>
          </div>

          <div className="text-gray-500 font-medium whitespace-nowrap">
            {getVietnameseFormattedDate()}
          </div>
        </div>
      </div>
    </>
  );
};
