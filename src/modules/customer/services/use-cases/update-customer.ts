import { PrismaClient } from "@prisma/client";
import { CustomerAlreadyExistsError, CustomerNotFoundError } from "../../errors";
import bcrypt from "bcrypt";

interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  password?: string;
}

interface UpdateCustomerResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export class UpdateCustomerUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(id: string, data: UpdateCustomerRequest): Promise<UpdateCustomerResponse> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    if (data.email && data.email !== customer.email) {
      const customerWithSameEmail = await this.prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (customerWithSameEmail) {
        throw new CustomerAlreadyExistsError();
      }
    }

    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    return {
      id: updatedCustomer.id,
      userId: updatedCustomer.userId,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      createdAt: updatedCustomer.createdAt.toISOString(),
      updatedAt: updatedCustomer.updatedAt.toISOString(),
    };
  }
}

