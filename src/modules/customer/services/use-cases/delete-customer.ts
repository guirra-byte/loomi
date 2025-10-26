import { PrismaClient } from "@prisma/client";
import { CustomerNotFoundError } from "../../errors";

export class DeleteCustomerUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(id: string): Promise<void> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    await this.prisma.customer.delete({
      where: { id },
    });
  }
}

