import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getCategories } from "../lib/store/slices/categorySlice";
import { Link } from "react-router-dom";

export const CategoriesList = () => {
  const dispatch = useAppDispatch();

  const { categories, loading, error } = useAppSelector(
    (state) => state.category,
  );
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  console.log(categories);
  if (loading) {
    return <p>Đang tải danh mục...</p>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded">
        Lỗi khi tải danh mục: {error}
      </div>
    );
  }
  if (!categories || categories.length === 0) {
    return <p>Không tìm thấy danh mục nào.</p>;
  }
  return (
    <ul className="space-x-3 flex my-4 text-sm">
      {categories.map((category) => (
        <li key={category.id} className="">
          <Link
            to={`${category.slug}`}
            className="text-black-500 cursor-pointer"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
