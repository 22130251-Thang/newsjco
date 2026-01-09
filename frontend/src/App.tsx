import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./provider/Auth-Provider";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { HomePage } from "./pages/homepage/HomePage";
import { MainLayout } from "./layouts/main-layout";
import { ArticleDetail } from "./pages/articledetails/ArticleDetail";
import { CategoryPage } from "./pages/category/CategoryPage";
import { Login, Signup } from "./pages/authentication";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { BookmarksPage } from "./pages/bookmarks/BookmarksPage";
import { SearchPage } from "./pages/search/SearchPage";
import { NotFound } from "./pages/error";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<SearchPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
              </Route>
              <Route path="/:category" element={<CategoryPage />} />
              <Route path="/:category/:slug" element={<ArticleDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>

        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
