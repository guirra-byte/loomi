import { errorSchema } from "@/core/errors/app-error";
import { z } from "zod/v4";

export const userSchemas = {
  createUser: {
    summary: 'Create a new user',
    description: 'Create a new user in the system',
    tags: ['users'],
    body: z.object({
      name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
      email: z.string().email('E-mail inválido'),
      password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
      role: z.enum(["ADMIN", "CUSTOMER"]).optional().default("CUSTOMER"),
    }),
    response: {
      201: z.object({ 
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.string(),
      }),
      400: errorSchema,
      500: errorSchema,
    },
  },
};

