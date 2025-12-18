import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { fetchCurrentUser } from "../lib/store/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  const token = localStorage.getItem("token");
  if (token && !isInitialized) {
    return <div className="h-screen w-full flex items-center justify-center">Loading App...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;