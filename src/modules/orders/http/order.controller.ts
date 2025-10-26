import { FastifyReply, FastifyRequest } from "fastify";
import { orderSchemas } from "./order.schema";
import { z } from "zod/v4";
import { AppError } from "@/core/errors/app-error";
import { makeNewOrder } from "../services/factories/make-new-order";
import { makeUpdateOrderStatus } from "../services/factories/make-update-order-status";
import { makeCancelOrder } from "../services/factories/make-cancel-order";
import { makeFinishOrder } from "../services/factories/make-finish-order";
import { makeRemoveOrderItem } from "../services/factories/make-remove-order-item";
import { makeSimulateOrderPayment } from "../services/factories/make-simulate-order-payment";

type NewOrderRequest = FastifyRequest<{ Body: z.infer<typeof orderSchemas.createOrder.body> }>;

type UpdateOrderStatusRequest = FastifyRequest<{ Body: z.infer<typeof orderSchemas.updateOrderStatus.body>, Params: z.infer<typeof orderSchemas.updateOrderStatus.params> }>;

type CancelOrderRequest = FastifyRequest<{ Params: z.infer<typeof orderSchemas.cancelOrder.params> }>;

type FinishOrderRequest = FastifyRequest<{ Params: z.infer<typeof orderSchemas.finishOrder.params> }>;

type RemoveOrderItemRequest = FastifyRequest<{ Params: z.infer<typeof orderSchemas.removeOrderItem.params>, Body: z.infer<typeof orderSchemas.removeOrderItem.body> }>;

type SimulateOrderPaymentRequest = FastifyRequest<{ Params: z.infer<typeof orderSchemas.simulateOrderPayment.params> }>;

export default class OrderController {
  static async createOrder(req: NewOrderRequest, res: FastifyReply) {
    try {
      const { id } = req.user;
      const { products } = req.body;

      const newOrderUseCase = makeNewOrder();
      const orderId = await newOrderUseCase.execute({ customerId: id, products });

      return res.status(201).send({
        status: true,
        message: 'Order created successfully',
        data: { id: orderId },
      });
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
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async updateOrderStatus(req: UpdateOrderStatusRequest, res: FastifyReply) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updateOrderStatusUseCase = makeUpdateOrderStatus();
      const order = await updateOrderStatusUseCase.execute(id, status);

      return res.status(200).send({
        status: true,
        message: 'Order status updated successfully',
        data: order,
      });
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
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async cancelOrder(req: CancelOrderRequest, res: FastifyReply) {
    try {
      const { id } = req.params;

      const cancelOrderUseCase = makeCancelOrder();
      await cancelOrderUseCase.execute(id);

      return res.status(200).send({
        status: true,
        message: 'Order cancelled successfully',
      });
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
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async finishOrder(req: FinishOrderRequest, res: FastifyReply) {
    try {
      const { id } = req.params;

      const finishOrderUseCase = makeFinishOrder();
      await finishOrderUseCase.execute(id, req.user.id);

      return res.status(200).send({
        status: true,
        message: 'Order finished successfully',
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).send({
          status: false,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      console.error("Error finishing order:", error);
      return res.status(500).send({
        status: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async removeOrderItem(req: RemoveOrderItemRequest, res: FastifyReply) {
    try {
      const { orderId, itemId } = req.params;
      const { quantity } = req.body;

      const removeOrderItemUseCase = makeRemoveOrderItem();
      await removeOrderItemUseCase.execute(orderId, itemId, quantity);

      return res.status(200).send({
        status: true,
        message: 'Order item removed successfully',
      });
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
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async simulateOrderPayment(req: SimulateOrderPaymentRequest, res: FastifyReply) {
    try {
      const { id } = req.params;

      const simulateOrderPaymentUseCase = makeSimulateOrderPayment();
      const order = await simulateOrderPaymentUseCase.execute(id);

      return res.status(200).send({
        status: true,
        message: 'Order payment simulated successfully',
        data: order,
      });
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
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}