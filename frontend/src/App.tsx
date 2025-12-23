import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./provider/Auth-Provider";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage } from "./pages/homepage/HomePage";
import { MainLayout } from "./layouts/main-layout";
import { ArticleDetail } from "./pages/articledetails/ArticleDetail";
import { CategoryPage } from "./pages/category/CategoryPage";
import { Login, Signup } from "./pages/authentication";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/:category" element={<CategoryPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<></>} />
              </Route>
              <Route path="/:category/:slug" element={<ArticleDetail />} />
            </Route>
            <Route path="*" element={<>Not found</>} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
