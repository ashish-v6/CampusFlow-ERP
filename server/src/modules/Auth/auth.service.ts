import createHttpError, { type HttpError } from "http-errors";
import { AuthRepository } from "./auth.repository.js";
import type { RegisterUserDto } from "./dto/register-user.dto.js";
import authUtils from "./auth.utils.js";
import bcrypt from "bcrypt";
import VerificationTemplate from "../../templates/VerificationEmail.js";
import { sendEmail } from "../../services/mail/sendMail.js";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  public async register(dto: RegisterUserDto): Promise<unknown | HttpError> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);
    //--validate user
    if (existingUser) {
      return createHttpError(409, "Email is already Registered");
    }

    //--creating user

    //hash password
    const hashedPassword = await bcrypt.hash(dto.password, 11);

    //create db data payload
    const data: RegisterUserDto = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
    };
    //run db query
    const newUser = await this.authRepository.createUser(data);

    //--Email Verification
    const OTP = authUtils.generateOTP();

    const template = VerificationTemplate(newUser.firstName + newUser.lastName, newUser.email, OTP);

    await sendEmail(newUser.email, "Verification OTP", template);

    return newUser;
  }
}

export const authService = new AuthService(new AuthRepository());
