export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified : boolean;
  role : string;
  status : string;
  createdAt : Date;
}

export interface AuthContextType {
  user: User | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

export interface Props {
  children: React.ReactNode;
}
