import prisma from "@/core/libs/prisma/client";
import { UpdateUserUseCase } from "../use-cases/update-user";

export function makeUpdateUser() {
  const updateUserUseCase = new UpdateUserUseCase(prisma);
  return updateUserUseCase;
}

