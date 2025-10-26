import prisma from "@/core/libs/prisma/client";
import { DeleteProductUseCase } from "../use-cases/delete-product";

export function makeDeleteProduct() {
  const deleteProductUseCase = new DeleteProductUseCase(prisma);
  return deleteProductUseCase;
}

