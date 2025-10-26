import prisma from "@/core/libs/prisma/client";
import { CreateCustomerUseCase } from "../use-cases/create-customer";

export function makeCreateCustomer() {
  const createCustomerUseCase = new CreateCustomerUseCase(prisma);
  return createCustomerUseCase;
}

