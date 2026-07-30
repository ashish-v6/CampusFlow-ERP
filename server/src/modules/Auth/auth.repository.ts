import prisma from "../../utils/prisma.js";
import type {
  Prisma,
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

  // createUser()
  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  // deleteVerificationTokens()
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

  // createVerificationToken()
  public async createVerificationToken(
    data: Prisma.VerificationTokenCreateInput,
  ): Promise<VerificationToken> {
    return prisma.verificationToken.create({
      data,
    });
  }
}

export const authRepository = new AuthRepository();
