import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Props, User } from "./Types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./AcessToken";
import { clearCookie, rotateToken } from "../../services/auth.services";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const login = (accessToken: string, user: User): void => {
    setUser(user);
    setAccessToken(accessToken);
  };  

  const silentRefresh = async () => {
    setIsVerifying(true);
    try{
      const result = await rotateToken();
      setAccessToken(result.accessToken);
    }catch(error){
      if(error instanceof AxiosError){
        if(error.response?.status === 404){
          logout();
          await clearCookie();
        }
      }else{
        console.log(error);
      }
    }finally{
      setIsVerifying(false);
    }
  }

  const logout = (): void => {
    setUser(null);
    clearAccessToken();
  };

  useEffect(() => {
    silentRefresh();
  },[])
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {isVerifying ? "Loading.." : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
