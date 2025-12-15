import { HomeIcon } from "lucide-react";
import { CategoriesList } from "../../components/categories-list";

export const HomePage = () => {
  return (
    <div>
      <nav className="border border-gray-200 flex justify-center items-center space-x-2">
        <HomeIcon className="text-gray-400" />
        <CategoriesList />
      </nav>
    </div>
  );
};
