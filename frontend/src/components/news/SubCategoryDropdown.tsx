import { memo } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../types/category.type";

interface SubCategoryDropdownProps {
    children: Category[];
}

export const SubCategoryDropdown = memo(({ children }: SubCategoryDropdownProps) => (
    <div className="absolute min-w-[180px] bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-b-md py-1 z-[100]">
        {children.map((subCategory) => (
            <Link
                key={subCategory.id}
                to={`/${subCategory.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
            >
                {subCategory.name}
            </Link>
        ))}
    </div>
));

