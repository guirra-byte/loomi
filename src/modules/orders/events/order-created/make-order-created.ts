import { OrderCreated } from "./order-created";
import { AbacatepayService } from "@/core/providers/abacatepay/services/abacatepay.service";
import prisma from "@/core/libs/prisma/client";

export function makeOrderCreated() {
  const orderCreatedUseCase = new OrderCreated(new AbacatepayService(), prisma);
  return orderCreatedUseCase;
}