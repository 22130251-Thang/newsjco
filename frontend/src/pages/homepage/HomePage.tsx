import { CategoriesList } from "../../components/categories-list";

import { LeftSidebar } from "../../components/LeftSidebar";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { useEffect } from "react";
import {
  getTop10ThoiSuArticles,
  getHomePageCategories
} from "../../lib/store/slices/articleSlice";
import { RightSidebar } from "../../components/RightSidebar";
import { MainSection } from "../../components/MainSection";
import { HotNews } from "../../components/HotNews";
import { CategoryBlock } from "../../components/CategoryBlock";

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { homePageCategories, loadingHomePageCategories } = useAppSelector(
    (state) => state.article
  );

  useEffect(() => {
    dispatch(getTop10ThoiSuArticles());
    dispatch(getHomePageCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <CategoriesList />

      <div className="container-main py-6">
        <div className="flex gap-8 items-start">
          <aside className="">
            <LeftSidebar />
          </aside>

          <div className="flex-1 min-w-0 space-y-8">
            <MainSection />
          </div>

          <aside className="">
            <RightSidebar />
          </aside>
        </div>
      </div>

      <div className="container-main py-6">
        <div className="flex gap-8 items-start">
          <div className="w-[545px] shrink-0">
            <HotNews />
          </div>
          <div className="w-[600px] shrink-0 space-y-8">
            {loadingHomePageCategories ? (
              <div className="animate-pulse space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : (
              homePageCategories.length > 0 ? (
                homePageCategories.map((cat, index) => (
                  <CategoryBlock
                    key={index}
                    category={cat.category}
                    articles={cat.articles}
                  />
                ))
              ) : (
                <div className="text-gray-500">Đang cập nhật nội dung...</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
