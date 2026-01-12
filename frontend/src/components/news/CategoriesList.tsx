import { useState, useCallback } from "react";
import { useCategories } from "../../lib/hooks/useCategories";
import { EventsBar } from "./EventsBar";
import { CategoryItem } from "./CategoryItem";
import { HomeButton } from "./HomeButton";
import { NAV_HEIGHT } from "./constants";

export const CategoriesList = () => {
  const { hierarchicalCategories, loading, error } = useCategories();
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);

  const handleHover = useCallback((id: number | null) => {
    setHoveredCategoryId(id);
  }, []);

  if (loading || error) return null;


  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#d21d21] text-white">
        <div className="container-main">
          <div className="flex items-center" style={{ height: NAV_HEIGHT }}>
            <HomeButton />

            <ul className="flex items-center flex-1 overflow-visible no-scrollbar h-full">
              {hierarchicalCategories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isHovered={hoveredCategoryId === category.id}
                  onHover={handleHover}
                />
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <EventsBar />
    </>
  );
};
