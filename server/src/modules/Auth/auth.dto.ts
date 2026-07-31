export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SendVerificationEmailDto {
  email: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}
