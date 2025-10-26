import prisma from "@/core/libs/prisma/client";
import { CreateProductUseCase } from "../use-cases/create-product";

export function makeCreateProduct() {
  const createProductUseCase = new CreateProductUseCase(prisma);
  return createProductUseCase;
}

