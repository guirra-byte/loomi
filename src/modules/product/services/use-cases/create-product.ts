import { PrismaClient } from "@prisma/client";
import { ProductAlreadyExistsError } from "../../errors";

interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock?: number;
}

interface CreateProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export class CreateProductUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(data: CreateProductRequest): Promise<CreateProductResponse> {
    const productExists = await this.prisma.product.findUnique({
      where: { name: data.name },
    });

    if (productExists) {
      throw new ProductAlreadyExistsError();
    }

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock ?? 0,
      },
    });

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

