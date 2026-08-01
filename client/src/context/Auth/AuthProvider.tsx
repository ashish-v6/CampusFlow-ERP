import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Props, User } from "./Types";
import { clearAccessToken, getAccessToken, setAccessToken } from "./AcessToken";
import { rotateToken } from "../../services/auth.services";
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
      console.log(result);
      setAccessToken(result.accessToken);
      console.log(getAccessToken())
    }catch(error){
      if(error instanceof AxiosError){
        toast.error(error.message);
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
