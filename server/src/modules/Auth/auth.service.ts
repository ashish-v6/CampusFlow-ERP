import { AuthRepository } from "./auth.repository.js";

//utils
import createHttpError from "http-errors";
import VerificationTemplate from "../../templates/VerificationEmail.js";
import { sendEmail } from "../../services/mail/sendMail.js";
import authUtils from "./auth.utils.js";
import bcrypt from "bcrypt";

//types
import type * as dtos from "./auth.dto.js";
import { Prisma, VerificationTokenType, type User } from "../../generated/prisma/client.js";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  public async register(dto: dtos.RegisterUserDto): Promise<User> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);
    //--validate user
    if (existingUser) {
      throw createHttpError(409, "Email is already Registered");
    }

    //--creating user

    //hash password
    const hashedPassword = await bcrypt.hash(dto.password, 11);

    //create db data payload
    const data: Prisma.UserCreateInput = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
    };
    //run db query
    const newUser = await this.authRepository.createUser(data);

    return newUser;
  }

  public async sendVerificationEmail(dto: dtos.SendVerificationEmailDto): Promise<void> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);
    //--validate user
    if (!existingUser) {
      throw createHttpError(401, "Invalid Email");
    }

    if (existingUser.isVerified) {
      throw createHttpError(403, "Invalid Request");
    }

    await this.authRepository.deleteVerificationTokens(
      existingUser.id,
      VerificationTokenType.EMAIL_VERIFICATION,
    );
    // --Email Verification
    const otp = authUtils.generateOTP();

    const template = VerificationTemplate(
      existingUser.firstName + existingUser.lastName,
      existingUser.email,
      otp,
    );

    const otpHash = authUtils.generateHash(otp);
    const data: Prisma.VerificationTokenCreateInput = {
      user: { connect: { id: existingUser.id } },
      token: otpHash,
      type: VerificationTokenType.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 1000 * 600),
    };
    await this.authRepository.createVerificationToken(data);

    await sendEmail(existingUser.email, "Verification OTP", template);

    return Promise.resolve();
  }

  public async verifyEmail(dto: dtos.VerifyEmailDto): Promise<void> {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw createHttpError(401, "Invalid Request");
    }

    const otpHash = authUtils.generateHash(dto.otp);
    const isValidOtp = await this.authRepository.checkUserHasOtp(
      dto.email,
      otpHash,
      VerificationTokenType.EMAIL_VERIFICATION,
    );

    if (!isValidOtp) {
      throw createHttpError(401, "Invalid Otp");
    }

    await this.authRepository.markUserAsVerified(user.id);

    await this.authRepository.deleteVerificationTokens(
      user.id,
      VerificationTokenType.EMAIL_VERIFICATION,
    );
    return Promise.resolve();
  }
}

export const authService = new AuthService(new AuthRepository());
