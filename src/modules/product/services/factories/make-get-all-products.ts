import prisma from "@/core/libs/prisma/client";
import { GetAllProductsUseCase } from "../use-cases/get-all-products";

export function makeGetAllProducts() {
  const getAllProductsUseCase = new GetAllProductsUseCase(prisma);
  return getAllProductsUseCase;
}

