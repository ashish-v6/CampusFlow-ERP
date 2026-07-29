export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

export interface Props {
  children: React.ReactNode;
}
