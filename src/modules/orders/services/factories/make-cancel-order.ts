import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { CancelOrderUseCase } from "../use-cases/cancel-order";
import prisma from "@/core/libs/prisma/client";

export function makeCancelOrder() {
  const orderRepository = new OrdersRepository(prisma);
  const cancelOrderUseCase = new CancelOrderUseCase(orderRepository, prisma);
  return cancelOrderUseCase;
}