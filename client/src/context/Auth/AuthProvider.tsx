import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { Props, User } from "./Types";
import { clearAccessToken, setAccessToken } from "./AcessToken";

function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const login = (accessToken: string, user: User): void => {
    setUser(user);
    setAccessToken(accessToken);
  };

  const logout = (): void => {
    setUser(null);
    clearAccessToken();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
