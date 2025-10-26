import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import redisClient from "../libs/redis/client";
import { UnauthorizedError } from "../errors/verify-auth-token-error";
import { Role } from "@prisma/client";
import prisma from "@/core/libs/prisma/client";
import { AppError } from "../errors/app-error";

config();
export async function verifyAuthToken(req: FastifyRequest, res: FastifyReply) {
  const authorizationHeader = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || !authorizationHeader) {
    throw new UnauthorizedError();
  }

  if (authorizationHeader) {
    const [, authToken] = authorizationHeader.split(' ');

    try {
      let decoded: { userId: string };

      try {
        const payload = jwt.verify(authToken, jwtSecret) as { userId: string };
        decoded = { userId: payload.userId };
      } catch (error) {
        throw error;
      }

      const redis = await redisClient;
      const cachedUserToken = await redis.get(`user:${decoded.userId}`);
      if (!cachedUserToken) {
        const user = await prisma.user.findUnique({
          where: {
            id: decoded.userId,
          },
        });

        if (!user) {
          throw new UnauthorizedError();
        }

        await redis.set(
          `user:${decoded.userId}`,
          JSON.stringify({ token: authToken, role: user.role }),
          { EX: 60 * 60 * 24 }
        );

        req.user = { id: user.id, role: user.role };
      } else {
        const { role } = JSON.parse(cachedUserToken) as { role: Role };
        req.user = { id: decoded.userId, role };
      }
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
      });
    }
  }
}