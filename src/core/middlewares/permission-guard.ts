import { FastifyReply, FastifyRequest } from "fastify";
import { AccessDeniedError } from "../errors/permission-guard-error";
import { Role } from "@prisma/client";

export async function permissionGuard(req: FastifyRequest, requiredRole: keyof typeof Role) {
  const user = req.user;
  if (user.role !== Role[requiredRole]) {
    throw new AccessDeniedError();
  }
}