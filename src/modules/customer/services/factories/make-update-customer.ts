import prisma from "@/core/libs/prisma/client";
import { UpdateCustomerUseCase } from "../use-cases/update-customer";

export function makeUpdateCustomer() {
  const updateCustomerUseCase = new UpdateCustomerUseCase(prisma);
  return updateCustomerUseCase;
}

