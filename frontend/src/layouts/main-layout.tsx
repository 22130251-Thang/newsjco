import { Outlet } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { BackToTop } from "../components/shared/BackToTop";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Outlet />
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};
