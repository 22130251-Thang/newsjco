import { useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCategories } from "../store/slices/categorySlice";
import type { Category } from "../../types/category.type";

const buildCategoryHierarchy = (categories: Category[]): Category[] => {
    const parentCategories = categories.filter((cat) => cat.parentId === null);

    return parentCategories.map((parent) => ({
        ...parent,
        children: categories.filter((cat) => cat.parentId === parent.id),
    }));
};


export const useCategories = () => {
    const dispatch = useAppDispatch();
    const { categories, loading, error } = useAppSelector((state) => state.category);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const hierarchicalCategories = useMemo(() => {
        if (!categories) return [];
        return buildCategoryHierarchy(categories);
    }, [categories]);

    return { hierarchicalCategories, loading, error };
};
