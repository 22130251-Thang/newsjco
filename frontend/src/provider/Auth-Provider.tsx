import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { fetchCurrentUser, setInitialized } from "../lib/store/slices/authSlice";
import { connectSocket, disconnectSocket } from "../lib/socket";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const { isInitialized, isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchCurrentUser());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connectSocket(user.id);
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user?.id]);

  if (!isInitialized) {
    return <div className="h-screen w-full flex items-center justify-center">Loading App...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;