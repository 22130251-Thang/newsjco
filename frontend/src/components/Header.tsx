import { Rss, Search, Phone, Mail, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoriesList } from "./CategoriesList";

export const Header = () => {
  return (
    <>
      <header className="bg-white">
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="container-main">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <a
                  href="tel:0914914999"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Phone size={12} />
                  <span>0914.914.999</span>
                </a>
                <a
                  href="mailto:thuky@baotintuc.vn"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Mail size={12} />
                  <span>thuky@baotintuc.vn</span>
                </a>
                <div className="h-3 w-px bg-gray-300 mx-1"></div>
                <a
                  href="/rss"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Rss size={12} />
                  <span>RSS</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c02424]"
                >
                  Fanpage
                </a>
                <a
                  href="/"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Smartphone size={12} />
                  <span>Bản mobile</span>
                </a>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-[200px] pl-3 pr-8 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary">
                  <Search size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-main">
          <div className="flex items-end gap-4">
            <Link to="/" className="flex flex-col">
              <img
                src="https://cdnstatic.baotintuc.vn/web_images/baotintuc-logo.png?v=100"
                width={233}
                height={105}
              />
            </Link>

            <div className="ml-auto w-[900px] h-[90px] bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">
              Quảng cáo
            </div>
          </div>
        </div>
      </header>
      <CategoriesList />
    </>
  );
};
