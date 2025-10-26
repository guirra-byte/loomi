import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { RemoveOrderItemUseCase } from "../use-cases/remove-order-item";
import prisma from "@/core/libs/prisma/client";

export function makeRemoveOrderItem() {
  const orderRepository = new OrdersRepository(prisma);
  const removeOrderItemUseCase = new RemoveOrderItemUseCase(orderRepository, prisma);
  return removeOrderItemUseCase;
}