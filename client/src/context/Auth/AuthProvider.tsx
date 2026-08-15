import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Props, User } from "./Types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./AcessToken";
import { clearCookie, rotateToken } from "../../features/auth/services/auth.services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import AuthLoading from "../../components/AuthLoading";

function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  // Start in verification mode on mount so ProtectedRoute waits for session restoration
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  const login = (accessToken: string, user: User): void => {
    setUser(user);
    setAccessToken(accessToken);
  };

  const silentRefresh = async () => {
    setIsVerifying(true);
    try {
      const result = await rotateToken();
      setAccessToken(result.accessToken);
      setUser(result.user);
    } catch (error) {
      // If session restoration fails, ensure user and access token are reset
      logout();
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          await clearCookie();
        }
      } else {
        console.error("Session restoration error:", error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    clearAccessToken();
  };

  useEffect(() => {
    silentRefresh();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        isVerifying,
        login,
        logout,
      }}
    >
      {isVerifying ? <AuthLoading/> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
