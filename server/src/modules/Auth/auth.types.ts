export interface UserLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CookieConfig {
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
  maxAge: number;
}