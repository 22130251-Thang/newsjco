import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./provider/Auth-Provider";
import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage } from "./pages/homepage/HomePage";
import { MainLayout } from "./layouts/main-layout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<></>} />
            </Route>
          </Route>
          <Route path="*" element={<>Not found</>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
