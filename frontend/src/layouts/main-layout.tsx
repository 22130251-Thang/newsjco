import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
