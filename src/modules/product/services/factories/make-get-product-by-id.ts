import prisma from "@/core/libs/prisma/client";
import { GetProductByIdUseCase } from "../use-cases/get-product-by-id";

export function makeGetProductById() {
  const getProductByIdUseCase = new GetProductByIdUseCase(prisma);
  return getProductByIdUseCase;
}

