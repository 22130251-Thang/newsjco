import { CategoriesList } from "../../components/categories-list";

import { LeftSidebar } from "../../components/LeftSidebar";
import { CategorySection } from "../../components/CategorySection";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { useEffect } from "react";
import { getTop10ThoiSuArticles } from "../../lib/store/slices/articleSlice";
import { RightSidebar } from "../../components/RightSidebar";
import { MainSection } from "../../components/MainSection";

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { top10ThoiSuArticles, loadingTop10ThoiSuArticles } = useAppSelector(
    (state) => state.article
  );

  useEffect(() => {
    dispatch(getTop10ThoiSuArticles());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <CategoriesList />

      <div className="container-main py-6">

        <div className="flex gap-8 items-start">
          <aside className="">
            <LeftSidebar />
          </aside>

          <main className="flex-1 min-w-0 space-y-8">
            <MainSection />

            <div className="space-y-8">
              <CategorySection
                title="THỜI SỰ"
                slug="thoi-su"
                articles={top10ThoiSuArticles.slice(0, 5)}
                loading={loadingTop10ThoiSuArticles}
              />
              <CategorySection
                title="KINH TẾ"
                slug="kinh-te"
                articles={top10ThoiSuArticles.slice(2, 7)}
                loading={loadingTop10ThoiSuArticles}
              />
              <CategorySection
                title="THẾ GIỚI"
                slug="the-gioi"
                articles={top10ThoiSuArticles.slice(4, 9)}
                loading={loadingTop10ThoiSuArticles}
              />
              <CategorySection
                title="XÃ HỘI"
                slug="xa-hoi"
                articles={top10ThoiSuArticles.slice(1, 6)}
                loading={loadingTop10ThoiSuArticles}
              />
            </div>
          </main>

          <aside className="">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};
