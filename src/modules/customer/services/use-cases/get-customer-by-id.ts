import { PrismaClient } from "@prisma/client";
import { CustomerNotFoundError } from "../../errors";

interface CustomerResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export class GetCustomerByIdUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(id: string): Promise<CustomerResponse> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }

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

