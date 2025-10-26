import { FastifyInstance } from "fastify";
import UserController from "./user.controller";
import { userSchemas } from "./user.schema";

export default function UserRoutes(fastify: FastifyInstance) {
  fastify.post('/users', { schema: userSchemas.createUser }, UserController.createUser);
}

