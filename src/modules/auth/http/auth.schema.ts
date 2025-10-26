import { errorSchema } from "@/core/errors/app-error";
import { z } from "zod/v4";

export const authSchemas = {
  login: {
    summary: 'Login',
    description: 'Login',
    tags: ['auth'],
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
    response: {
      200: z.object({
        status: z.boolean(),
        message: z.string(),
        data: z.object({
          token: z.string(),
        }),
      }),
      400: errorSchema,
      500: errorSchema,
    },
  },
};