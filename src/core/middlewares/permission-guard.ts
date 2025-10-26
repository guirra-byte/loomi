import { FastifyReply, FastifyRequest } from "fastify";
import { AccessDeniedError } from "../errors/permission-guard-error";
import { Role } from "@prisma/client";

export function permissionGuard(requiredRole: keyof typeof Role) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user;
    if (user.role !== Role[requiredRole]) {
      throw new AccessDeniedError();
    }
    
    return res.status(200).send({ message: 'Access granted' });
  };
}