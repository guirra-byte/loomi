import { PrismaClient } from "@prisma/client";
import { UserAlreadyExistsError } from "../../errors";
import bcrypt from "bcrypt";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "CUSTOMER";
}

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class CreateUserUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(data: CreateUserRequest): Promise<CreateUserResponse> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "CUSTOMER",
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

