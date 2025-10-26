import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { NewOrderItemUseCase } from "../use-cases/new-order-item";
import prisma from "@/core/libs/prisma/client";

export function makeNewOrder() {
  const orderRepository = new OrdersRepository(prisma);
  const newOrderItemUseCase = new NewOrderItemUseCase(orderRepository, prisma);
  return newOrderItemUseCase;
}