import { LoginUseCase } from "../use-cases/login";
import prisma from "@/core/libs/prisma/client";

export function makeLogin() {
  const loginUseCase = new LoginUseCase(prisma);
  return loginUseCase;
}