
import { LeftSidebar } from "../../components/LeftSidebar";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { useEffect } from "react";
import {
  getHomePageCategories,
  getMediaArticles,
  getEconomicArticles,
} from "../../lib/store/slices/articleSlice";
import { RightSidebar } from "../../components/RightSidebar";
import { MainSection } from "../../components/MainSection";
import { NewsGrid } from "../../components/NewsGrid";
import { MediaSection } from "../../components/MediaSection";
import { EconomicSection } from "../../components/EconomicSection";

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const {
    homePageCategories,
    loadingHomePageCategories,
    mediaArticles,
    economicArticles,
    loadingEconomicArticles,
  } = useAppSelector((state) => state.article);

  useEffect(() => {
    dispatch(getHomePageCategories());
    dispatch(getMediaArticles());
    dispatch(getEconomicArticles());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main py-6">
        <div className="flex gap-8 items-start h-[488px] mb-3">
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
      <MediaSection articles={mediaArticles} />
      <NewsGrid
        loading={loadingHomePageCategories}
        categories={homePageCategories}
      />
      <EconomicSection
        articles={economicArticles}
        loading={loadingEconomicArticles}
      />
    </div>
  );
};
