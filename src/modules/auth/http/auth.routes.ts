import { FastifyInstance } from "fastify";
import { authSchemas } from "./auth.schema";
import { AuthController } from "./auth.controller";

export default function AuthRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/login', { schema: authSchemas.login }, AuthController.login);
}