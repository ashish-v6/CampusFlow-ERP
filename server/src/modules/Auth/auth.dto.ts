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

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginDeviceDto {
  ip: string;
  userAgent: string;
}

export interface RotateTokenDto {
  refreshToken: string;
}

export interface logoutDto {
  refreshToken: string;
}

export interface ForgetPasswordLinkDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface ValidateTokenDto {
  token: string;
}
