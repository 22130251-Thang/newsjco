import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { SubCategoryDropdown } from "./SubCategoryDropdown";
import type { Category } from "../../types/category.type";

interface CategoryItemProps {
    category: Category;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}

export const CategoryItem = memo(({ category, isHovered, onHover }: CategoryItemProps) => {
    const hasChildren = category.children && category.children.length > 0;

    const handleMouseEnter = useCallback(() => onHover(category.id), [category.id, onHover]);
    const handleMouseLeave = useCallback(() => onHover(null), [onHover]);

    return (
        <li
            className="h-full relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                to={`/${category.slug}`}
                className="text-[12px] flex items-center gap-1 px-2 h-full font-bold uppercase whitespace-nowrap"
            >
                {category.name}
            </Link>

            {hasChildren && isHovered && (
                <SubCategoryDropdown children={category.children!} />
            )}
        </li>
    );
});

