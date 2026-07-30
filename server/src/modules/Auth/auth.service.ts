import createHttpError, { type HttpError } from "http-errors";
import { AuthRepository } from "./auth.repository.js";
import type { RegisterUserDto } from "./dto/register-user.dto.js";
import authUtils from "./auth.utils.js";
import bcrypt from "bcrypt";
import VerificationTemplate from "../../templates/VerificationEmail.js";
import { sendEmail } from "../../services/mail/sendMail.js";
import type { User } from "../../generated/prisma/client.js";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  public async register(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);
    //--validate user
    if (existingUser) {
      throw createHttpError(409, "Email is already Registered");
    }

    //--creating user

    //hash password
    const hashedPassword = await bcrypt.hash(dto.password, 11);

    //create db data payload
    const data = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
    };
    //run db query
    const newUser = await this.authRepository.createUser(data);

    return newUser;
  }

  public async sendVerificationEmail(email: string): Promise<unknown | HttpError> {
    const existingUser = await this.authRepository.findUserByEmail(email);
    //--validate user
    if (!existingUser) {
      throw createHttpError(401, "Invalid Email");
    }

    if (existingUser.isVerified) {
      throw createHttpError(403, "Invalid Request");
    }

    // --Email Verification
    const OTP = authUtils.generateOTP();

    const template = VerificationTemplate(
      existingUser.firstName + existingUser.lastName,
      existingUser.email,
      OTP,
    );

    await sendEmail(existingUser.email, "Verification OTP", template);

    return {
      success: true,
      message: "OTP sent to registered email",
    };
  }
}

export const authService = new AuthService(new AuthRepository());
