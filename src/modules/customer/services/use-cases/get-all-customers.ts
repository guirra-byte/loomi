import { PrismaClient } from "@prisma/client";

interface CustomerResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export class GetAllCustomersUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(): Promise<CustomerResponse[]> {
    const customers = await this.prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return customers.map(customer => ({
      id: customer.id,
      userId: customer.userId,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    }));
  }
}

