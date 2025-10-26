import { errorSchema } from "@/core/errors/app-error";
import { z } from "zod/v4";

export const orderSchemas = {
  createOrder: {
    summary: 'Create a new order',
    description: 'Create a new order',
    tags: ['orders'],
    body: z.object({
      products: z.array(z.object({ id: z.string(), quantity: z.coerce.number() })),
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
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      status: z.enum(["OPEN", "PENDING_PAYMENT", "PAID", "CANCELLED", "CLOSED"]),
    }),
    response: {
      200: z.object({ id: z.string() }),
      400: errorSchema,
      500: errorSchema,
    },
  },
  cancelOrder: {
    summary: 'Cancel an order',
    description: 'Cancel an order',
    tags: ['orders'],
    params: z.object({
      id: z.string(),
    }),
    response: {
      200: z.object({ message: z.string() }),
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
  finishOrder: {
    summary: 'Finish an order',
    description: 'Finish an order and send to processing queue',
    tags: ['orders'],
    params: z.object({
      id: z.string(),
    }),
    response: {
      200: z.object({ message: z.string() }),
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
  removeOrderItem: {
    summary: 'Remove item from order',
    description: 'Remove a specific quantity of an item from an order',
    tags: ['orders'],
    params: z.object({
      orderId: z.string(),
      itemId: z.string(),
    }),
    body: z.object({
      quantity: z.coerce.number().min(1).optional().default(1),
    }),
    response: {
      200: z.object({ message: z.string() }),
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
  simulateOrderPayment: {
    summary: 'Simulate order payment',
    description: 'Simulate payment processing for an order',
    tags: ['orders'],
    params: z.object({
      id: z.string(),
    }),
    response: {
      200: z.object({ message: z.string() }),
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};