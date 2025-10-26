import { PrismaClient } from "@prisma/client";
import { ProductAlreadyExistsError, ProductNotFoundError } from "../../errors";

interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

interface UpdateProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export class UpdateProductUseCase {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(id: string, data: UpdateProductRequest): Promise<UpdateProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    if (data.name && data.name !== product.name) {
      const productWithSameName = await this.prisma.product.findUnique({
        where: { name: data.name },
      });

      if (productWithSameName) {
        throw new ProductAlreadyExistsError();
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
      },
    });

    return {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      createdAt: updatedProduct.createdAt.toISOString(),
      updatedAt: updatedProduct.updatedAt.toISOString(),
    };
  }
}

