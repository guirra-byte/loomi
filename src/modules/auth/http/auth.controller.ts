import { AppError } from "@/core/errors/app-error";
import { authSchemas } from "./auth.schema";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod/v4";
import { makeLogin } from "../services/factories/make-login";

type LoginRequest = FastifyRequest<{ Body: z.infer<typeof authSchemas.login.body> }>;
export class AuthController {
  static async login(req: LoginRequest, res: FastifyReply) {
    try {
      const { email, password } = req.body;
      const useLoginUseCase = makeLogin();

      const token = await useLoginUseCase.execute(email, password);
      res.status(200).send({ token });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send(error);
      }
    }
  }
}