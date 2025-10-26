import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { UpdateOrderStatusUseCase } from "../use-cases/update-order-status";
import prisma from "@/core/libs/prisma/client";

export function makeUpdateOrderStatus() {
  const orderRepository = new OrdersRepository(prisma);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  return updateOrderStatusUseCase;
}