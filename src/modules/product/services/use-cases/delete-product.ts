import { PrismaClient } from "@prisma/client";
import { ProductNotFoundError } from "../../errors";

export class DeleteProductUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }
}

