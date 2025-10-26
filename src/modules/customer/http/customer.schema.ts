import { errorSchema } from "@/core/errors/app-error";
import { z } from "zod/v4";

export const customerSchemas = {
  createCustomer: {
    summary: 'Create a new customer',
    description: 'Create a new customer in the system',
    tags: ['customers'],
    body: z.object({
      userId: z.string(),
    }),
    response: {
      201: z.object({
        status: z.boolean(),
        message: z.string(),
        data: z.object({
          id: z.string(),
          userId: z.string(),
          name: z.string(),
          email: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      }),
      400: errorSchema,
      500: errorSchema,
    },
  },
  getAllCustomers: {
    summary: 'Get all customers',
    description: 'Retrieve all customers from the system',
    tags: ['customers'],
    response: {
      200: z.array(z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        email: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })),
      500: errorSchema,
    },
  },
  getCustomerById: {
    summary: 'Get customer by ID',
    description: 'Retrieve a specific customer by its ID',
    tags: ['customers'],
    params: z.object({
      id: z.string().uuid('ID inválido'),
    }),
    response: {
      200: z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        email: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
      404: errorSchema,
      500: errorSchema,
    },
  },
  updateCustomer: {
    summary: 'Update a customer',
    description: 'Update an existing customer',
    tags: ['customers'],
    params: z.object({
      id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
      name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
      email: z.string().email('E-mail inválido').optional(),
      password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
    }),
    response: {
      200: z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        email: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
  deleteCustomer: {
    summary: 'Delete a customer',
    description: 'Delete a customer from the system',
    tags: ['customers'],
    params: z.object({
      id: z.string().uuid('ID inválido'),
    }),
    response: {
      204: z.void(),
      404: errorSchema,
      500: errorSchema,
    },
  },
};

