import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { FinishOrderUseCase } from "../use-cases/finish-order";
import prisma from "@/core/libs/prisma/client";

export function makeFinishOrder() {
  const orderRepository = new OrdersRepository(prisma);
  const finishOrderUseCase = new FinishOrderUseCase(orderRepository, prisma);
  return finishOrderUseCase;
}