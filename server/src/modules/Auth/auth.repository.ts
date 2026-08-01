import prisma from "../../utils/prisma.js";
import type {
  Prisma,
  Session,
  User,
  VerificationToken,
  VerificationTokenType,
} from "../../generated/prisma/client.js";

export class AuthRepository {
  public async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  public async markUserAsVerified(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isVerified: true },
    });
  }

  public async deleteVerificationTokens(
    userId: string,
    type: VerificationTokenType,
  ): Promise<void> {
    await prisma.verificationToken.deleteMany({
      where: {
        userId,
        type,
      },
    });
  }

  public async createVerificationToken(
    data: Prisma.VerificationTokenCreateInput,
  ): Promise<VerificationToken> {
    return prisma.verificationToken.create({
      data,
    });
  }

  public async checkUserHasOtp(
    email: string,
    token: string,
    type: VerificationTokenType,
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        verificationTokens: {
          some: {
            token,
            type,
            expiresAt: { gt: new Date(Date.now()) },
          },
        },
      },
    });
  }

  public async createSession(data: Prisma.SessionCreateInput): Promise<Session> {
    return prisma.session.create({ data });
  }

  public async findSessionByUserId(id: string, ip: string): Promise<Session | null> {
    return prisma.session.findFirst({
      where: {
        userId: id,
        ip,
      },
    });
  }

  public async deleteSessionsByUserId(id: string): Promise<Prisma.BatchPayload> {
    return prisma.session.deleteMany({
      where: { userId: id },
    });
  }

  public async deleteSessionById(id: string): Promise<void> {
    await prisma.session.delete({
      where: { id },
    });
    return Promise.resolve();
  }

  public async updateSessionById(
    id: string,
    ip: string,
    refreshTokenHash: string,
  ): Promise<Session> {
    return prisma.session.update({
      where: {
        id,
        ip,
      },
      data: {
        refreshTokenHash,
        expiresAt : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
    });
  }
}

export const authRepository = new AuthRepository();
