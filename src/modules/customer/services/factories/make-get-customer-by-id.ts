import prisma from "@/core/libs/prisma/client";
import { GetCustomerByIdUseCase } from "../use-cases/get-customer-by-id";

export function makeGetCustomerById() {
  const getCustomerByIdUseCase = new GetCustomerByIdUseCase(prisma);
  return getCustomerByIdUseCase;
}

