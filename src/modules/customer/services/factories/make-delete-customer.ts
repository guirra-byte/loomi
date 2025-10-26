import prisma from "@/core/libs/prisma/client";
import { DeleteCustomerUseCase } from "../use-cases/delete-customer";

export function makeDeleteCustomer() {
  const deleteCustomerUseCase = new DeleteCustomerUseCase(prisma);
  return deleteCustomerUseCase;
}

