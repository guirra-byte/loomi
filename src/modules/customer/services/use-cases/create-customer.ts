import { PrismaClient } from "@prisma/client";
import { CustomerAlreadyExistsError } from "../../errors";
import { UserNotFoundError } from "@/modules/users/errors";

interface CreateCustomerRequest {
  userId: string;
}

interface CreateCustomerResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export class CreateCustomerUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const customerExists = await this.prisma.customer.findUnique({
      where: { userId: data.userId },
    });

    if (customerExists) {
      throw new CustomerAlreadyExistsError();
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new UserNotFoundError();
    }

    const customer = await this.prisma.customer.create({
      data: {
        userId: userExists.id,
        name: userExists.name,
        email: userExists.email,
        password: userExists.password,
      },
    });

    return {
      id: customer.id,
      userId: customer.userId,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };
  }
}

