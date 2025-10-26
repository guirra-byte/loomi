import { FastifyInstance } from "fastify";
import UserController from "./user.controller";
import { userSchemas } from "./user.schema";
import { verifyAuthToken } from "@/core/middlewares/verify-auth-token";
import { selfOrAdminGuard } from "@/core/middlewares/self-or-admin-guard";

export default function UserRoutes(fastify: FastifyInstance) {
  fastify.post('/users', { schema: userSchemas.createUser }, UserController.createUser);
  
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', verifyAuthToken);
    protectedRoutes.addHook('preHandler', selfOrAdminGuard);
    
    protectedRoutes.put('/users/:id', { schema: userSchemas.updateUser }, UserController.updateUser);
  });
}

