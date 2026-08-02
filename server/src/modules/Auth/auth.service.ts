import { AuthRepository } from "./auth.repository.js";

//utils
import createHttpError from "http-errors";
import VerificationTemplate from "../../templates/VerificationEmail.js";
import { sendEmail } from "../../services/mail/sendMail.js";
import authUtils from "./auth.utils.js";
import _config from "../../config/config.js";

//types
import type * as dtos from "./auth.dto.js";
import { Prisma, VerificationTokenType, type User } from "../../generated/prisma/client.js";
import type { NewRoatedToken, UserLoginResponse } from "./auth.types.js";
import forgetPassowrdTemplete from "../../templates/ForgetPassword.js";

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
    const hashedPassword = await authUtils.hashPassword(dto.password);

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

  public async login(dto: dtos.LoginDto,context: dtos.LoginDeviceDto,): Promise<UserLoginResponse> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);

    if (!existingUser) {
      throw createHttpError(404, "Resource not found");
    }

    if (!existingUser.isVerified) {
      throw createHttpError(401, "User isn't verified");
    }

    const existingSession = await this.authRepository.findSessionByUserId(
      existingUser.id,
      context.ip,
      context.userAgent,
    );

    if (existingSession) {
      await this.authRepository.deleteSessionById(existingSession.id);
    }

    const hashedPassword = await authUtils.comparePassword(dto.password, existingUser.password);
    if (!hashedPassword) {
      throw createHttpError(401, "Invalid Email or Password");
    }

    //refreshToken
    const refreshToken = authUtils.createRefreshToken(existingUser.id, existingUser.email);
    const refreshTokenHash = authUtils.generateHash(refreshToken);
    //create Session
    const data: Prisma.SessionCreateInput = {
      ip: context.ip,
      userAgent: context.userAgent,
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: { connect: { id: existingUser.id } },
    };

    const seesion = await this.authRepository.createSession(data);

    //accessToken
    const accessToken = authUtils.createAccessToken(
      existingUser.id,
      existingUser.email,
      seesion.id,
    );

    return {
      accessToken,
      refreshToken,
      user: existingUser,
    };
  }

  public async rotateToken(dto : dtos.RotateTokenDto, context : dtos.LoginDeviceDto) : Promise<NewRoatedToken> {

    const decode = authUtils.decodeRefreshToken(dto.refreshToken);

    const user = await this.authRepository.findUserByEmail(decode.email);

    if(!user){
      throw createHttpError(404,"Resource(user) not Found Request");
    }

    const session = await this.authRepository.findSessionByUserId(decode.id, context.ip, context.userAgent);

    if(!session){
      throw createHttpError(404, "Session Expired");
    }

    const refreshToken = authUtils.createRefreshToken(decode.id, decode.email);

    const accessToken = authUtils.createAccessToken(decode.id, decode.email, session.id);

    const refreshTokenHash = authUtils.generateHash(refreshToken);

    await this.authRepository.updateSessionById(session.id, context.ip, context.userAgent, refreshTokenHash);

    const data : NewRoatedToken = {accessToken, refreshToken}

    return data;
  }

  public async logout(dto : dtos.logoutDto, context : dtos.LoginDeviceDto): Promise<void>{

    const decode = authUtils.decodeRefreshToken(dto.refreshToken);

    const session = await this.authRepository.findSessionByUserId(decode.id, context.ip, context.userAgent);

    if(!session){
      throw createHttpError(404,"Session is expired");
    }

    await this.authRepository.deleteSessionById(session.id);

    return Promise.resolve();
  } 

  public async logoutAll(dto : dtos.logoutDto, context : dtos.LoginDeviceDto): Promise<void>{
    const decode = authUtils.decodeRefreshToken(dto.refreshToken);

    const session = await this.authRepository.findSessionByUserId(decode.id, context.ip, context.userAgent);

    if(!session){
      throw createHttpError(404,"Session is expired");
    }

    await this.authRepository.deleteSessionsByUserId(decode.id);

    return Promise.resolve();
  }

  public async sendForgetPasswordLink(dto : dtos.ForgetPasswordLinkDto){
    
    const user = await this.authRepository.findUserByEmail(dto.email);

    if(!user){
      throw createHttpError(404,"Inavalid Request");
    }

    await this.authRepository.deleteVerificationTokens(user.id, VerificationTokenType.RESET_PASSWORD);

    const token = authUtils.generateRandomToken();
   
    const hashedToken = authUtils.generateHash(token);

    const data : Prisma.VerificationTokenCreateInput = {
      type : VerificationTokenType.RESET_PASSWORD,
      user : {connect : {id : user.id,}},
      token : hashedToken,
      expiresAt : new Date(Date.now() + 10 * 60000)
    }

    await this.authRepository.createVerificationToken(data)
    
    const url = `${_config.clientUrl}/reset-password?token=${token}`

    await sendEmail(dto.email, "Password Reset Request", forgetPassowrdTemplete(url));
  }

  public async resetPassword(dto : dtos.ResetPasswordDto){
    const hashToken = authUtils.generateHash(dto.token);

    const tokenRecord = await this.authRepository.findVerificationToken(hashToken,VerificationTokenType.RESET_PASSWORD);

    if(!tokenRecord){
      throw createHttpError(404,"Invalid Request");
    }

    const user = await this.authRepository.findUserById(tokenRecord.userId);

    if(!user){
      throw createHttpError(404,"Invalid Request");
    }

    const hashedPassword = await authUtils.hashPassword(dto.password);

    await this.authRepository.deleteSessionsByUserId(user.id);

    await this.authRepository.updateUserPassword(user.id, hashedPassword);

    await this.authRepository.deleteVerificationTokens(user.id, VerificationTokenType.RESET_PASSWORD);
  }

  public async validateToken(dto : dtos.ValidateTokenDto) : Promise<void>{
    const hashToken = authUtils.generateHash(dto.token);
    const tokenRecord = await this.authRepository.findVerificationToken(hashToken,VerificationTokenType.RESET_PASSWORD);
    if(!tokenRecord){
      throw createHttpError(404,"Link is Expired sent new one");
    }
  }
}

export const authService = new AuthService(new AuthRepository());
