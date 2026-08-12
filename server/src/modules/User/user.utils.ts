import bcrypt from "bcrypt";

export const verifyPassword = async (
  currentPassword: string,
  password: string,
): Promise<boolean> => {
  return bcrypt.compare(password, currentPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 11);
};
