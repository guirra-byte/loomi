import { errorSchema } from "@/core/errors/app-error";
import { OrderStatus } from "@prisma/client";
import { z } from "zod/v4";

export const orderSchemas = {
  createOrder: {
    summary: 'Create a new order',
    description: 'Create a new order',
    tags: ['orders'],
    body: z.object({
      customerId: z.string(),
      products: z.array(z.object({ id: z.string(), quantity: z.number() })),
    }),
    response: {
      201: z.object({ id: z.string() }),
      400: errorSchema,
      500: errorSchema,
    },
  },
  updateOrderStatus: {
    summary: 'Update the status of an order',
    description: 'Update the status of an order',
    tags: ['orders'],
    body: z.object({
      orderId: z.string(),
      status: z.enum(OrderStatus),
    }),
    response: {
      200: z.object({ id: z.string() }),
      400: errorSchema,
      500: errorSchema,
    },
  },
};