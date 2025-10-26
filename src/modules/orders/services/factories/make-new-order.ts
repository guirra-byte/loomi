import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { NewOrderUseCase } from "../use-cases/new-order";
import prisma from "@/core/libs/prisma/client";

export function makeNewOrder() {
  const orderRepository = new OrdersRepository(prisma);
  const newOrderUseCase = new NewOrderUseCase(orderRepository, prisma);
  return newOrderUseCase;
}