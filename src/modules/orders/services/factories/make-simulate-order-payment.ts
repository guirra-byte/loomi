import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { SimulateOrderPaymentUseCase } from "../use-cases/simulate-order-payment";
import prisma from "@/core/libs/prisma/client";

export function makeSimulateOrderPayment() {
  const orderRepository = new OrdersRepository(prisma);
  const simulateOrderPaymentUseCase = new SimulateOrderPaymentUseCase(orderRepository);
  return simulateOrderPaymentUseCase;
}

