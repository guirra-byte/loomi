import { FastifyReply, FastifyRequest } from "fastify";
import { orderSchemas } from "./order.schema";
import { z } from "zod/v4";
import { AppError } from "@/core/errors/app-error";
import { makeNewOrder } from "../services/factories/make-new-order";
import { makeUpdateOrderStatus } from "../services/factories/make-update-order-status";

type NewOrderRequest = FastifyRequest<{ Body: z.infer<typeof orderSchemas.createOrder.body> }>;
type UpdateOrderStatusRequest = FastifyRequest<{ Body: z.infer<typeof orderSchemas.updateOrderStatus.body> }>;

export default class OrderController {
  static async createOrder(req: NewOrderRequest, res: FastifyReply) {
    try {
      const { customerId, products } = req.body;

      const newOrderUseCase = makeNewOrder();
      const order = await newOrderUseCase.execute({ customerId, products });

      res.status(201).send(order);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send(error);
      }

      res.status(500).send(new AppError('Internal server error', 500));
    }
  }

  static async updateOrderStatus(req: UpdateOrderStatusRequest, res: FastifyReply) {
    try {
      const { orderId, status } = req.body;

      const updateOrderStatusUseCase = makeUpdateOrderStatus();
      const order = await updateOrderStatusUseCase.execute(orderId, status);

      res.status(200).send(order);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send(error);
      }

      res.status(500).send(new AppError('Internal server error', 500));
    }
  }
}