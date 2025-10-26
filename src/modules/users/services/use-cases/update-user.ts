import { PrismaClient, Role } from "@prisma/client";
import { UserAlreadyExistsError, UserNotFoundError } from "../../errors";
import bcrypt from "bcrypt";
import redisClient from "@/core/libs/redis/client";

interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "CUSTOMER";
}

interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class UpdateUserUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(userId: string, data: UpdateUserRequest, _requestingUserId: string, requestingUserRole: Role): Promise<UpdateUserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    if (data.role && requestingUserRole !== Role.ADMIN) {
      delete data.role;
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new UserAlreadyExistsError();
      }
    }

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(data.role && requestingUserRole === Role.ADMIN && { role: data.role }),
      },
    });

    const redis = await redisClient;
    await redis.del(`user:${userId}`);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }
}

