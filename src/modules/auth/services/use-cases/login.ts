import { PrismaClient } from "@prisma/client";
import { UserNotFoundError } from "../../errors";
import { config } from "dotenv";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

config();
export class LoginUseCase {
  constructor(private readonly prisma: PrismaClient) { }
  async execute(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UserNotFoundError();
    }

    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not set');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
}