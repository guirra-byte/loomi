import { errorSchema } from "@/core/errors/app-error";
import { z } from "zod/v4";

export const productSchemas = {
  createProduct: {
    summary: 'Create a new product',
    description: 'Create a new product in the system',
    tags: ['products'],
    body: z.object({
      name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
      description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
      price: z.number().positive('Preço deve ser maior que zero'),
      stock: z.number().int().nonnegative('Estoque deve ser um número inteiro não negativo').optional().default(0),
    }),
    response: {
      201: z.object({ 
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        stock: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
      400: errorSchema,
      500: errorSchema,
    },
  },
  getAllProducts: {
    summary: 'Get all products',
    description: 'Retrieve all products from the system',
    tags: ['products'],
    response: {
      200: z.array(z.object({ 
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        stock: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })),
      500: errorSchema,
    },
  },
  getProductById: {
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its ID',
    tags: ['products'],
    params: z.object({
      id: z.string().uuid('ID inválido'),
    }),
    response: {
      200: z.object({ 
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        stock: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
      404: errorSchema,
      500: errorSchema,
    },
  },
  updateProduct: {
    summary: 'Update a product',
    description: 'Update an existing product',
    tags: ['products'],
    params: z.object({
      id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
      name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
      description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres').optional(),
      price: z.number().positive('Preço deve ser maior que zero').optional(),
      stock: z.number().int().nonnegative('Estoque deve ser um número inteiro não negativo').optional(),
    }),
    response: {
      200: z.object({ 
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        stock: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
  deleteProduct: {
    summary: 'Delete a product',
    description: 'Delete a product from the system',
    tags: ['products'],
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

