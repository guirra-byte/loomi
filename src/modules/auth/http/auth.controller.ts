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
      return res.status(200).send({
        status: true,
        message: 'Login successful',
        data: { token },
      });
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
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}