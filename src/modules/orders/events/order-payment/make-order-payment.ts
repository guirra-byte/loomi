import { AbacatepayService } from "@/core/providers/abacatepay/services/abacatepay.service";
import { OrdersRepository } from "../../repositories/prisma/prisma-orders-repository";
import { OrderPayment } from "./order-payment";
import prisma from "@/core/libs/prisma/client";

export function makeOrderPayment() {
  const orderRepository = new OrdersRepository(prisma);
  const orderPayment = new OrderPayment(orderRepository, prisma, new AbacatepayService());
  return orderPayment;
}