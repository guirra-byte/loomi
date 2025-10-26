import { PrismaClient } from "@prisma/client";
import { ProductNotFoundError } from "../../errors";

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export class GetProductByIdUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(id: string): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}

