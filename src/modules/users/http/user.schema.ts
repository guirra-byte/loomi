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
  updateUser: {
    summary: 'Update user',
    description: 'Update user information. Only the user themselves or an admin can update',
    tags: ['users'],
    params: z.object({
      id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
      name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
      email: z.string().email('E-mail inválido').optional(),
      password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
      role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
    }),
    response: {
      200: z.object({ 
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.string(),
      }),
      400: errorSchema,
      403: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};

