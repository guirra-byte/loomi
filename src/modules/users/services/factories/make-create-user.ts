import prisma from "@/core/libs/prisma/client";
import { CreateUserUseCase } from "../use-cases/create-user";

export function makeCreateUser() {
  const createUserUseCase = new CreateUserUseCase(prisma);
  return createUserUseCase;
}

