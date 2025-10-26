import prisma from "@/core/libs/prisma/client";
import { UpdateProductUseCase } from "../use-cases/update-product";

export function makeUpdateProduct() {
  const updateProductUseCase = new UpdateProductUseCase(prisma);
  return updateProductUseCase;
}

