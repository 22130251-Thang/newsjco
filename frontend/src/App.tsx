import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./provider/Auth-Provider";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<></>} />
          <Route path="/" element={<></>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<></>} />
          </Route>

          <Route path="*" element={<></>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;