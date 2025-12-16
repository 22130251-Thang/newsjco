import { HomeIcon, Menu } from "lucide-react";
import { CategoriesList } from "../../components/categories-list";
import { TopThreeArticles } from "../../components/top-three-article";

export const HomePage = () => {
  return (
    <div>
      <nav className="border border-gray-200">
        <div className="w-[1200px] mx-auto flex justify-center items-center space-x-2">
          <div className="flex justify-center items-center">
            <HomeIcon className="cursor-pointer" />
          </div>
          <CategoriesList />
          <div className="flex justify-center items-center">
            <Menu className="cursor-pointer" />
          </div>
        </div>

        <div className="w-[1200px] mx-auto flex flex-col justify-center items-center">
          <TopThreeArticles />
        </div>
      </nav>
    </div>
  );
};
