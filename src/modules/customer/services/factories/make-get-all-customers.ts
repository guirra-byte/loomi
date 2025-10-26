import prisma from "@/core/libs/prisma/client";
import { GetAllCustomersUseCase } from "../use-cases/get-all-customers";

export function makeGetAllCustomers() {
  const getAllCustomersUseCase = new GetAllCustomersUseCase(prisma);
  return getAllCustomersUseCase;
}

