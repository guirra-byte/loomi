import { FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { ForbiddenError } from "../errors/errors";

export async function selfOrAdminGuard(req: FastifyRequest) {
  const user = req.user;
  const targetUserId = (req.params as { id: string }).id;
  if (user.role !== Role.ADMIN && user.id !== targetUserId) {
    throw new ForbiddenError();
  }
}

