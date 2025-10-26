import { FastifyReply, FastifyRequest } from "fastify";
import { userSchemas } from "./user.schema";
import { z } from "zod/v4";
import { AppError } from "@/core/errors/app-error";
import { makeCreateUser } from "../services/factories/make-create-user";
import { makeUpdateUser } from "../services/factories/make-update-user";

type CreateUserRequest = FastifyRequest<{ 
  Body: z.infer<typeof userSchemas.createUser.body> 
}>;

type UpdateUserRequest = FastifyRequest<{
  Params: z.infer<typeof userSchemas.updateUser.params>,
  Body: z.infer<typeof userSchemas.updateUser.body>
}>;

export default class UserController {
  static async createUser(req: CreateUserRequest, res: FastifyReply) {
    try {
      const { name, email, password } = req.body;

      const createUserUseCase = makeCreateUser();
      const user = await createUserUseCase.execute({ 
        name, 
        email, 
        password,
      });

      res.status(201).send(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).send({
          status: false,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  static async updateUser(req: UpdateUserRequest, res: FastifyReply) {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;
      const requestingUser = req.user;

      const updateUserUseCase = makeUpdateUser();
      const user = await updateUserUseCase.execute(
        id, 
        { name, email, password, role },
        requestingUser.id,
        requestingUser.role
      );

      res.status(200).send(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).send({
          status: false,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}

