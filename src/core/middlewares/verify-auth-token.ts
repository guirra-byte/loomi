import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors/app-error";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import redisClient from "../libs/redis/client";
import prisma from "../libs/prisma/client";
import { UnauthorizedError } from "../errors/verify-auth-token-error";
import { Role } from "@prisma/client";

config();
export async function verifyAuthToken(req: FastifyRequest, res: FastifyReply) {
  try {
    const authorizationHeader = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || !authorizationHeader) {
      throw new UnauthorizedError();
    }

    if (authorizationHeader) {
      const [, authToken] = authorizationHeader.split(' ');
      const redis = await redisClient;

      const decoded = jwt.verify(authToken, jwtSecret) as { userId: string };
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

      return res.status(200).send({ message: 'Token is valid' });
    }
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).send(error);
    }
  }
}