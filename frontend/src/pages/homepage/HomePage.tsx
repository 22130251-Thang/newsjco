
import { LeftSidebar } from "../../components/LeftSidebar";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { useEffect } from "react";
import {
  getHomePageCategories,
  getMediaArticles,
} from "../../lib/store/slices/articleSlice";
import { RightSidebar } from "../../components/RightSidebar";
import { MainSection } from "../../components/MainSection";
import { NewsGrid } from "../../components/NewsGrid";
import { MediaSection } from "../../components/MediaSection";

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const homePageCategories = useAppSelector((state) => state.article.homePageCategories);
  const mediaArticles = useAppSelector((state) => state.article.mediaArticles);

  useEffect(() => {
    dispatch(getHomePageCategories());
    dispatch(getMediaArticles());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container-main py-6">
        <div className="flex gap-8 items-start h-[488px] mb-20">
          <aside className="">
            <LeftSidebar />
          </aside>

          <div className="flex-1">
            <MainSection />
          </div>

          <aside className="">
            <RightSidebar />
          </aside>
        </div>
      </div>
      <MediaSection articles={mediaArticles.data} />
      <NewsGrid
        loading={homePageCategories.loading}
        categories={homePageCategories.data}
      />
    </div>
  );
};
