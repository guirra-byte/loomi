import { OrderStatus, PrismaClient } from "@prisma/client";
import { OrderNotFoundError } from "../../errors";
import { IOrderRepository } from "../../repositories/IOrderRepository";

export class CancelOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaClient
  ) { }

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }

    try {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    } catch (error) {
      throw error;
    }
  }
}