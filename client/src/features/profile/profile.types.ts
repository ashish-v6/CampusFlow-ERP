export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  initials: string;
}
